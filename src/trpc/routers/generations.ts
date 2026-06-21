import z from "zod";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/lib/db";
import { chatterbox } from "@/lib/chatterbox-client";
import { uploadAudio } from "@/lib/r2";
import { TEXT_MAX_LENGTH } from "@/features/text-to-speech/data/constants";
import { createTRPCRouter, orgProcedure } from "../init";
import { polar } from "@/lib/polar";

export const generationsRouter = createTRPCRouter({
  getById: orgProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const generation = await prisma.generation.findUnique({
        where: {
          id: input.id,
          orgId: ctx.orgId,
        },
        omit: {
          orgId: true,
          r2ObjectKey: true,
        },
      });

      if (!generation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Generation not found",
        });
      }

      return {
        ...generation,
        audioUrl: `/api/audio/${generation.id}`,
      };
    }),
  getALl: orgProcedure.query(async ({ ctx }) => {
    const generations = await prisma.generation.findMany({
      where: {
        orgId: ctx.orgId,
      },
      orderBy: {
        createdAt: "desc",
      },
      omit: {
        orgId: true,
        r2ObjectKey: true,
      },
    });

    return generations;
  }),
  create: orgProcedure
    .input(
      z.object({
        text: z.string().min(1).max(TEXT_MAX_LENGTH),
        voiceId: z.string().min(1),
        temperature: z.number().min(0).max(2).default(0.8),
        topP: z.number().min(0).max(1).default(0.95),
        topK: z.number().min(1).max(10000).default(1000),
        repetitionPenalty: z.number().min(0).max(2).default(1.2),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const customerState = await polar.customers.getStateExternal({
          externalId: ctx.orgId,
        });

        const hasActiveSubscription =
          (customerState.activeSubscriptions ?? []).length > 0;

        if (!hasActiveSubscription) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "SUBCRIPTION_REQUIRED",
          });
        }
      } catch (e) {
        if (e instanceof TRPCError) {
          throw e;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SUBCRIPTION_REQUIRED",
        });
      }

      const voice = await prisma.voice.findUnique({
        where: {
          id: input.voiceId,
          OR: [
            {
              variant: "SYSTEM",
            },
            {
              variant: "CUSTOM",
              orgId: ctx.orgId,
            },
          ],
        },
        select: {
          id: true,
          name: true,
          r2ObjectKey: true,
        },
      });

      if (!voice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Voice not found",
        });
      }

      if (!voice.r2ObjectKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Voice is missing audio data",
        });
      }

      const { data, error } = await chatterbox.POST("/generate", {
        body: {
          prompt: input.text,
          voice_key: voice.r2ObjectKey,
          temperature: input.temperature,
          top_p: input.topP,
          top_k: input.topK,
          repetition_penalty: input.repetitionPenalty,
          norm_loudness: true,
        },
        parseAs: "arrayBuffer",
      });

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Generation failed: ${error.detail}`,
        });
      }

      if (!(data instanceof ArrayBuffer)) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid audio data received from generation service",
        });
      }

      const buffer = Buffer.from(data);
      let generationId: string | null = null;
      let r2ObjectKey: string | null = null;

      try {
        const generation = await prisma.generation.create({
          data: {
            orgId: ctx.orgId,
            text: input.text,
            voiceName: voice.name,
            voiceId: voice.id,
            temperature: input.temperature,
            topP: input.topP,
            topK: input.topK,
            repititionPenalty: input.repetitionPenalty,
          },
          select: {
            id: true,
          },
        });

        generationId = generation.id;
        r2ObjectKey = `generations/org/${ctx.orgId}/${generation.id}`;
        await uploadAudio({ buffer, key: r2ObjectKey });

        await prisma.generation.update({
          where: {
            id: generation.id,
          },
          data: {
            r2ObjectKey,
          },
        });
      } catch {
        if (generationId) {
          await prisma.generation.delete({
            where: {
              id: generationId,
            },
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save generation",
        });
      }

      if (!generationId || !r2ObjectKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save generation",
        });
      }

      polar.events
        .ingest({
          events: [
            {
              name: "tts_generation",
              externalCustomerId: ctx.orgId,
              metadata: {
                characters: input.text.length,
              },
              timestamp: new Date(),
            },
          ],
        })
        .catch(() => {});

      return { id: generationId };
    }),
});
