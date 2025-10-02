import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Activity from "@/models/Activity";

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
    status: 204,
    headers: corsHeaders(),
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    await connectToDatabase();

    // Aggregate user data from activities
    const userProfiles = await Activity.aggregate([
      // Filter by username if query is provided
      ...(query ? [{
        $match: {
          username: { $regex: query, $options: 'i' }
        }
      }] : []),
      
      // Group by username to get user statistics
      {
        $group: {
          _id: "$username",
          totalActivities: { $sum: 1 },
          uniqueProblems: { $addToSet: "$problemName" },
          firstActivity: { $min: "$timestamp" },
          lastActivity: { $max: "$timestamp" },
          platforms: { $addToSet: "$platform" },
          submissions: {
            $sum: {
              $cond: [{ $eq: ["$eventType", "submission"] }, 1, 0]
            }
          },
          keyPresses: {
            $sum: {
              $cond: [{ $eq: ["$eventType", "key_press"] }, 1, 0]
            }
          },
          sessions: { $addToSet: "$sessionId" }
        }
      },
      
      // Calculate additional metrics
      {
        $addFields: {
          problemsSolved: { $size: "$uniqueProblems" },
          totalSessions: { $size: "$sessions" },
          activitiesPerProblem: {
            $cond: [
              { $gt: [{ $size: "$uniqueProblems" }, 0] },
              { $divide: ["$totalActivities", { $size: "$uniqueProblems" }] },
              0
            ]
          },
          daysActive: {
            $cond: [
              { $and: ["$firstActivity", "$lastActivity"] },
              {
                $divide: [
                  { $subtract: ["$lastActivity", "$firstActivity"] },
                  86400000 // milliseconds in a day
                ]
              },
              0
            ]
          }
        }
      },
      
      // Sort by total activities (most active users first)
      { $sort: { totalActivities: -1 } },
      
      // Limit results
      { $limit: 50 },
      
      // Format the output
      {
        $project: {
          _id: 0,
          username: "$_id",
          stats: {
            totalActivities: "$totalActivities",
            problemsSolved: "$problemsSolved",
            submissions: "$submissions",
            keyPresses: "$keyPresses",
            totalSessions: "$totalSessions",
            activitiesPerProblem: { $round: ["$activitiesPerProblem", 2] },
            daysActive: { $round: ["$daysActive", 1] }
          },
          platforms: "$platforms",
          firstActivity: "$firstActivity",
          lastActivity: "$lastActivity",
          uniqueProblems: "$uniqueProblems"
        }
      }
    ]);

    return NextResponse.json({
      users: userProfiles,
      total: userProfiles.length
    }, {
      status: 200,
      headers: corsHeaders(),
    });

  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
} 