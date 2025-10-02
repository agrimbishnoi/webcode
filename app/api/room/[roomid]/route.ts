import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/Room";
import Activity from "@/models/Activity";

// Helper function to add CORS headers to responses
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
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
 * GET /api/room/[roomid] - Get room and activity data for users in a specific room
 */
export async function GET(
  request: Request,
  { params }: { params: { roomid: string } }
) {
  try {
    const roomId = params.roomid;
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters for pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const groupsOnly = searchParams.get("groupsOnly") === "true";
    const username = searchParams.get("username");
    
    // Connect to database
    await connectToDatabase();
    
    // Find the room
    const room = await Room.findOne({ roomId });
    
    if (!room) {
      return NextResponse.json(
        { error: "Room not found" }, 
        { 
          status: 404,
          headers: corsHeaders(),
        }
      );
    }
    
    // Get usernames in the room
    const { usernames } = room;
    
    if (!usernames || usernames.length === 0) {
      return NextResponse.json({
        room,
        activities: []
      }, { 
        status: 200,
        headers: corsHeaders(),
      });
    }
    
    // Build the base query for activities from all users in the room
    let activityQuery: any = {};
    
    if (username) {
      // Find room usernames that match the search term (case-insensitive)
      const matchingRoomUsers = usernames.filter((user: string) => 
        user.toLowerCase().includes(username.toLowerCase())
      );
      
      if (matchingRoomUsers.length > 0) {
        // Create case-insensitive regex pattern for matching usernames
        const regexPattern = matchingRoomUsers.map(user => 
          user.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special regex characters
        ).join('|');
        
        activityQuery.username = {
          $regex: `^(${regexPattern})$`,
          $options: 'i'
        };
      } else {
        // No matching room users, return empty result
        activityQuery.username = { $regex: '^$' }; // Matches nothing
      }
    } else {
      // No search filter, get activities for all room users (case-insensitive)
      const regexPattern = usernames.map(user => 
        user.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special regex characters
      ).join('|');
      
      activityQuery.username = {
        $regex: `^(${regexPattern})$`,
        $options: 'i'
      };
    }
    
    let activities;
    
    if (groupsOnly) {
      // For grouped view, get all activities but return them in a way that allows frontend grouping
      // We'll return all activities sorted by timestamp, and the frontend will handle grouping
      activities = await Activity.find(activityQuery)
      .sort({ timestamp: -1 });
      
    } else {
      // For all activities view, use pagination
      const skip = (page - 1) * limit;
      
      activities = await Activity.find(activityQuery)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
    }
    
    return NextResponse.json({
      room,
      activities,
      pagination: groupsOnly ? null : {
        page,
        limit,
        total: await Activity.countDocuments(activityQuery)
      }
    }, { 
      status: 200,
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("❌ Error fetching room data:", error);
    return NextResponse.json(
      { error: "Failed to fetch room data", details: (error as Error).message }, 
      { 
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}
