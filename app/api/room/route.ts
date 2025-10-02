import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/Room";

// Helper function to add CORS headers to responses
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
 * GET /api/room - Search for rooms
 * Query parameters:
 * - q: Search query for roomId (optional)
 */
export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    // Connect to database
    await connectToDatabase();
    
    let rooms;
    
    if (query) {
      // If query parameter exists, use it to search for rooms
      rooms = await Room.find({ 
        roomId: { $regex: new RegExp(query, 'i') } 
      }).select('roomId usernames')
        .sort({ createdAt: -1 })
        .limit(10);
    } else {
      // If no query parameter, return most recent rooms
      rooms = await Room.find()
        .select('roomId usernames')
        .sort({ createdAt: -1 })
        .limit(10);
    }
    
    return NextResponse.json(rooms, { 
      status: 200,
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("❌ Error searching rooms:", error);
    return NextResponse.json(
      { error: "Failed to search rooms", details: (error as Error).message }, 
      { 
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}

/**
 * POST /api/room - Create a new room
 */
export async function POST(request: Request) {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Generate a unique room ID
    const roomId = await Room.generateUniqueRoomId();
    
    // Create the room
    const room = await Room.create({ 
      roomId,
      usernames: [], // Start with an empty array of usernames
    });
    
    return NextResponse.json({
      success: true,
      room
    }, { 
      status: 201,
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("❌ Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room", details: (error as Error).message }, 
      { 
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}
