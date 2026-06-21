"use client"

import { z } from "zod";
import { formOptions } from "@tanstack/react-form";
import { useAppForm } from "@/hooks/use-app-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useCheckout } from "@/features/billing/hooks/use-checkout";

const ttsFormSchema = z.object({
    text: z.string().min(1, "Text is required").max(5000, "Text must be at most 5000 characters"),
    voiceId: z.string().min(1, "Voice selection is required"),
    temperature: z.number(),
    topP: z.number(),
    topK: z.number(),
    repetitionPenalty: z.number(),
});

export type TTSFormValues = z.infer<typeof ttsFormSchema>;

export const defaultTTSFormValues: TTSFormValues = {
    text: "",
    voiceId: "",
    temperature: 0.8,
    topP: 0.95,
    topK: 1000,
    repetitionPenalty: 1.2,
}

export const ttsFormOptions = formOptions({
    defaultValues: defaultTTSFormValues,
})

export function TextToSpeechForm({
    children,
    defaultValues,
}: {
    children: React.ReactNode;
    defaultValues?: TTSFormValues;
}) {
    const trpc = useTRPC();
    const router = useRouter();
    const createMutation = useMutation(trpc.generations.create.mutationOptions({}));

    const { checkout } = useCheckout();

    const form = useAppForm({
        ...ttsFormOptions,
        defaultValues: defaultValues ?? defaultTTSFormValues,
        validators: {
            onSubmit: ttsFormSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                const data = await createMutation.mutateAsync({
                    text: value.text.trim(),
                    voiceId: value.voiceId,
                    temperature: value.temperature,
                    topP: value.topP,
                    topK: value.topK,
                    repetitionPenalty: value.repetitionPenalty,
                });
                toast.success("Audio generation successful!");
                router.push(`/text-to-speech/${data.id}`);
            } catch (e) {
                const message = e instanceof Error ? e.message : "Failed to generate audio."
                if (message.includes("SUBSCRIPTION_REQUIRED")) {
                    toast.error("You need an active subscription to generate audio.", {
                        action: {
                            label: "Subscribe",
                            onClick: () => checkout(),
                        }
                    });
                } else {
                    toast.error(message);
                }
            }
        },
    })

    return <form.AppForm>{children}</form.AppForm>
}