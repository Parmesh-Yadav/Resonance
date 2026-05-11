"use client"

import { z } from "zod";
import { formOptions } from "@tanstack/react-form";
import { useAppForm } from "@/hooks/use-app-form";

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
    const form = useAppForm({
        ...ttsFormOptions,
        defaultValues: defaultValues ?? defaultTTSFormValues,
        validators: {
            onSubmit: ttsFormSchema,
        },
        onSubmit: async () => {
            // generation logic to be implemented here
        },
    })

    return <form.AppForm>{children}</form.AppForm>
}