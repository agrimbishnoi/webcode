"use client";
import { Bell, Home, HelpCircle, Settings, Shield, ChartColumn,LayoutDashboard,Building,DoorOpen, Mail, User,LifeBuoy,Headphones, FileText, Lock, FileJson2 } from "lucide-react";
import { ExpandableTabs } from "@/app/components/expandable-tabs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/popup";
import { js_beautify } from "js-beautify";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import javascript from "highlight.js/lib/languages/javascript";
import cpp from "highlight.js/lib/languages/cpp";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";

// Register languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("python", python);
hljs.registerLanguage("java", java);

import {
  Hexagon,
  Github,
  Twitter,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Users,
  Search,
} from "lucide-react";
import { Input } from "@/app/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { getQuestionData } from "../../dashboard/GetQuestionData";

interface Room {
  _id: string;
  roomId: string;
  usernames: string[];
  createdAt: string;
  updatedAt: string;
}

interface Activity {
  _id: string;
  eventType: string;
  timestamp: string;
  sessionId: string;
  username: string;
  problemName: string;
  platform: string;
  keyLogs?: {
    key: string;
    timestamp: number;
    elementType: string;
    elementId: string;
  }[];
  details?: {
    viewportWidth?: number;
    viewportHeight?: number;
    data?: any;
  };
  data: string;
  ipAddress: string;
  userAgent: string;
  code?: string;
  status?: string;
  problemTitle: string;
  fromUrl?: string;
  fromTitle?: string;
  toUrl?: string;
  toTitle?: string;
  fromTimestamp?: number;
  toTimestamp?: number;
  timeAwayMs?: number;
  numberOfKeys?: number;
  totalKeyPresses?: number;
  totalMouseDistance?: number;
  keyPressCount?: number;
  copyPasteCount?: number;
  sessionDuration?: number;
  createdAt: string;
  updatedAt: string;
}

interface GroupedData {
  username: string;
  problemName: string;
  activities: Activity[];
  count: number;
  latestActivity: Activity;
  isOpen: boolean;
  activitiesLoaded: boolean;
  questionData?: {
    frontendQuestionId: string;
    difficulty: string;
    title: string;
  };
}

interface AIResponse {
  documentId: string;
  eventType: string;
  response: any;
  status: string;
  createdAt: string;
}

// Group activities by username and problem - same as dashboard
async function groupActivitiesByUsernameAndProblem(
  activities: Activity[]
): Promise<GroupedData[]> {
  const grouped: Record<string, Record<string, Activity[]>> = {};

  activities.forEach((activity) => {
    if (!grouped[activity.username]) {
      grouped[activity.username] = {};
    }

    if (!grouped[activity.username][activity.problemName]) {
      grouped[activity.username][activity.problemName] = [];
    }

    grouped[activity.username][activity.problemName].push(activity);
  });

  const result: GroupedData[] = [];

  const promises = Object.entries(grouped).flatMap(([username, problems]) =>
    Object.entries(problems).map(async ([problemName, activities]) => {
      const questionData = await getQuestionData(problemName);

      const sortedActivities = activities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return {
        username,
        problemName,
        activities: [sortedActivities[0]],
        count: activities.length,
        latestActivity: sortedActivities[0],
        isOpen: false,
        activitiesLoaded: false,
        questionData: {
          frontendQuestionId: questionData.frontendQuestionId,
          difficulty: questionData.difficulty,
          title: questionData.title,
        },
      };
    })
  );

  const groupedData = await Promise.all(promises);
  return groupedData.sort(
    (a, b) =>
      new Date(b.latestActivity.timestamp).getTime() -
      new Date(a.latestActivity.timestamp).getTime()
  );
}

function Popupsmall({ activityId, aiResponses }: { activityId: string, aiResponses: Record<string, AIResponse> }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2">
          <FileJson2 className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[400px] py-3 shadow-none" side="top">
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-[13px] font-medium">AI JSON Response</p>
            {aiResponses && aiResponses[activityId] ? (
              <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto max-h-[300px]">
                {JSON.stringify(aiResponses[activityId]?.response, null, 2)}
              </pre>
            ) : (
              <p className="text-xs text-muted-foreground">
                No AI response available for this activity yet.
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Function to get event type badge color - same as dashboard
function getEventTypeBadge(eventType: string) {
  switch (eventType) {
    case "key_press":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800"
        >
          Key Press
        </Badge>
      );
    case "mouse_movement":
      return (
        <Badge
          variant="outline"
          className="bg-teal-500/10 text-teal-600 border-teal-200 dark:border-teal-800"
        >
          Mouse Movement
        </Badge>
      );
    case "url_changed":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800"
        >
          URL changed
        </Badge>
      );
    case "tab_activated":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800"
        >
          Tab Switched In
        </Badge>
      );
    case "tab_deactivated":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800"
        >
          Tab Switched Out
        </Badge>
      );
    case "window_focused":
      return (
        <Badge
          variant="outline"
          className="bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-200 dark:border-fuchsia-800"
        >
          Window Focused
        </Badge>
      );
    case "window_blurred":
      return (
        <Badge
          variant="outline"
          className="bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-200 dark:border-fuchsia-800"
        >
          Window Minimized
        </Badge>
      );
    case "session_ended":
      return (
        <Badge
          variant="outline"
          className="bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800"
        >
          Session Ended
        </Badge>
      );
    case "copy":
      return (
        <Badge
          variant="outline"
          className="bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800"
        >
          Copy
        </Badge>
      );
    case "paste":
      return (
        <Badge
          variant="outline"
          className="bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800"
        >
          Paste
        </Badge>
      );
    case "submission":
      return (
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-800"
        >
          Submission
        </Badge>
      );
    default:
      return <Badge variant="outline">{eventType}</Badge>;
  }
}

// Function to get difficulty badge color - same as dashboard
function getDifficultyBadge(difficulty: string) {
  switch (difficulty) {
    case "Easy":
      return (
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-800"
        >
          {difficulty}
        </Badge>
      );
    case "Medium":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800"
        >
          {difficulty}
        </Badge>
      );
    case "Hard":
      return (
        <Badge
          variant="outline"
          className="bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800"
        >
          {difficulty}
        </Badge>
      );
    default:
      return <Badge variant="outline">{difficulty}</Badge>;
  }
}

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomid as string;
  
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [filteredActivitiesList, setFilteredActivitiesList] = useState<Activity[]>([]);
  const [filteredGroupedData, setFilteredGroupedData] = useState<GroupedData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingGroupActivities, setLoadingGroupActivities] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [view, setView] = useState<"grouped" | "all">("grouped");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [aiResponses, setAiResponses] = useState<Record<string, AIResponse>>({});
  const [groupActivityCounts, setGroupActivityCounts] = useState<Record<string, number>>({});

  const loadMoreRef = React.useRef<HTMLDivElement>(null);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  // Fetch AI responses for a list of activity IDs - same as dashboard
  const fetchAIResponses = async (activityIds: string[]) => {
    if (!activityIds || activityIds.length === 0) return;

    const idsToFetch = activityIds.filter(id => !aiResponses[id]);
    if (idsToFetch.length === 0) return;

    try {
      const response = await fetch(`/api/airesponse/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityIds: idsToFetch }),
      });

      if (!response.ok) return;

      const data = await response.json();
      const newResponses = data.responses.reduce((acc: Record<string, AIResponse>, response: AIResponse) => {
        acc[response.documentId] = response;
        return acc;
      }, {});

      setAiResponses(prev => ({ ...prev, ...newResponses }));
    } catch (error) {
      console.error('Error fetching AI responses:', error);
    }
  };

  // Get AI status for an activity - same as dashboard
  const getAIStatus = (activity: Activity) => {
    if (!activity || !activity._id) return "gray";

    const activityId = activity._id.toString();
    if (aiResponses && aiResponses[activityId]) return "green";

    const aiEligibleEventTypes = [
      "copy", "paste", "key_press", "window_blurred", "window_focused",
      "tab_activated", "tab_deactivated", "submission", "mouse_move", "tab", "code"
    ];

    return aiEligibleEventTypes.includes(activity.eventType) ? "orange" : "gray";
  };

  // Get AI status hover text - same as dashboard
  const getAIStatusHoverText = (status: string) => {
    if (status === "green") return "AI has analyzed this activity";
    if (status === "orange") return "Waiting for AI analysis";
    return "No AI analysis needed for this activity type";
  };

  // Render AI status indicator - same as dashboard
  const renderAIStatus = (activity: Activity) => {
    const status = getAIStatus(activity);
    const hoverText = getAIStatusHoverText(status);

    return (
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: status }}
        title={hoverText}
      ></div>
    );
  };

  // Toggle row expansion - same as dashboard
  const toggleRow = (id: string) => {
    const newExpandedState = !expandedRows[id];
    setExpandedRows((prev) => ({ ...prev, [id]: newExpandedState }));
    if (newExpandedState && !aiResponses[id]) {
      fetchAIResponses([id]);
    }
  };

  // Fetch group activities - same as dashboard
  async function fetchGroupActivities(groupIndex: number) {
    const group = groupedData[groupIndex];
    if (!group || group.activitiesLoaded) return;

    setLoadingGroupActivities((prev) => ({ ...prev, [groupIndex]: true }));

    try {
      const response = await fetch(
        `/api/activity?username=${encodeURIComponent(group.username)}&problemName=${encodeURIComponent(group.problemName)}&forGroup=true`
      );

      if (!response.ok) throw new Error(`Failed to fetch group activities: ${response.status}`);

      const data = await response.json();
      const groupActivities = data.activities;

      setGroupedData((prev) => {
        const newData = [...prev];
        newData[groupIndex] = {
          ...newData[groupIndex],
          activities: groupActivities,
          activitiesLoaded: true,
        };
        return newData;
      });

      // Also update the filtered grouped data
      setFilteredGroupedData((prev) => {
        const group = groupedData[groupIndex];
        const filteredIndex = prev.findIndex(
          (filteredGroup) => filteredGroup.username === group.username && filteredGroup.problemName === group.problemName
        );
        if (filteredIndex !== -1) {
          const newData = [...prev];
          newData[filteredIndex] = {
            ...newData[filteredIndex],
            activities: groupActivities,
            activitiesLoaded: true,
          };
          return newData;
        }
        return prev;
      });

      if (groupActivities && groupActivities.length > 0) {
        const activityIds = groupActivities.map((activity: Activity) => activity._id);
        await fetchAIResponses(activityIds);
      }
    } catch (error) {
      console.error(`Error fetching group ${groupIndex} activities:`, error);
      setError(`Failed to fetch activities for ${group.username}/${group.problemName}`);
    } finally {
      setLoadingGroupActivities((prev) => ({ ...prev, [groupIndex]: false }));
    }
  }

  // Toggle group expansion - same as dashboard
  const toggleGroup = async (filteredIndex: number) => {
    const filteredGroup = filteredGroupedData[filteredIndex];
    if (!filteredGroup) return;

    // Find the original index in the groupedData array
    const originalIndex = groupedData.findIndex(
      (group) => group.username === filteredGroup.username && group.problemName === filteredGroup.problemName
    );
    
    if (originalIndex === -1) return;

    const group = groupedData[originalIndex];
    const willBeOpen = !group.isOpen;
    
    setGroupedData((prev) => {
      const newData = [...prev];
      newData[originalIndex] = { ...newData[originalIndex], isOpen: willBeOpen };
      return newData;
    });

    // Also update the filtered data
    setFilteredGroupedData((prev) => {
      const newData = [...prev];
      newData[filteredIndex] = { ...newData[filteredIndex], isOpen: willBeOpen };
      return newData;
    });

    if (willBeOpen && !group.activitiesLoaded) {
      await fetchGroupActivities(originalIndex);
    }
  };

  // Fetch room data and activities
  const fetchRoomData = async () => {
    try {
      setIsRefreshing(true);
      
      // Fetch all activities for grouping (no pagination for grouped view)
      const groupResponse = await fetch(`/api/room/${roomId}?groupsOnly=true`);
      
      if (!groupResponse.ok) {
        if (groupResponse.status === 404) {
          setError(`Room ${roomId} not found`);
        } else {
          const errorData = await groupResponse.json();
          setError(errorData.error || "Failed to fetch room data");
        }
        setIsLoading(false);
        return;
      }
      
      const groupData = await groupResponse.json();
      setRoom(groupData.room);
      
      // Store all activities for grouping
      const allActivities = groupData.activities || [];
      
      // Process grouped data from all activities
      const grouped = await groupActivitiesByUsernameAndProblem(allActivities);
      setGroupedData(grouped);
      
      // Initialize filtered grouped data
      const filteredGrouped = grouped.filter((group) =>
        group.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGroupedData(filteredGrouped);
      
      // If we're in "all" view, fetch paginated activities separately
      if (view === "all") {
        await fetchActivitiesForRoom(1, true);
      } else {
        // For grouped view, we use the all activities data
        setActivities(allActivities);
        // Apply client-side filtering for search
        setFilteredActivitiesList(allActivities.filter((activity: Activity) =>
          activity.username.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      }
      
      setError(null);
    } catch (error) {
      console.error("Error fetching room data:", error);
      setError("Failed to fetch room data. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch activities for "all" view with pagination (infinite scroll)
  const fetchActivitiesForRoom = async (pageNum = page, isNewSearch = false) => {
    setLoadingMore(true);
    try {
      const limit = 20;
      // Remove username filtering from API call to get all users' activities
      
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/room/${roomId}?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !data.activities) {
        throw new Error("Invalid response format from server");
      }

      // Sort by newest first
      const sortedActivities = data.activities.sort(
        (a: Activity, b: Activity) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Apply client-side filtering for search
      const filteredActivities = sortedActivities.filter((activity: Activity) =>
        activity.username.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // If it's a new search, replace activities, otherwise append
      if (isNewSearch) {
        setActivities(sortedActivities);
        setFilteredActivitiesList(filteredActivities);
      } else {
        const newActivities = [...activities, ...sortedActivities];
        setActivities(newActivities);
        // Apply search filter to the combined activities
        const newFilteredActivities = newActivities.filter((activity: Activity) =>
          activity.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredActivitiesList(newFilteredActivities);
      }

      // Fetch AI responses for the newly loaded activities
      const activityIds = sortedActivities.map((activity: Activity) => activity._id);
      if (activityIds.length > 0) {
        fetchAIResponses(activityIds);
      }

      // Check if we have more data to load
      setHasMore(data.activities.length >= limit);
    } catch (error) {
      console.error("❌ Error fetching activities:", error);
      setError("Failed to fetch activities. Please try again later.");
    } finally {
      setLoadingMore(false);
    }
  };

  // Update filtered activities list when activities or search term changes
  useEffect(() => {
    // Apply client-side filtering whenever activities or search term changes
    const filtered = activities.filter((activity) =>
      activity.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredActivitiesList(filtered);
    
    // Also update grouped data filtering while preserving state
    const filteredGrouped = groupedData
      .filter((group) =>
        group.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((group) => ({ ...group })); // Create a copy to avoid reference issues
    setFilteredGroupedData(filteredGrouped);
  }, [activities, searchTerm, groupedData, view]);

  // Fetch data on initial load and when search term changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchRoomData();
  }, [roomId]); // Remove searchTerm from dependency array since we handle it client-side now

  // Handle view changes
  useEffect(() => {
    if (view === "all") {
      setPage(1);
      setHasMore(true);
      setActivities([]);
      fetchActivitiesForRoom(1, true);
    }
  }, [view]);

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    // Disconnect previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Only set up observer for "all" view
    if (view === "all") {
      // Create new observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && hasMore && !loadingMore) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );

      // Observe the load more element if it exists
      if (loadMoreRef.current) {
        observerRef.current.observe(loadMoreRef.current);
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, view, loadMoreRef.current]);

  // Function to load more data
  const loadMore = () => {
    if (!loadingMore && hasMore && view === "all") {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchActivitiesForRoom(nextPage, false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
const tabs = [
  { title: "Home", icon: <Home size={20} />, href: "/" },
  { title: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
  { title: "Room", icon: <DoorOpen size={20} />, href: "/room" },
  { type: "separator" as const },
  { title: "Docs", icon: <FileText size={20} />, href: "/docs" },
  { title: "Support", icon: <LifeBuoy size={20} />, href: "/contact" }
];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex justify-center items-center mt-3 md:hidden ">
        <ExpandableTabs tabs={tabs} />
      </div>
      
      <main className="flex-1 container py-12 px-4 md:px-6">
        <Card className="shadow-lg border-border/40">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold">Room: {roomId}</CardTitle>
                <CardDescription className="mt-1">
                  {room && (
                    <>
                      Created {formatDate(room.createdAt)} • {room.usernames.length} users
                    </>
                  )}
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={fetchRoomData}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </Button>
                <Select
                  value={view}
                  onValueChange={(value) => setView(value as "grouped" | "all")}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grouped">Grouped View</SelectItem>
                    <SelectItem value="all">All Activities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative mt-4">
              <div className="relative">
                <Input
                  className="pl-9"
                  placeholder="Search by username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Search className="h-4 w-4" />
                </div>
              </div>
            </div>
          </CardHeader>

          {room && (
            <div className="px-6 pb-4">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Users in this Room
                  </CardTitle>
                  <CardDescription>
                    Activity data is shown only for these users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {room.usernames.length === 0 ? (
                    <p className="text-muted-foreground">No users added to this room yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {room.usernames.map((username, index) => (
                        <Badge key={index} variant="secondary">
                          {username}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <CardContent className="px-0">
            <div className="overflow-x-auto rounded-md border">
              {isLoading && activities.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Loading activity data...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center text-red-500">
                  <p>{error}</p>
                </div>
              ) : view === "grouped" && filteredGroupedData.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No activities found.</p>
                </div>
              ) : view === "all" && filteredActivitiesList.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No activities found.</p>
                </div>
              ) : view === "grouped" ? (
                // Grouped view - same structure as dashboard
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Problem</TableHead>
                      <TableHead>Question ID</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Activities</TableHead>
                      <TableHead>Latest Activity</TableHead>
                      <TableHead>Latest Timestamp</TableHead>
                      <TableHead>AI Status</TableHead>
                      <TableHead>Report</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGroupedData.map((group, index) => (
                      <React.Fragment key={`${group.username}-${group.problemName}`}>
                        <TableRow
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleGroup(index)}
                        >
                          <TableCell className="p-2">
                            {group.isOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{group.username}</TableCell>
                          <TableCell>{group.questionData?.title || group.problemName}</TableCell>
                          <TableCell>{group.questionData?.frontendQuestionId || "N/A"}</TableCell>
                          <TableCell>
                            {group.questionData?.difficulty
                              ? getDifficultyBadge(group.questionData.difficulty)
                              : "N/A"}
                          </TableCell>
                          <TableCell>{group.count}</TableCell>
                          <TableCell>{getEventTypeBadge(group.latestActivity.eventType)}</TableCell>
                          <TableCell>{new Date(group.latestActivity.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{renderAIStatus(group.latestActivity)}</TableCell>
                          <TableCell>
                            <Popupsmall activityId={group.latestActivity._id} aiResponses={aiResponses} />
                          </TableCell>
                        </TableRow>

                        {/* Collapsible detail rows - same as dashboard */}
                        {group.isOpen && (() => {
                          // Find the original index for loading state
                          const originalIndex = groupedData.findIndex(
                            (originalGroup) => originalGroup.username === group.username && originalGroup.problemName === group.problemName
                          );
                          return loadingGroupActivities[originalIndex];
                        })() && (
                          <TableRow className="bg-muted/30 border-l-2 border-l-primary">
                            <TableCell></TableCell>
                            <TableCell colSpan={9} className="p-4 text-center">
                              <div className="flex flex-col items-center">
                                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
                                <p className="text-muted-foreground">Loading activities...</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                        {group.isOpen &&
                          (() => {
                            // Find the original index for loading state
                            const originalIndex = groupedData.findIndex(
                              (originalGroup) => originalGroup.username === group.username && originalGroup.problemName === group.problemName
                            );
                            return !loadingGroupActivities[originalIndex];
                          })() &&
                          group.activities.map((activity) => (
                            <React.Fragment key={activity._id}>
                              <TableRow
                                className="bg-muted/30 border-l-2 border-l-primary cursor-pointer hover:bg-muted/50"
                                onClick={() => toggleRow(activity._id)}
                              >
                                <TableCell></TableCell>
                                <TableCell colSpan={2} className="text-sm text-muted-foreground">
                                  {activity.eventType.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                </TableCell>
                                <TableCell colSpan={2} className="text-sm">
                                  {activity.eventType === "copy" || activity.eventType === "paste" ? (
                                    <div className="flex items-center">
                                      <span className="truncate max-w-[150px]">
                                        {activity.eventType === "copy"
                                          ? `COPIED: ${JSON.stringify(activity.data || {}).substring(0, 30)}...`
                                          : `PASTED: ${JSON.stringify(activity.data || {}).substring(0, 30)}...`}
                                      </span>
                                      {expandedRows[activity._id] ? (
                                        <ChevronDown className="h-3 w-3 ml-1" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center">
                                      <span className="truncate max-w-[150px]">
                                        {activity.eventType === "mouse_movement" && activity.details?.viewportWidth !== undefined && activity.details?.viewportHeight !== undefined
                                          ? `Viewport: ${activity.details.viewportWidth}x${activity.details.viewportHeight}`
                                          : activity.eventType === "key_press" && activity.numberOfKeys !== undefined
                                            ? `Keys Pressed: ${activity.numberOfKeys}`
                                            : activity.eventType === "tab_activated" && activity.fromUrl && activity.toUrl
                                              ? `From: ${activity.fromTitle}`
                                              : activity.eventType === "tab_deactivated"
                                                ? `To: ${activity.toTitle}`
                                                : activity.eventType === "session_ended" && activity.sessionDuration !== undefined
                                                  ? `Session Duration: ${Math.round(activity.sessionDuration / 1000)}s, Keys: ${activity.keyPressCount || 0}`
                                                  : activity.eventType === "submission"
                                                    ? `Code Submitted`
                                                    : ""}
                                      </span>
                                      {expandedRows[activity._id] ? (
                                        <ChevronDown className="h-3 w-3 ml-1" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                      )}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>{getEventTypeBadge(activity.eventType)}</TableCell>
                                <TableCell colSpan={2} className="text-sm">
                                  {new Date(activity.timestamp).toLocaleString()}
                                </TableCell>
                                <TableCell>{renderAIStatus(activity)}</TableCell>
                                <TableCell>
                                  <Popupsmall activityId={activity._id} aiResponses={aiResponses} />
                                </TableCell>
                              </TableRow>

                              {/* Expanded content - same structure as dashboard */}
                              {expandedRows[activity._id] && (
                                <TableRow className="bg-muted/50 border-l-2 border-l-primary">
                                  <TableCell></TableCell>
                                  <TableCell colSpan={9} className="p-4">
                                    <div className="text-sm">
                                      {(() => {
                                        let expandedContent;

                                        if (activity.eventType === "copy" || activity.eventType === "paste") {
                                          expandedContent = (
                                            <div className="grid grid-cols-2 gap-2">
                                              <div>
                                                <p className="font-medium">
                                                  Event Details ({activity.eventType.charAt(0).toUpperCase() + activity.eventType.slice(1)}):
                                                </p>
                                                <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                  {activity.data}
                                                </pre>
                                              </div>
                                              <div>
                                                <p className="font-medium">Additional Info:</p>
                                                <ul className="space-y-1">
                                                  <li><span className="font-medium">Problem Id:</span> {activity.problemName}</li>
                                                  <li><span className="font-medium">Platform:</span> {activity.platform}</li>
                                                  <li><span className="font-medium">User Agent:</span> {activity.userAgent}</li>
                                                </ul>
                                              </div>
                                            </div>
                                          );
                                        } else if (activity.eventType === "key_press") {
                                          expandedContent = (
                                            <div className="grid grid-cols-2 gap-2">
                                              <div>
                                                <p className="font-medium">Event Details (Key logs):</p>
                                                <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                  {activity?.keyLogs?.map((log) => log.key).join("").replace(/(Enter)/g, " $1 ")}
                                                </pre>
                                              </div>
                                              <div>
                                                <p className="font-medium">Total Keys Pressed till now:</p>
                                                <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                  {activity.totalKeyPresses}
                                                </pre>
                                              </div>
                                              <div>
                                                <p className="font-medium">Additional Info:</p>
                                                <ul className="space-y-1">
                                                  <li><span className="font-medium">Problem Id:</span> {activity.problemName}</li>
                                                  <li><span className="font-medium">Platform:</span> {activity.platform}</li>
                                                  <li><span className="font-medium">User Agent:</span> {activity.userAgent}</li>
                                                </ul>
                                              </div>
                                            </div>
                                          );
                                        } else if (activity.eventType === "submission") {
                                          expandedContent = (
                                            <div className="grid grid-cols-2 gap-2">
                                              <div>
                                                <p className="font-medium">Event Details (Submission):</p>
                                                <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                  <p>
                                                    {(() => {
                                                      const beautifiedCode = js_beautify(activity.code ?? "", { indent_size: 4 });
                                                      return <pre>{beautifiedCode}</pre>;
                                                    })()}
                                                  </p>
                                                </pre>
                                              </div>
                                              <div>
                                                <p className="font-medium">Additional Info:</p>
                                                <ul className="space-y-1">
                                                  <li><span className="font-medium">Problem Id:</span> {activity.problemName}</li>
                                                  <li><span className="font-medium">Platform:</span> {activity.platform}</li>
                                                  <li><span className="font-medium">User Agent:</span> {activity.userAgent}</li>
                                                </ul>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                          expandedContent = (
                                            <div className="grid grid-cols-2 gap-2">
                                              <div>
                                                <p className="font-medium">Event Details (Other):</p>
                                                <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                  {JSON.stringify(activity.details || {}, null, 2)}
                                                </pre>
                                              </div>
                                              <div>
                                                <p className="font-medium">Additional Info:</p>
                                                <ul className="space-y-1">
                                                  <li><span className="font-medium">Problem Id:</span> {activity.problemName}</li>
                                                  <li><span className="font-medium">Platform:</span> {activity.platform}</li>
                                                  <li><span className="font-medium">User Agent:</span> {activity.userAgent}</li>
                                                </ul>
                                              </div>
                                            </div>
                                          );
                                        }

                                        return expandedContent;
                                      })()}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                // All activities view - same structure as dashboard
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Problem</TableHead>
                      <TableHead>Question ID</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>AI Status</TableHead>
                      <TableHead>Report</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivitiesList.map((activity) => {
                      const group = groupedData.find(
                        (g) => g.username === activity.username && g.problemName === activity.problemName
                      );
                      const questionData = group?.questionData || {
                        frontendQuestionId: "N/A",
                        difficulty: "N/A",
                        title: activity.problemName,
                      };

                      return (
                        <React.Fragment key={activity._id}>
                          <TableRow
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => toggleRow(activity._id)}
                          >
                            <TableCell className="p-2">
                              {expandedRows[activity._id] ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{activity.username}</TableCell>
                            <TableCell>{questionData.title || activity.problemName}</TableCell>
                            <TableCell>{questionData.frontendQuestionId || "N/A"}</TableCell>
                            <TableCell>
                              {questionData.difficulty !== "N/A"
                                ? getDifficultyBadge(questionData.difficulty)
                                : "N/A"}
                            </TableCell>
                            <TableCell>{getEventTypeBadge(activity.eventType)}</TableCell>
                            <TableCell className="max-w-[250px]">
                              {activity.eventType === "copy" ? (
                                <div className="truncate">
                                  COPIED: {JSON.stringify(activity.data || {}).substring(0, 30)}...
                                </div>
                              ) : activity.eventType === "paste" ? (
                                <div className="truncate">
                                  PASTED: {JSON.stringify(activity.details?.data || {}).substring(0, 30)}...
                                </div>
                              ) : (
                                <div className="truncate">
                                  {activity.eventType === "mouse_movement" && activity.details?.viewportWidth !== undefined && activity.details?.viewportHeight !== undefined
                                    ? `Viewport: ${activity.details.viewportWidth}x${activity.details.viewportHeight}`
                                    : activity.eventType === "key_press" && activity.numberOfKeys !== undefined
                                      ? `Keys Pressed: ${activity.numberOfKeys}`
                                      : activity.eventType === "submission"
                                        ? `Code Submitted`
                                        : ""}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                            <TableCell>{renderAIStatus(activity)}</TableCell>
                            <TableCell>
                              <Popupsmall activityId={activity._id} aiResponses={aiResponses} />
                            </TableCell>
                          </TableRow>

                          {/* Expanded content for all view - same as dashboard */}
                          {expandedRows[activity._id] && (
                            <TableRow className="bg-muted/50 border-l-2 border-l-primary">
                              <TableCell></TableCell>
                              <TableCell colSpan={9} className="p-4">
                                <div className="text-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <p className="font-medium">Event Details:</p>
                                      <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                        {activity.eventType === "copy" || activity.eventType === "paste"
                                          ? activity.data
                                          : activity.eventType === "submission"
                                            ? js_beautify(activity.code ?? "", { indent_size: 4 })
                                            : JSON.stringify(activity.details || {}, null, 2)}
                                      </pre>
                                    </div>
                                    <div>
                                      <p className="font-medium">Additional Info:</p>
                                      <ul className="space-y-1">
                                        <li><span className="font-medium">Problem Id:</span> {activity.problemName}</li>
                                        <li><span className="font-medium">Platform:</span> {activity.platform}</li>
                                        <li><span className="font-medium">User Agent:</span> {activity.userAgent}</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              )}

              {/* Infinite scroll loading indicator for "all activities" view */}
              {view === "all" && !isLoading && hasMore && (
                <div ref={loadMoreRef} className="p-4 text-center">
                  {loadingMore ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
                      <p className="text-muted-foreground">Loading more...</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Scroll for more</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t p-4 mt-auto">
            <div className="text-sm text-muted-foreground">
              {view === "grouped"
                ? `Showing ${filteredGroupedData.length} groups`
                : `Showing ${filteredActivitiesList.length} activities`}
            </div>
          </CardFooter>
        </Card>
      </main>
      
      <Footer 
        logo={<Hexagon className="h-10 w-10" />}
        brandName="Syntax Sentry"
        socialLinks={[
          {
            icon: <Github className="h-5 w-5" />,
            href: "https://github.com/officialSyntaxSentry",
            label: "GitHub"
          },
          {
            icon: <Twitter className="h-5 w-5" />,
            href: "https://twitter.com/syntaxsentry",
            label: "Twitter"
          }
        ]}
        mainLinks={[
          { href: "/", label: "Home" },
          { href: "/dashboard", label: "Dashboard" },
          { href: "/room", label: "Rooms" },
          { href: "/docs", label: "Docs" },
          { href: "/contact", label: "Contact" }
        ]}
        legalLinks={[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" }
        ]}
        copyright={{
          text: "© 2025 Syntax Sentry",
          license: "All rights reserved",
        }}
      />
    </div>
  );
}
