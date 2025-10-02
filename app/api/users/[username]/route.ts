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

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;

    await connectToDatabase();

    // Get detailed user profile
    const userProfile = await Activity.aggregate([
      {
        $match: { username: username }
      },
      {
        $group: {
          _id: "$username",
          totalActivities: { $sum: 1 },
          uniqueProblems: { $addToSet: "$problemName" },
          problemDetails: {
            $push: {
              problemName: "$problemName",
              timestamp: "$timestamp",
              eventType: "$eventType",
              platform: "$platform"
            }
          },
          firstActivity: { $min: "$timestamp" },
          lastActivity: { $max: "$timestamp" },
          platforms: { $addToSet: "$platform" },
          eventTypes: { $addToSet: "$eventType" },
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
          sessions: { $addToSet: "$sessionId" },
          avgContentLength: { $avg: "$contentLength" }
        }
      },
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
                  86400000
                ]
              },
              0
            ]
          }
        }
      }
    ]);

    if (userProfile.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders() }
      );
    }

    const profile = userProfile[0];

    // Get problem-wise activity breakdown
    const problemBreakdown = await Activity.aggregate([
      { $match: { username: username, problemName: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$problemName",
          activities: { $sum: 1 },
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
          sessions: { $addToSet: "$sessionId" },
          firstWorked: { $min: "$timestamp" },
          lastWorked: { $max: "$timestamp" },
          platforms: { $addToSet: "$platform" }
        }
      },
      {
        $addFields: {
          sessionCount: { $size: "$sessions" },
          timeSpent: {
            $cond: [
              { $and: ["$firstWorked", "$lastWorked"] },
              { $subtract: ["$lastWorked", "$firstWorked"] },
              0
            ]
          }
        }
      },
      { $sort: { activities: -1 } }
    ]);

    // Get recent activity timeline
    const recentActivities = await Activity.find({ username: username })
      .sort({ timestamp: -1 })
      .limit(20)
      .select('eventType problemName timestamp platform sessionId');

    // Calculate activity patterns (by hour of day)
    const activityPatterns = await Activity.aggregate([
      { $match: { username: username } },
      {
        $group: {
          _id: { $hour: "$timestamp" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const formattedProfile = {
      username: profile._id,
      stats: {
        totalActivities: profile.totalActivities,
        problemsSolved: profile.problemsSolved,
        submissions: profile.submissions,
        keyPresses: profile.keyPresses,
        totalSessions: profile.totalSessions,
        activitiesPerProblem: Math.round(profile.activitiesPerProblem * 100) / 100,
        daysActive: Math.round(profile.daysActive * 10) / 10,
        avgContentLength: Math.round((profile.avgContentLength || 0) * 100) / 100
      },
      platforms: profile.platforms.filter((p: string | null) => p != null),
      eventTypes: profile.eventTypes,
      timeline: {
        firstActivity: profile.firstActivity,
        lastActivity: profile.lastActivity
      },
      problemBreakdown: problemBreakdown.map(p => ({
        problemName: p._id,
        activities: p.activities,
        submissions: p.submissions,
        keyPresses: p.keyPresses,
        sessionCount: p.sessionCount,
        timeSpentMs: p.timeSpent,
        timeSpentHours: Math.round((p.timeSpent / (1000 * 60 * 60)) * 100) / 100,
        platforms: p.platforms.filter((platform: string | null) => platform != null),
        firstWorked: p.firstWorked,
        lastWorked: p.lastWorked
      })),
      recentActivities: recentActivities,
      activityPatterns: activityPatterns.map(pattern => ({
        hour: pattern._id,
        count: pattern.count
      }))
    };

    return NextResponse.json(formattedProfile, {
      status: 200,
      headers: corsHeaders(),
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
} 