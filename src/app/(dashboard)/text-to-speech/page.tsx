import { TextToSpeechView } from "@/features/text-to-speech/views/text-to-speech-view"
import type { Metadata } from "next"
import { trpc, HydrateClient, prefetch } from "@/trpc/server"

export const metadata: Metadata = {
    title: "Text to Speech",
    description: "Convert your text into natural-sounding speech with our Text to Speech feature. Perfect for creating voiceovers, audiobooks, and more.",
}

export default async function TextToSpeechPage({
    searchParams
}: {
    searchParams: Promise<{ text?: string; voiceId?: string }>
}) {
    const { text, voiceId } = await searchParams;

    prefetch(trpc.voices.getAll.queryOptions());
    prefetch(trpc.generations.getALl.queryOptions());

    return (
        <HydrateClient>
            <TextToSpeechView initialValues={{ text, voiceId }} />
        </HydrateClient>
    )
}