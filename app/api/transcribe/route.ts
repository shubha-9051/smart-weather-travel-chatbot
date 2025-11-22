import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const transcription = await groq.audio.transcriptions.create({
            file: file,
            model: "whisper-large-v3",
            response_format: "json",
            language: "ja", // Hint for Japanese, but it auto-detects too
        });

        return NextResponse.json({ text: transcription.text });
    } catch (error) {
        console.error("Error in transcription API:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
