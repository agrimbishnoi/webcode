import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Activity from "@/models/Activity";

// Helper function to add CORS headers to responses
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-syntax-sentry-version",
    "Access-Control-Max-Age": "86400",
  };
}


/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

/**
 * GET /api/activity - Retrieve activity logs
 * Supports pagination, filtering by username, problemName, and groupsOnly mode
 */
export async function GET(request: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const username = searchParams.get("username");
    const problemName = searchParams.get("problemName");
    const groupsOnly = searchParams.get("groupsOnly") === "true";
    const forGroup = searchParams.get("forGroup") === "true";
    const countOnly = searchParams.get("countOnly") === "true";

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build query object
    const query: any = {};
    if (username) query.username = { $regex: username, $options: 'i' }; // Case-insensitive search
    if (problemName) query.problemName = problemName;

    // Connect to MongoDB
    await connectToDatabase();

    // Optimize query execution based on the request type
    let activities;
    let totalCount;
    let groupCounts = null;

    // For count-only requests, we'll return counts per group
    if (countOnly) {
      // Aggregate to get counts per username/problemName combination
      groupCounts = await Activity.aggregate([
        { $match: query },
        { 
          $group: { 
            _id: { username: "$username", problemName: "$problemName" },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            username: "$_id.username",
            problemName: "$_id.problemName",
            count: 1
          }
        }
      ]);

      return NextResponse.json({
        groupCounts
      }, {
        status: 200,
        headers: corsHeaders(),
      });
    }
    // For group details, we can optimize by only counting if we need pagination info
    else if (forGroup && username && problemName) {
      // When fetching a specific group's activities, we can optimize the query
      // This is a focused query for a specific username + problemName combination
      activities = await Activity.find(query)
        .sort({ timestamp: -1 })
        .limit(200); // Fixed limit of 200 activities per group (no pagination needed)

      // For group activities, we don't need pagination info
      totalCount = activities.length;
    } else if (groupsOnly) {
      // For groupsOnly mode, optimize to just get latest activity per group
      totalCount = await Activity.aggregate([
        { $match: query },
        { $group: { _id: { username: "$username", problemName: "$problemName" } } },
        { $count: "total" }
      ]).then(result => result[0]?.total || 0);

      // Faster aggregation pipeline for group headers
      const pipeline = [
        { $match: query },
        { $sort: { timestamp: -1 } },
        {
          $group: {
            _id: { username: "$username", problemName: "$problemName" },
            latestActivity: { $first: "$$ROOT" }
          }
        },
        { $replaceRoot: { newRoot: "$latestActivity" } },
        { $limit: Math.min(limit, 500) } // More reasonable limit for grouped view
      ];

      activities = await Activity.aggregate(pipeline as any[]);
    } else {
      // Regular query with pagination for all activities view
      totalCount = await Activity.countDocuments(query);

      activities = await Activity.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(Math.min(limit, 1000)); // Cap limit at 1000 for performance
    }

    return NextResponse.json({
      activities,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
        hasMore: skip + activities.length < totalCount
      }
    }, {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("❌ Error fetching activity data:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, {
      status: 500,
      headers: corsHeaders(),
    });
  }
}

/**
 * POST /api/activity - Log a new activity
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    console.log("Received data:", body);

    // Validate required fields
    if (!body.eventType || !body.sessionId) {
      console.error("Missing required fields:", body);
      return NextResponse.json({ error: "Missing required fields" }, {
        status: 400,
        headers: corsHeaders(),
      });
    }

    // Add missing fields
    body.timestamp = body.timestamp || Date.now();
    body.ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
    body.userAgent = request.headers.get("user-agent");

    // Connect to MongoDB
    await connectToDatabase();

    // Save activity to database
    const newActivity = new Activity(body);
    await newActivity.save();

    try {
      // Don't await this fetch call to make it asynchronous
      console.log(`[Activity API] Triggering AI response for _id: ${newActivity._id} to ${process.env.BASE_URL}/api/airesponse`); // Log the attempt
      fetch(`${process.env.BASE_URL}/api/airesponse`, { // Ensure BASE_URL is defined
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: newActivity._id.toString() }), // Ensure _id is stringified
      }).catch(error => {
        // Log the specific error if the fetch initiation fails
        console.error(`[Activity API] Error initiating fetch to /api/airesponse for _id: ${newActivity._id}:`, error);
      });
    } catch (error) {
      console.error(`[Activity API] Error constructing fetch request to /api/airesponse for _id: ${newActivity._id}:`, error);
      // Continue execution - don't let AI response issues affect activity logging
    }

    return NextResponse.json(
      { message: "activity and its Ai response logged", id: newActivity._id },
      {
        status: 201,
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json({ error: "Failed to log activity" }, {
      status: 500,
      headers: corsHeaders(),
    });
  }
}