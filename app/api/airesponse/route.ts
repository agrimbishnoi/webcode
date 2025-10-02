import { NextRequest, NextResponse } from "next/server";
import Activity from "@/models/Activity";
import { connectToDatabase } from "@/lib/mongodb";

// Keep the script mapping in your NextJS API
const scriptMapping: Record<string, string> = {
    copy: "copymain.py",
    paste: "paste.py",
    key_press: "keymain.py",
    window_blurred: "tab.py",
    window_focused: "tab.py",
    tab_activated: "tab.py",
    tab_deactivated: "tab.py",
    submission: "cpp.py"
};

export async function POST(req: NextRequest) {
    let documentId: string | null = null;
    let eventType: string | null = null;

    try {
        const { _id } = await req.json();
        documentId = _id;
        console.log(`[AIResponse API] Received request for _id: ${documentId}`);

        if (!documentId) {
            console.error("[AIResponse API] Missing _id in request body");
            return NextResponse.json({ error: "Missing _id" }, { status: 400 });
        }

        await connectToDatabase();

        const document = await Activity.findById(documentId);

        if (!document) {
            console.error(`[AIResponse API] Document not found for _id: ${documentId}`);
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        eventType = document.eventType;
        console.log(`[AIResponse API] Found document for _id: ${documentId}, eventType: ${eventType}`);

        const script_name = eventType ? scriptMapping[eventType] : undefined;

        if (!script_name) {
            console.error(`[AIResponse API] Invalid eventType '${eventType}' for _id: ${documentId}. No script mapped.`);
            return NextResponse.json({ error: `Invalid eventType: ${eventType}` }, { status: 400 });
        }
        console.log(`[AIResponse API] Mapped eventType ${eventType} to script: ${script_name} for _id: ${documentId}`);

        // External API Call
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            console.log(`[AIResponse API] Calling FastAPI (${process.env.FASTAPI_URL || 'https://syntax-sentry-ai-api.onrender.com/execute'}) for _id: ${documentId}`);
            const apiResponse = await fetch(process.env.FASTAPI_URL || "https://syntax-sentry-ai-api.onrender.com/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    script_name: script_name,
                    object_id: documentId
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const responseStatus = apiResponse.status;
            console.log(`[AIResponse API] FastAPI response status: ${responseStatus} for _id: ${documentId}`);

            if (!apiResponse.ok) {
                return NextResponse.json({ 
                    message: "External API call failed", 
                    status: responseStatus,
                    documentId: documentId 
                }, { status: 207 });
            }

            return NextResponse.json({
                message: "Request forwarded to external API successfully",
                documentId: documentId
            }, { status: 200 });

        } catch (fetchError) {
            clearTimeout(timeoutId);
            const isTimeout = fetchError instanceof DOMException && fetchError.name === "AbortError";
            const errorMessage = isTimeout ? "API request timed out after 15 seconds" : `Error calling AI API: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`;
            console.error(`[AIResponse API] ${errorMessage} for _id: ${documentId}`);

            return NextResponse.json({ 
                message: "Failed to forward request to external API", 
                error: errorMessage, 
                documentId: documentId 
            }, { status: 500 });
        }
    } catch (error) {
        console.error(`[AIResponse API] Internal server error for _id: ${documentId || 'unknown'}:`, error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}