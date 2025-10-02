// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import mongoose from "mongoose";
// import AIResponse from "@/models/airesponse";

// export async function POST(req: NextRequest) {
//   try {
//     const { activityIds } = await req.json();

//     if (!activityIds || !Array.isArray(activityIds) || activityIds.length === 0) {
//       return NextResponse.json({ error: "Invalid activityIds" }, { status: 400 });
//     }

//     await connectToDatabase();

//     // Convert string IDs to ObjectIds
//     const objectIds = activityIds.map(id => {
//       try {
//         return new mongoose.Types.ObjectId(id);
//       } catch (error) {
//         console.error(`Invalid ObjectId: ${id}`);
//         return null;
//       }
//     }).filter(id => id !== null);

//     if (objectIds.length === 0) {
//       return NextResponse.json({ error: "No valid activity IDs provided" }, { status: 400 });
//     }

//     // Find all AI responses for the given activity IDs
//     const responses = await AIResponse.find({
//       documentId: { $in: objectIds }
//     }).lean();

//     // Convert ObjectId to string for frontend consumption
//     const processedResponses = responses.map(response => ({
//       ...response,
//       documentId: response.documentId.toString()
//     }));

//     return NextResponse.json({
//       responses: processedResponses,
//       count: responses.length
//     }, { status: 200 });
//   } catch (error) {
//     console.error("Error checking AI responses:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


// /api/airesponse/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import AIResponse from "@/models/airesponse"; // Make sure this model defines documentId as String

export async function POST(req: NextRequest) {
  try {
    const { activityIds } = await req.json();

    // Basic validation
    if (!activityIds || !Array.isArray(activityIds) || activityIds.length === 0) {
      console.warn("API /airesponse/check: Invalid or empty activityIds received.");
      return NextResponse.json({ error: "Invalid activityIds provided" }, { status: 400 });
    }

    // Optional: Validate if the strings *look* like ObjectIds, but keep them as strings
    const validStringIds = activityIds.filter(id => typeof id === 'string' && mongoose.Types.ObjectId.isValid(id));

    if (validStringIds.length === 0) {
        console.warn("API /airesponse/check: No valid-looking activity IDs after filtering.", { originalIds: activityIds });
      return NextResponse.json({ error: "No valid activity IDs provided" }, { status: 400 });
    }

    if (validStringIds.length < activityIds.length) {
        console.warn("API /airesponse/check: Some activity IDs were invalid.", { originalCount: activityIds.length, validCount: validStringIds.length });
    }

    await connectToDatabase();

    console.log(`API /airesponse/check: Querying for ${validStringIds.length} documentIds (as strings):`); // Log first few

    // --- CORE CHANGE: Query using the string IDs directly ---
    const responses = await AIResponse.find({
      documentId: { $in: validStringIds } // Query String field with String values
    }).lean(); // Use .lean() for performance

    console.log(`API /airesponse/check: Found ${responses.length} AI responses in DB for the provided IDs.`);

    // Prepare responses for the frontend
    // Ensure the AIResponse's own _id is stringified, documentId is already a string
    const processedResponses = responses.map(response => ({
      ...response,
      _id: response._id?.toString(), // Stringify the AIResponse's own _id
      // documentId should already be a string as per schema/assumption
    }));

    return NextResponse.json({
      responses: processedResponses,
      count: responses.length
    }, { status: 200 });

  } catch (error) {
    console.error("API /airesponse/check: Error checking AI responses:", error);
    // Provide more context in logs if possible
    if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
    }
    return NextResponse.json({ error: "Internal server error while checking AI responses" }, { status: 500 });
  }
}