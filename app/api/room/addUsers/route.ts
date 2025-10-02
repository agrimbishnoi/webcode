import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/Room";

// Helper function to add CORS headers to responses
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

/**
 * POST /api/room/addUsers - Add users to a room
 * Required body parameters:
 * - roomId: Room ID to add users to
 * - usernames: Array of usernames to add
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.roomId) {
      return NextResponse.json(
        { error: "Missing required field: roomId" }, 
        { 
          status: 400,
          headers: corsHeaders(),
        }
      );
    }
    
    if (!body.usernames || !Array.isArray(body.usernames) || body.usernames.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid field: usernames (must be non-empty array)" }, 
        { 
          status: 400,
          headers: corsHeaders(),
        }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Find the room
    const room = await Room.findOne({ roomId: body.roomId });
    
    if (!room) {
      return NextResponse.json(
        { error: "Room not found" }, 
        { 
          status: 404,
          headers: corsHeaders(),
        }
      );
    }
    
    // Add usernames to the room (avoiding duplicates - case-insensitive)
    const newUsernames = body.usernames.filter(
      (username: string) => !room.usernames.some((existingUser: string) => 
        existingUser.toLowerCase() === username.toLowerCase()
      )
    );
    
    if (newUsernames.length > 0) {
      // Update the room with new usernames
      await Room.updateOne(
        { roomId: body.roomId }, 
        { $push: { usernames: { $each: newUsernames } } }
      );
    }
    
    // Get the updated room
    const updatedRoom = await Room.findOne({ roomId: body.roomId });
    
    return NextResponse.json({
      success: true,
      room: updatedRoom
    }, { 
      status: 200,
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("❌ Error adding users to room:", error);
    return NextResponse.json(
      { error: "Failed to add users to room", details: (error as Error).message }, 
      { 
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}
