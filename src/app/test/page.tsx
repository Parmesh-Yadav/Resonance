import { prisma } from "@/lib/db";

export default async function TestPage() {
    const voices = await prisma.voice.findMany();

    return (
        <div className="mx-auto my-8 max-w-160 rounded-xl border border-[#e5e7eb] bg-white p-5">
            <h1 className="mb-3 text-xl font-semibold">Voice List</h1>
            <ul className="m-0 grid list-none gap-2 p-0">
                {voices.map((voice) => (
                    <li
                        key={voice.id}
                        className="rounded-lg border border-[#f1f5f9] bg-[#f8fafc] px-3 py-2"
                    >
                        {voice.name} - {voice.variant}
                    </li>
                ))}
            </ul>
        </div>
    );
}