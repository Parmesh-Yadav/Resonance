"use client";

import { useState } from "react";
import z from "zod";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AudioLines, FolderOpen, X, FileAudio, Upload, Mic, Tag, Play, Pause, Check, ChevronsUpDown, Globe, Layers, AlignLeft } from "lucide-react";
import locales from "locale-codes";
import { cn, formatFileSize } from "@/lib/utils";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { VOICE_CATEGORIES, VOICE_CATEGORY_LABELS } from "../data/voice-categories";
import { Field, FieldError } from "@/components/ui/field";
import { VoiceRecorder } from "./voice-recorder";

const LANGUAGE_OPTIONS = locales.all
    .filter((l) => l.tag && l.tag.includes("-") && l.name)
    .map((l) => ({
        value: l.tag,
        label: l.location ? `${l.name} (${l.location})` : l.name,
    }))

const voiceCreateFormSchema = z.object({
    name: z.string()
        .min(1, "Voice name is required"),
    file: z.instanceof(File, { message: "Audio file is required" })
        .nullable()
        .refine((f) => f !== null, { message: "Audio file is required" }),
    category: z.string()
        .min(1, "Category is required"),
    language: z.string()
        .min(1, "Language is required"),
    description: z.string()
})

function FileDropzone({
    file,
    onFileChange,
    isInvalid
}: {
    file: File | null;
    onFileChange: (file: File | null) => void;
    isInvalid?: boolean;
}) {
    const { isPlaying, togglePlay } = useAudioPlayback(file);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        accept: { "audio/*": [] },
        multiple: false,
        maxSize: 20 * 1024 * 1024, // 20MB
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFileChange(acceptedFiles[0]);
            }
        }
    });

    if (file) {
        return (
            <div className="flex items-center gap-3 rounded-xl border p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <FileAudio className="size-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                        {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                    </p>
                </div>
                <Button
                    type="button"
                    variant={"outline"}
                    size={"icon-sm"}
                    onClick={togglePlay}
                >
                    {
                        isPlaying
                            ? <Pause className="size-4" />
                            : <Play className="size-4" />
                    }
                </Button>
                <Button
                    type="button"
                    variant={"ghost"}
                    size={"icon-sm"}
                    onClick={() => onFileChange(null)}
                >
                    <X className="size-4" />
                </Button>
            </div>
        )
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border px-6 py-10 transition-colors",
                isDragReject || isInvalid
                    ? "border-destructive"
                    : isDragActive
                        ? "border-primary"
                        : ""
            )}
        >
            <input {...getInputProps()} />
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <AudioLines className="size-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
                <p className="text-base font-semibold tracking-tight">
                    Upload you audio file.
                </p>
                <p className="text-center text-sm text-muted-foreground">
                    Supports all audio formats, max size 20MB. We recommend using a WAV or MP3 file for best results.
                </p>
            </div>
            <Button
                type="button"
                variant={"outline"}
                size={"sm"}
            >
                <FolderOpen className="size-3.5" />
                Upload file
            </Button>
        </div>
    )
}

function LanguageCombobox({
    value,
    onChange,
    isInvalid
}: {
    value: string;
    onChange: (value: string) => void;
    isInvalid?: boolean;
}) {
    const [open, setOpen] = useState(false);

    const selectedLabel = LANGUAGE_OPTIONS.find((option) => option.value === value)?.label || "";

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-invalid={isInvalid}
                    className={cn(
                        "h-9 w-full justify-between font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    <div className="flex items-center gap-2 truncate">
                        <Globe className="size-4 shrink-0 text-muted-foreground" />
                        {value ? selectedLabel : "Select language..."}
                    </div>
                    <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                    <CommandInput placeholder="Search languages..." />
                    <CommandList>
                        <CommandEmpty>No languages found.</CommandEmpty>
                        <CommandGroup>
                            {LANGUAGE_OPTIONS.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    onSelect={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                >
                                    {option.label}
                                    <Check className={cn(
                                        "size-4 ml-auto",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

interface VoiceCreateFormProps {
    scrollable?: boolean;
    footer?: (submit: React.ReactNode) => React.ReactNode
    onError?: (message: string) => void;
}

export function VoiceCreateForm({
    scrollable,
    footer,
    onError }: VoiceCreateFormProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: async ({
            name,
            file,
            category,
            language,
            description
        }: {
            name: string;
            file: File;
            category: string;
            language: string;
            description?: string;
        }) => {
            const params = new URLSearchParams({
                name,
                category,
                language,
            });
            if (description) params.set("description", description);

            const response = await fetch(`/api/voices/create?${params.toString()}`, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create voice");
            }

            return response.json();
        }
    });

    const form = useForm({
        defaultValues: {
            name: "",
            file: null as File | null,
            category: "GENERAL" as string,
            language: "en-US",
            description: ""
        },
        validators: {
            onSubmit: voiceCreateFormSchema
        },
        onSubmit: async ({ value }) => {
            try {
                await createMutation.mutateAsync({
                    name: value.name,
                    file: value.file!,
                    category: value.category,
                    language: value.language,
                    description: value.description
                });
                toast.success("Voice created successfully");
                queryClient.invalidateQueries({
                    queryKey: ["voices"]
                });
                form.reset();
            } catch (e) {
                const message = e instanceof Error ? e.message : "Failed to create voice";
                toast.error(message);
                if (onError) onError(message);
            }
        }
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
            className={cn(
                "flex flex-col",
                scrollable ? "min-h-0 flex-1" : "gap-6"
            )}
        >
            <div className={cn(
                scrollable
                    ? "no-scrollbar flex flex-col gap-6 overflow-y-auto px-4"
                    : "flex flex-col gap-6"
            )}>
                <form.Field name="file">
                    {
                        (field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                                <Field data-invalid={isInvalid} >
                                    <Tabs defaultValue="upload">
                                        <TabsList className="h-11! w-full">
                                            <TabsTrigger value="upload">
                                                <Upload className="size-3.5" />
                                                Upload
                                            </TabsTrigger>
                                            <TabsTrigger value="record">
                                                <Mic className="size-3.5" />
                                                Record
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="upload">
                                            <FileDropzone
                                                file={field.state.value}
                                                onFileChange={(file) => field.handleChange(file)}
                                                isInvalid={isInvalid}
                                            />
                                        </TabsContent>
                                        <TabsContent value="record">
                                            <VoiceRecorder
                                                file={field.state.value}
                                                onFileChange={(file) => field.handleChange(file)}
                                                isInvalid={isInvalid}
                                            />
                                        </TabsContent>
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Tabs>
                                </Field>
                            );
                        }
                    }
                </form.Field>
                <form.Field name="name">
                    {
                        (field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid}>
                                    <div className="relative flex items-center">
                                        <div className="pointer-events-none absolute left-0 flex h-full w-11 items-center justify-center">
                                            <Tag className="size-4 text-muted-foreground" />
                                        </div>
                                        <Input
                                            id={field.name}
                                            placeholder="Voice Label"
                                            className="pl-10"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                        />
                                    </div>
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }
                    }
                </form.Field>
                <form.Field name="category">
                    {
                        (field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid}>
                                    <div className="relative flex items-center">
                                        <div className="pointer-events-none absolute left-0 flex h-full w-11 items-center justify-center">
                                            <Layers className="size-4 text-muted-foreground" />
                                        </div>
                                        <Select
                                            value={field.state.value}
                                            onValueChange={(value) => field.handleChange(value)}
                                        >
                                            <SelectTrigger className="w-full pl-10">
                                                <SelectValue placeholder="Select category..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    VOICE_CATEGORIES.map((category) => (
                                                        <SelectItem key={category} value={category}>
                                                            {VOICE_CATEGORY_LABELS[category]}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }
                    }
                </form.Field>
                <form.Field name="language">
                    {
                        (field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                                <Field data-invalid={isInvalid}>
                                    <LanguageCombobox
                                        value={field.state.value}
                                        onChange={(value) => field.handleChange(value)}
                                        isInvalid={isInvalid}
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }
                    }
                </form.Field>
                <form.Field name="description">
                    {
                        (field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid}>
                                    <div className="relative flex items-center">
                                        <div className="pointer-events-none absolute left-0 flex h-full w-11 items-center justify-center">
                                            <AlignLeft className="size-4 text-muted-foreground" />
                                        </div>
                                        <Textarea
                                            id={field.name}
                                            placeholder="Describe this voice..."
                                            className="min-h-20 pl-10"
                                            rows={3}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                        />
                                    </div>
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }
                    }
                </form.Field>
                <form.Subscribe
                    selector={(s) => ({
                        isSubmitting: s.isSubmitting
                    })}
                >
                    {({ isSubmitting }) => {
                        const submitButton = (
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Voice"}
                            </Button>
                        );
                        return footer ? footer(submitButton) : submitButton;
                    }}
                </form.Subscribe>
            </div>
        </form>
    )
}