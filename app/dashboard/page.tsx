"use client";
import { useEffect, useState } from "react";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/popup";
import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { js_beautify } from "js-beautify";

import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // Change the theme if needed

import javascript from "highlight.js/lib/languages/javascript";
import cpp from "highlight.js/lib/languages/cpp";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import "highlight.js/styles/github.css"; // Change theme if needed

// Register only relevant languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("python", python);
hljs.registerLanguage("java", java);

import {
  Bell,
  Home,
  HelpCircle,
  Settings,
  Shield,
  ChartColumn,
  LayoutDashboard,
  Building,
  DoorOpen,
  Mail,
  User,
  LifeBuoy,
  Headphones,
  FileText,
  Lock,
  FileJson2
} from "lucide-react";
import { ExpandableTabs } from "@/app/components/expandable-tabs";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/pagination";

import {
  Hexagon,
  Github,
  Twitter,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/app/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { getQuestionData } from "./GetQuestionData";

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

const tabs = [
  { title: "Home", icon: <Home size={20} />, href: "/" },
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/dashboard",
  },
  { title: "Room", icon: <DoorOpen size={20} />, href: "/room" },
  { type: "separator" as const },
  { title: "Docs", icon: <FileText size={20} />, href: "/docs" },
  { title: "Support", icon: <LifeBuoy size={20} />, href: "/contact" },
];

// Group activities by username and problem
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

  // Create an array of promises for fetching question data
  const promises = Object.entries(grouped).flatMap(([username, problems]) =>
    Object.entries(problems).map(async ([problemName, activities]) => {
      // Get question data for this problem
      const questionData = await getQuestionData(problemName);

      // Sort activities to find the latest one
      const sortedActivities = activities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return {
        username,
        problemName,
        // Only store the latest activity initially, the rest will be loaded on demand
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

  // Wait for all promises to resolve
  const groupedData = await Promise.all(promises);
  // Sort groups by latest activity timestamp (descending)
  return groupedData.sort(
    (a, b) =>
      new Date(b.latestActivity.timestamp).getTime() -
      new Date(a.latestActivity.timestamp).getTime()
  );
}

function PaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function Popup() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2">
          <FileText className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[280px] py-3 shadow-none" side="top">
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-[13px] font-medium">Complete Analysis</p>
            <p className="text-xs text-muted-foreground">
              This report examines AI-driven anti-cheat detection, assessing its
              effectiveness through behavioral and environmental analysis while
              recommending strategies to strengthen online assessment integrity.{" "}
            </p>
          </div>
          <Button size="sm" className="h-7 px-2">
            View report
          </Button>
        </div>
      </PopoverContent>
    </Popover>
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

// Function to get event type badge color
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

// Function to get difficulty badge color
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

function beautifyCode(codeString: string): string {
  try {
    return js_beautify(codeString, {
      indent_size: 4,
      space_in_empty_paren: true,
    });
  } catch (error) {
    console.error("Error beautifying code:", error);
    return codeString;
  }
}

// 🎛️ STRICTNESS CONFIGURATION - Change this value to adjust algorithm strictness
// Values: 0.1 (very lenient) to 1.0 (very strict)
// Location: Line ~120 in app/dashboard/page.tsx
const SUSPICION_STRICTNESS = 1; // 🔧 ADJUST THIS VALUE TO CHANGE STRICTNESS

// Event type severity weights (higher = more suspicious/important)
const EVENT_SEVERITY_WEIGHTS = {
  // High severity - Direct cheating indicators
  'copy': 1.0,           // Copying code/content
  'paste': 1.0,          // Pasting external content
  'submission': 0.9,     // Code submission analysis
  
  // Medium-high severity - Context switching (potential external help)
  'tab_activated': 0.8,   // Switching to other tabs
  'tab_deactivated': 0.8, // Leaving the coding tab
  'window_blurred': 0.8,  // Minimizing/losing focus
  'window_focused': 0.7,  // Returning to window
  'url_changed': 0.7,     // Navigating to different pages
  
  // Medium severity - Behavioral patterns
  'key_press': 0.6,       // Typing patterns analysis
  'session_ended': 0.5,   // Session completion analysis
  
  // Low severity - Basic tracking
  'mouse_movement': 0.3,  // Mouse movement patterns
  'mouse_move': 0.3,      // Alternative mouse event
  'tab': 0.4,            // General tab events
  'code': 0.6,           // Code analysis events
  
  // Default for unknown events
  'default': 0.4
};

// Function to get event severity weight
function getEventSeverityWeight(eventType: string): number {
  return EVENT_SEVERITY_WEIGHTS[eventType as keyof typeof EVENT_SEVERITY_WEIGHTS] || EVENT_SEVERITY_WEIGHTS.default;
}

// Enhanced function to extract suspicion percentage from AI response
function extractSuspicionPercentage(aiResponse: any): number | null {
  if (!aiResponse || !aiResponse.response) {
    return null;
  }

  const response = aiResponse.response;
  
  // Convert to string for text-based searching
  const responseStr = JSON.stringify(response).toLowerCase();
  
  // Define possible keys that might contain suspicion percentage
  const suspicionKeys = [
    'suspicion_percentage',
    'suspiciousness_percentage', 
    'suspicious_percentage',
    'suspicion_score',
    'suspiciousness_score',
    'suspicious_score',
    'suspicion_level',
    'suspiciousness_level',
    'suspicious_level',
    'cheat_percentage',
    'cheat_probability',
    'fraud_percentage',
    'fraud_probability',
    'risk_percentage',
    'risk_score',
    'anomaly_score',
    'anomaly_percentage'
  ];

  // First try to find exact key matches in the response object
  function searchObject(obj: any): number | null {
    if (!obj || typeof obj !== 'object') return null;
    
    for (const key of Object.keys(obj)) {
      const lowerKey = key.toLowerCase();
      
      // Check if key matches any suspicion patterns
      for (const suspicionKey of suspicionKeys) {
        if (lowerKey.includes(suspicionKey) || suspicionKey.includes(lowerKey)) {
          const value = obj[key];
          const numValue = parseFloat(value);
          
          if (!isNaN(numValue)) {
            // If value is between 0-1, convert to percentage
            return numValue <= 1 ? numValue * 100 : numValue;
          }
        }
      }
      
      // Recursively search nested objects
      if (typeof obj[key] === 'object') {
        const nestedResult = searchObject(obj[key]);
        if (nestedResult !== null) return nestedResult;
      }
    }
    
    return null;
  }

  // Try object-based search first
  const objectResult = searchObject(response);
  if (objectResult !== null) return Math.min(Math.max(objectResult, 0), 100);

  // Fallback: regex pattern matching on stringified response
  const patterns = [
    /(?:suspicion|suspicious|suspiciousness|cheat|fraud|risk|anomaly)(?:_|\s)?(?:percentage|score|level|probability)(?:\"?:\s?|=\s?)(\d+(?:\.\d+)?)/gi,
    /(\d+(?:\.\d+)?)(?:%|\s?percent)?\s?(?:suspicious|suspicion|cheat|fraud|risk)/gi,
    /(?:is\s)?(\d+(?:\.\d+)?)(?:%|\s?percent)?\s?(?:suspicious|likely\sto\scheat|risky)/gi
  ];

  for (const pattern of patterns) {
    const matches = responseStr.matchAll(pattern);
    for (const match of matches) {
      const value = parseFloat(match[1]);
      if (!isNaN(value)) {
        return Math.min(Math.max(value <= 1 ? value * 100 : value, 0), 100);
      }
    }
  }

  return null;
}

// Enhanced function to get suspicion level with stricter thresholds
function getSuspicionLevel(percentage: number): { level: string; color: string; bgColor: string } {
  // Apply strictness multiplier to make thresholds more demanding
  const strictnessMultiplier = 1 + (1 - SUSPICION_STRICTNESS);
  const adjustedPercentage = percentage * strictnessMultiplier;
  
  if (adjustedPercentage >= 90) {
    return { level: 'Critical', color: 'text-red-800', bgColor: 'bg-red-600' };
  } else if (adjustedPercentage >= 75) {
    return { level: 'Very High', color: 'text-red-700', bgColor: 'bg-red-500' };
  } else if (adjustedPercentage >= 60) {
    return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-400' };
  } else if (adjustedPercentage >= 45) {
    return { level: 'Medium', color: 'text-amber-600', bgColor: 'bg-amber-400' };
  } else if (adjustedPercentage >= 30) {
    return { level: 'Low', color: 'text-yellow-600', bgColor: 'bg-yellow-400' };
  } else if (adjustedPercentage >= 15) {
    return { level: 'Very Low', color: 'text-green-600', bgColor: 'bg-green-400' };
  } else {
    return { level: 'Minimal', color: 'text-green-700', bgColor: 'bg-green-500' };
  }
}

// Suspicion Meter Component
function SuspicionMeter({ percentage, size = 'sm', showLabel = true }: { 
  percentage: number | null; 
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}) {
  if (percentage === null) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-16 h-2 bg-gray-200 rounded-full`}>
          <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-500">N/A</span>
          </div>
        </div>
        {showLabel && <span className="text-xs text-gray-500">No data</span>}
      </div>
    );
  }

  const { level, color, bgColor } = getSuspicionLevel(percentage);
  
  const sizeClasses = {
    xs: 'w-12 h-1.5',
    sm: 'w-16 h-2', 
    md: 'w-24 h-3',
    lg: 'w-32 h-4'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden relative`}>
        <div 
          className={`h-full ${bgColor} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {size === 'lg' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${textSizes[size]} font-medium text-white drop-shadow-sm`}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-medium`}>
            {Math.round(percentage)}%
          </span>
          {size !== 'xs' && (
            <span className={`text-xs ${color}`}>
              {level}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Enhanced function to calculate weighted average suspicion for a group
function calculateGroupSuspicion(activities: Activity[], aiResponses: Record<string, AIResponse>): number | null {
  interface WeightedScore {
    score: number;
    weight: number;
    eventType: string;
    isZero: boolean;
  }
  
  const weightedScores: WeightedScore[] = [];
  
  // Collect all scores with their weights
  activities.forEach(activity => {
    const aiResponse = aiResponses[activity._id];
    if (aiResponse) {
      const suspicion = extractSuspicionPercentage(aiResponse);
      if (suspicion !== null) {
        const weight = getEventSeverityWeight(activity.eventType);
        weightedScores.push({
          score: suspicion,
          weight: weight,
          eventType: activity.eventType,
          isZero: suspicion === 0
        });
      }
    }
  });

  if (weightedScores.length === 0) return null;
  
  // Sort by weight (highest first) for zero-filtering logic
  weightedScores.sort((a, b) => b.weight - a.weight);
  
  // Apply strictness: filter out zero scores from lower-weighted events
  let filteredScores = weightedScores;
  
  if (SUSPICION_STRICTNESS > 0.5) {
    const zeroScores = weightedScores.filter(s => s.isZero);
    const nonZeroScores = weightedScores.filter(s => !s.isZero);
    
    if (zeroScores.length > 0 && nonZeroScores.length > 0) {
      // Calculate how many zeros to remove based on strictness
      const strictnessRatio = (SUSPICION_STRICTNESS - 0.5) * 2; // Convert 0.5-1.0 to 0-1.0
      const zerosToRemove = Math.floor(zeroScores.length * strictnessRatio);
      
      // Remove the lowest-weighted zero scores
      const zerosToKeep = zeroScores.slice(0, zeroScores.length - zerosToRemove);
      filteredScores = [...nonZeroScores, ...zerosToKeep];
      
      console.log(`🎯 Strictness ${SUSPICION_STRICTNESS}: Removed ${zerosToRemove} zero scores from low-weighted events`);
    }
  }
  
  // Calculate weighted average
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  filteredScores.forEach(({ score, weight }) => {
    totalWeightedScore += score * weight;
    totalWeight += weight;
  });
  
  if (totalWeight === 0) return null;
  
  const weightedAverage = totalWeightedScore / totalWeight;
  
  // Apply additional strictness penalty for mixed signals
  let finalScore = weightedAverage;
  
  if (SUSPICION_STRICTNESS > 0.6) {
    const highSeverityScores = filteredScores.filter(s => s.weight >= 0.8);
    const lowSeverityScores = filteredScores.filter(s => s.weight < 0.5);
    
    // If we have high-severity events with low scores, apply penalty
    if (highSeverityScores.length > 0 && lowSeverityScores.length > 0) {
      const highAvg = highSeverityScores.reduce((sum, s) => sum + s.score, 0) / highSeverityScores.length;
      const lowAvg = lowSeverityScores.reduce((sum, s) => sum + s.score, 0) / lowSeverityScores.length;
      
      if (highAvg > lowAvg * 2) {
        // Boost high-severity signals
        const boost = (SUSPICION_STRICTNESS - 0.6) * 0.5; // Max 20% boost
        finalScore = Math.min(finalScore * (1 + boost), 100);
      }
    }
  }
  
  console.log(`📊 Group suspicion calculation:`, {
    originalScores: weightedScores.length,
    filteredScores: filteredScores.length,
    weightedAverage: Math.round(weightedAverage * 10) / 10,
    finalScore: Math.round(finalScore * 10) / 10,
    strictness: SUSPICION_STRICTNESS
  });
  
  return Math.round(finalScore * 10) / 10; // Round to 1 decimal place
}

// Enhanced Group Suspicion Display Component with weight information
function GroupSuspicionDisplay({ group, aiResponses }: { group: GroupedData; aiResponses: Record<string, AIResponse> }) {
  const averageSuspicion = calculateGroupSuspicion(group.activities, aiResponses);
  const activitiesWithAI = group.activities.filter(activity => aiResponses[activity._id]);
  const totalActivities = group.activities.length;
  
  if (!group.isOpen || averageSuspicion === null) {
    return null;
  }

  const { level, color } = getSuspicionLevel(averageSuspicion);

  // Calculate weight distribution for display
  const weightDistribution = activitiesWithAI.reduce((acc, activity) => {
    const weight = getEventSeverityWeight(activity.eventType);
    const category = weight >= 0.8 ? 'High' : weight >= 0.6 ? 'Medium' : 'Low';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border-l-4 border-l-blue-500 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">Weighted Suspicion Analysis</h4>
          <p className="text-sm text-gray-600">
            Based on {activitiesWithAI.length} of {totalActivities} activities with AI analysis
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Strictness: {Math.round(SUSPICION_STRICTNESS * 100)}% | 
            Weights: {Object.entries(weightDistribution).map(([k, v]) => `${k}: ${v}`).join(', ')}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-3">
            <SuspicionMeter percentage={averageSuspicion} size="lg" showLabel={false} />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(averageSuspicion)}%
              </div>
              <div className={`text-sm font-medium ${color}`}>
                {level} Risk
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Individual activity breakdown with weights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
        {group.activities
          .filter(activity => aiResponses[activity._id])
          .sort((a, b) => getEventSeverityWeight(b.eventType) - getEventSeverityWeight(a.eventType)) // Sort by weight
          .map(activity => {
            const suspicion = extractSuspicionPercentage(aiResponses[activity._id]);
            const weight = getEventSeverityWeight(activity.eventType);
            return suspicion !== null ? (
              <div key={activity._id} className="bg-white p-3 rounded-md shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">
                    {activity.eventType.replace('_', ' ').toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs px-1 py-0.5 rounded ${
                      weight >= 0.8 ? 'bg-red-100 text-red-700' :
                      weight >= 0.6 ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      W: {weight}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <SuspicionMeter percentage={suspicion} size="sm" />
              </div>
            ) : null;
          })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [filteredActivitiesList, setFilteredActivitiesList] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingGroupActivities, setLoadingGroupActivities] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [view, setView] = useState<"grouped" | "all">("grouped");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [aiResponses, setAiResponses] = useState<Record<string, AIResponse>>({});
  const [groupActivityCounts, setGroupActivityCounts] = useState<Record<string, number>>({});
  const [loadingCounts, setLoadingCounts] = useState(false);

  const loadMoreRef = React.useRef<HTMLDivElement>(null);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  // Fetch AI responses for a list of activity IDs
  const fetchAIResponses = async (activityIds: string[]) => {
    if (!activityIds || activityIds.length === 0) {
      console.log("No activity IDs provided to fetchAIResponses");
      return;
    }

    // Filter out activity IDs that we already have responses for
    const idsToFetch = activityIds.filter(id => !aiResponses[id]);

    if (idsToFetch.length === 0) {
      console.log("All requested AI responses are already loaded");
      return;
    }

    try {
      console.log(`Fetching AI responses for ${idsToFetch.length} activities`);

      const response = await fetch(`/api/airesponse/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activityIds: idsToFetch }),
      });

      if (!response.ok) {
        console.error('Failed to fetch AI responses:', response.status);
        return;
      }

      const data = await response.json();

      // Create a mapping of activity IDs to AI responses
      const newResponses = data.responses.reduce((acc: Record<string, AIResponse>, response: AIResponse) => {
        acc[response.documentId] = response;
        return acc;
      }, {});

      // Update the AI responses state with the new responses
      setAiResponses(prev => ({
        ...prev,
        ...newResponses
      }));

      console.log(`Successfully fetched ${data.responses.length} AI responses for ${idsToFetch.length} activities`);
    } catch (error) {
      console.error('Error fetching AI responses:', error);
    }
  };

  // Fetch activity counts for all groups
  const fetchGroupActivityCounts = async (username = "") => {
    setLoadingCounts(true);
    try {
      console.log("Fetching activity counts for all groups");
      
      const queryParams = new URLSearchParams({
        countOnly: "true",
        ...(username && { username }),
      });

      const response = await fetch(`/api/activity?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !data.groupCounts) {
        throw new Error("Invalid response format from server");
      }

      // Create a mapping of username+problemName to count
      const countMap: Record<string, number> = {};
      data.groupCounts.forEach((item: { username: string; problemName: string; count: number }) => {
        const key = `${item.username}:${item.problemName}`;
        countMap[key] = item.count;
      });

      setGroupActivityCounts(countMap);
      console.log(`Successfully fetched counts for ${data.groupCounts.length} groups`);
      
      return countMap;
    } catch (error) {
      console.error("Error fetching group activity counts:", error);
      setError("Failed to fetch activity counts. Please try again later.");
      return {};
    } finally {
      setLoadingCounts(false);
    }
  };

  // Fetch activities for a specific group
  async function fetchGroupActivities(groupIndex: number) {
    const group = groupedData[groupIndex];
    if (!group) {
      console.error("Group not found at index:", groupIndex);
      return;
    }

    if (group.activitiesLoaded) {
      console.log(`Activities for group ${groupIndex} already loaded, skipping fetch`);
      return;
    }

    // Mark this group as loading
    setLoadingGroupActivities((prev) => ({
      ...prev,
      [groupIndex]: true,
    }));

    try {
      console.log(`Fetching activities for group ${groupIndex}: ${group.username}/${group.problemName}`);

      const response = await fetch(
        `/api/activity?username=${encodeURIComponent(
          group.username
        )}&problemName=${encodeURIComponent(
          group.problemName
        )}&forGroup=true`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch group activities: ${response.status}`);
      }

      const data = await response.json();
      const groupActivities = data.activities;

      console.log(`Received ${groupActivities.length} activities for group ${groupIndex}`);

      // Update the grouped data with the fetched activities
      setGroupedData((prev) => {
        const newData = [...prev];
        newData[groupIndex] = {
          ...newData[groupIndex],
          activities: groupActivities,
          activitiesLoaded: true,
        };
        return newData;
      });

      // Fetch AI responses for the activities if there are any
      if (groupActivities && groupActivities.length > 0) {
        // Extract activity IDs - these will be ObjectId strings from MongoDB
        const activityIds = groupActivities.map((activity: Activity) => activity._id);

        // Fetch AI responses for these activities
        await fetchAIResponses(activityIds);
      } else {
        console.log(`No activities found for group ${groupIndex}`);
      }
    } catch (error) {
      console.error(`Error fetching group ${groupIndex} activities:`, error);
      setError(`Failed to fetch activities for ${group.username}/${group.problemName}. Please try again later.`);

      // Mark that the group failed to load
      setGroupedData((prev) => {
        const newData = [...prev];
        newData[groupIndex] = {
          ...newData[groupIndex],
          activitiesLoaded: false, // Ensure we can retry loading
        };
        return newData;
      });
    } finally {
      // Mark this group as no longer loading
      setLoadingGroupActivities((prev) => ({
        ...prev,
        [groupIndex]: false,
      }));
    }
  }

  // Toggle group expansion and load activities if needed
  const toggleGroup = async (index: number) => {
    const group = groupedData[index];
    if (!group) {
      console.error("Cannot toggle non-existent group at index:", index);
      return;
    }

    const willBeOpen = !group.isOpen;
    console.log(`Toggling group ${index} (${group.username}/${group.problemName}) to ${willBeOpen ? 'open' : 'closed'}`);

    // First update the UI to show the group is opening/closing
    setGroupedData((prev) => {
      const newData = [...prev];
      newData[index] = {
        ...newData[index],
        isOpen: willBeOpen,
      };
      return newData;
    });

    // If opening the group and activities haven't been loaded yet, fetch them
    if (willBeOpen && !group.activitiesLoaded) {
      console.log(`Group ${index} is being opened and needs activities to be loaded`);

      // Fetch the activities and their AI responses
      await fetchGroupActivities(index);
    } else {
      console.log(`Group ${index} ${willBeOpen ? 'opened' : 'closed'}, activities already loaded: ${group.activitiesLoaded}`);
    }
  };

  // Get AI status for an activity
  const getAIStatus = (activity: Activity) => {
    if (!activity || !activity._id) {
      return "gray"; // Default for invalid activities
    }

    const activityId = activity._id.toString();

    // Check if we have an AI response for this activity
    if (aiResponses && aiResponses[activityId]) {
      return "green"; // Activity has an AI response
    }

    // If we don't have a response, check if the activity type should have an AI response
    const aiEligibleEventTypes = [
      "copy", "paste", "key_press", "window_blurred", "window_focused",
      "tab_activated", "tab_deactivated", "submission", "mouse_move", "tab", "code"
    ];

    const hasAIEventType = aiEligibleEventTypes.includes(activity.eventType);

    return hasAIEventType ? "orange" : "gray"; // Orange for waiting, gray for no AI needed
  };

  // Get AI status hover text
  const getAIStatusHoverText = (status: string) => {
    if (status === "green") return "AI has analyzed this activity";
    if (status === "orange") return "Waiting for AI analysis";
    return "No AI analysis needed for this activity type";
  };

  // Render AI status indicator
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

  // Toggle row expansion
  const toggleRow = (id: string) => {
    const newExpandedState = !expandedRows[id];

    setExpandedRows((prev) => ({
      ...prev,
      [id]: newExpandedState,
    }));

    // If we're expanding a row and don't have AI response for this activity yet,
    // fetch it when the row is expanded
    if (newExpandedState && !aiResponses[id]) {
      fetchAIResponses([id]);
    }
  };

  // Filter activities based on search term (only by username as requested)
  const filteredActivities = activities.filter((activity) =>
    activity.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update filtered activities list when activities or search term changes
  useEffect(() => {
    setFilteredActivitiesList(filteredActivities);
  }, [activities, searchTerm]);

  // Fetch all groups when the component mounts or search term changes
  useEffect(() => {
    async function fetchAllGroups() {
      setLoading(true);
      setError(null); // Clear any previous errors

      try {
        const username = searchTerm ? searchTerm : "";
        console.log(
          "Fetching activity groups" + (username ? ` for ${username}` : "")
        );
        const startTime = performance.now();

        const queryParams = new URLSearchParams({
          page: "1",
          limit: "500", // Reduced limit for better performance
          ...(username && { username }),
          groupsOnly: "true", // Parameter to indicate we only want group data
        });

        const response = await fetch(`/api/activity?${queryParams}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const endTime = performance.now();
        console.log(
          `Fetched ${data?.activities?.length || 0} groups in ${Math.round(
            endTime - startTime
          )}ms`
        );

        if (!data || !data.activities) {
          throw new Error("Invalid response format from server");
        }

        // Process the group data
        const grouped = await groupActivitiesByUsernameAndProblem(
          data.activities
        );
        
        // Fetch accurate activity counts for all groups
        const countMap = await fetchGroupActivityCounts(username);
        
        // Update the group data with accurate counts from the countMap
        const groupsWithCounts = grouped.map(group => {
          const key = `${group.username}:${group.problemName}`;
          const accurateCount = countMap[key] || 0;
          return {
            ...group,
            count: accurateCount
          };
        });
        
        setGroupedData(groupsWithCounts);

        // Log success for debugging
        console.log(`Successfully processed ${grouped.length} groups with accurate counts`);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setError("Failed to fetch activity groups. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchAllGroups();
  }, [searchTerm]);

  // Reset page and hasMore when view or search changes for the All Activity view
  useEffect(() => {
    if (view === "all") {
      setPage(1);
      setHasMore(true);
      setActivities([]);
      fetchActivities(1, true);
    }
  }, [view, searchTerm]);

  // Fetch activities for the All view (infinite scroll)
  async function fetchActivities(pageNum = page, isNewSearch = false) {
    setLoadingMore(true);
    try {
      const limit = 20;
      const username = searchTerm ? searchTerm : "";

      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
        ...(username && { username }),
      });

      const response = await fetch(`/api/activity?${queryParams}`);

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

      // If it's a new search, replace activities, otherwise append
      if (isNewSearch) {
        setActivities(sortedActivities);
        setFilteredActivitiesList(sortedActivities);
      } else {
        const newActivities = [...activities, ...sortedActivities];
        setActivities(newActivities);
        setFilteredActivitiesList(newActivities);
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
      setLoading(false);
      setLoadingMore(false);
    }
  }

  // Initial data fetch for All Activity view
  useEffect(() => {
    if (view === "all") {
      fetchActivities(1, true);
    }
  }, [view]);

  // Fetch AI responses for visible activities in the "all" view
  useEffect(() => {
    if (view === "all" && filteredActivitiesList.length > 0) {
      const activityIds = filteredActivitiesList.map(activity => activity._id);
      fetchAIResponses(activityIds);
    }
  }, [view, filteredActivitiesList]);

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    // Disconnect previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

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

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loadMoreRef.current]);

  // Function to load more data
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchActivities(nextPage, false);
    }
  };

  // Function to get question data for individual activities in the "all" view
  const getQuestionDataForActivity = async (problemName: string) => {
    try {
      return await getQuestionData(problemName);
    } catch (error) {
      console.error(`Error fetching question data for ${problemName}:`, error);
      return {
        frontendQuestionId: "N/A",
        difficulty: "N/A",
        title: problemName,
      };
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center mt-3 md:hidden ">
        <ExpandableTabs tabs={tabs} />
      </div>

      <main className="flex-grow">
        <div className="container mx-auto py-8 px-4">
          <Card className="shadow-lg border-border/40">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Activity Dashboard
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Track and analyze user activity across coding platforms
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => fetchActivities(1, true)}
                  >
                    <RefreshCw className="w-4 h-4" /> Refresh
                  </Button>
                  <Select
                    value={view}
                    onValueChange={(value) =>
                      setView(value as "grouped" | "all")
                    }
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

            <CardContent className="px-0">
              <div className="overflow-x-auto rounded-md border">
                {loading && activities.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-muted-foreground">
                      Loading activity data...
                    </p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center text-red-500">
                    <p>{error}</p>
                  </div>
                ) : view === "grouped" && groupedData.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">
                      No activities found.
                    </p>
                  </div>
                ) : view === "all" && filteredActivitiesList.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">
                      No activities found.
                    </p>
                  </div>
                ) : view === "grouped" ? (
                  // Grouped view with collapsible sections
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
                      {groupedData.map((group, index) => (
                        <React.Fragment
                          key={`${group.username}-${group.problemName}`}
                        >
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
                            <TableCell className="font-medium">
                              {group.username}
                            </TableCell>
                            <TableCell>
                              {group.questionData?.title || group.problemName}
                            </TableCell>
                            <TableCell>
                              {group.questionData?.frontendQuestionId || "N/A"}
                            </TableCell>
                            <TableCell>
                              {group.questionData?.difficulty
                                ? getDifficultyBadge(
                                  group.questionData.difficulty
                                )
                                : "N/A"}
                            </TableCell>
                            <TableCell>{group.count}</TableCell>
                            <TableCell>
                              {getEventTypeBadge(
                                group.latestActivity.eventType
                              )}
                            </TableCell>
                            <TableCell>
                              {new Date(
                                group.latestActivity.timestamp
                              ).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {renderAIStatus(group.latestActivity)}
                            </TableCell>
                            <TableCell>
                              <Popupsmall activityId={group.latestActivity._id} aiResponses={aiResponses} />
                            </TableCell>
                          </TableRow>

                          {/* Collapsible detail rows */}
                          {group.isOpen && loadingGroupActivities[index] && (
                            <TableRow className="bg-muted/30 border-l-2 border-l-primary">
                              <TableCell></TableCell>
                              <TableCell
                                colSpan={9}
                                className="p-4 text-center"
                              >
                                <div className="flex flex-col items-center">
                                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
                                  <p className="text-muted-foreground">
                                    Loading activities...
                                  </p>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}

                          {/* Group Suspicion Analysis - Show when group is open and activities are loaded */}
                          {group.isOpen && !loadingGroupActivities[index] && group.activitiesLoaded && (
                            <TableRow className="bg-muted/20 border-l-2 border-l-blue-500">
                              <TableCell></TableCell>
                              <TableCell colSpan={9} className="p-0">
                                <GroupSuspicionDisplay group={group} aiResponses={aiResponses} />
                              </TableCell>
                            </TableRow>
                          )}

                          {group.isOpen &&
                            !loadingGroupActivities[index] &&
                            group.activities.map((activity) => (
                              <React.Fragment key={activity._id}>
                                <TableRow
                                  className="bg-muted/30 border-l-2 border-l-primary cursor-pointer hover:bg-muted/50"
                                  onClick={() => toggleRow(activity._id)}
                                >
                                  <TableCell></TableCell>
                                  <TableCell
                                    colSpan={2}
                                    className="text-sm text-muted-foreground"
                                  >
                                    {activity.eventType
                                      .split("_")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ")}
                                  </TableCell>
                                  <TableCell colSpan={2} className="text-sm">
                                    {activity.eventType === "copy" ||
                                      activity.eventType === "paste" ? (
                                      <div className="flex items-center">
                                        <span className="truncate max-w-[150px]">
                                          {activity.eventType === "copy"
                                            ? `COPIED: ${JSON.stringify(
                                              activity.data || {}
                                            ).substring(0, 30)}...`
                                            : `PASTED: ${JSON.stringify(
                                              activity.data || {}
                                            ).substring(0, 30)}...`}
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
                                          {activity.eventType ===
                                            "mouse_movement" &&
                                            activity.details?.viewportWidth !==
                                            undefined &&
                                            activity.details?.viewportHeight !==
                                            undefined
                                            ? `Viewport: ${activity.details.viewportWidth}x${activity.details.viewportHeight}`
                                            : activity.eventType ===
                                              "key_press" &&
                                              activity.numberOfKeys !==
                                              undefined
                                              ? `Keys Pressed: ${activity.numberOfKeys}`
                                              : activity.eventType ===
                                                "tab_activated" &&
                                                activity.fromUrl &&
                                                activity.toUrl
                                                ? `From: ${activity.fromTitle}`
                                                : activity.eventType ===
                                                  "tab_deactivated"
                                                  ? `To: ${activity.toTitle} `
                                                  : activity.eventType ===
                                                    "window_focused"
                                                    ? ` `
                                                    : activity.eventType ===
                                                      "window_blurred"
                                                      ? ` `
                                                      : activity.eventType ===
                                                        "url_changed"
                                                        ? ` `
                                                        : activity.eventType ===
                                                          "mouse_movement"
                                                          ? `200cm Moved `
                                                          : activity.eventType ===
                                                            "session_ended" &&
                                                            activity.sessionDuration !==
                                                            undefined
                                                            ? `Session Duration: ${Math.round(
                                                              activity.sessionDuration / 1000
                                                            )}s, Keys: ${activity.keyPressCount || 0
                                                            }`
                                                            : activity.eventType ===
                                                              "submission"
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
                                  <TableCell>
                                    {getEventTypeBadge(activity.eventType)}
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {new Date(
                                      activity.timestamp
                                    ).toLocaleString()}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      {renderAIStatus(activity)}
                                      {/* Add suspicion meter for individual activities */}
                                      {aiResponses[activity._id] && (
                                        <SuspicionMeter 
                                          percentage={extractSuspicionPercentage(aiResponses[activity._id])} 
                                          size="xs" 
                                          showLabel={false}
                                        />
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1">
                                      <Popupsmall activityId={activity._id} aiResponses={aiResponses} />
                                      {/* Show suspicion percentage if available */}
                                      {aiResponses[activity._id] && (() => {
                                        const suspicion = extractSuspicionPercentage(aiResponses[activity._id]);
                                        return suspicion !== null ? (
                                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSuspicionLevel(suspicion).color} bg-opacity-10`}>
                                            {Math.round(suspicion)}%
                                          </span>
                                        ) : null;
                                      })()}
                                    </div>
                                  </TableCell>
                                </TableRow>

                                {/* Expanded content */}
                                {expandedRows[activity._id] && (
                                  <TableRow className="bg-muted/50 border-l-2 border-l-primary">
                                    <TableCell></TableCell>
                                    <TableCell colSpan={9} className="p-4">
                                      <div className="text-sm">
                                        {(() => {
                                          let expandedContent;

                                          if (
                                            activity.eventType === "copy" ||
                                            activity.eventType === "paste"
                                          ) {
                                            expandedContent = (
                                              <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                  <p className="font-medium">
                                                    Event Details (
                                                    {activity.eventType
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                      activity.eventType.slice(
                                                        1
                                                      )}
                                                    ):
                                                  </p>
                                                  <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                    {activity.data}
                                                  </pre>
                                                </div>
                                                <div>
                                                  <p className="font-medium">
                                                    Additional Info:
                                                  </p>
                                                  <ul className="space-y-1">
                                                    <li>
                                                      <span className="font-medium">
                                                        Problem Id:
                                                      </span>{" "}
                                                      {activity.problemName}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        Platform:
                                                      </span>{" "}
                                                      {activity.platform}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        User Agent:
                                                      </span>{" "}
                                                      {activity.userAgent}
                                                    </li>
                                                  </ul>
                                                </div>
                                              </div>
                                            );
                                          } else if (
                                            activity.eventType === "key_press"
                                          ) {
                                            expandedContent = (
                                              <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                  <p className="font-medium">
                                                    Event Details (Key logs):
                                                  </p>
                                                  <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                    {activity?.keyLogs
                                                      ?.map((log) => log.key)
                                                      .join("")
                                                      .replace(
                                                        /(Enter)/g,
                                                        " $1 "
                                                      )}
                                                  </pre>
                                                </div>
                                                <div>
                                                  <p className="font-medium">
                                                    Total Keys Pressed till now
                                                    :
                                                  </p>
                                                  <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                    {activity.totalKeyPresses}
                                                  </pre>
                                                </div>
                                                <div>
                                                  <p className="font-medium">
                                                    Additional Info:
                                                  </p>
                                                  <ul className="space-y-1">
                                                    <li>
                                                      <span className="font-medium">
                                                        Problem Id:
                                                      </span>{" "}
                                                      {activity.problemName}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        Platform:
                                                      </span>{" "}
                                                      {activity.platform}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        User Agent:
                                                      </span>{" "}
                                                      {activity.userAgent}
                                                    </li>
                                                  </ul>
                                                </div>
                                              </div>
                                            );
                                          } else if (
                                            activity.eventType === "key_press"
                                          ) {
                                            expandedContent = (
                                              <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                  <p className="font-medium">
                                                    Event Details (Paste):
                                                  </p>
                                                  <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                    {activity.data}
                                                  </pre>
                                                </div>
                                                <div>
                                                  <p className="font-medium">
                                                    Additional Info:
                                                  </p>
                                                  <ul className="space-y-1">
                                                    <li>
                                                      <span className="font-medium">
                                                        Problem Id:
                                                      </span>{" "}
                                                      {activity.problemName}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        Platform:
                                                      </span>{" "}
                                                      {activity.platform}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        User Agent:
                                                      </span>{" "}
                                                      {activity.userAgent}
                                                    </li>
                                                  </ul>
                                                </div>
                                              </div>
                                            );
                                          } else if (
                                            activity.eventType ===
                                            "tab_activated" ||
                                            activity.eventType ===
                                            "tab_deactivated"
                                          ) {
                                            expandedContent = (
                                              <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                  <p className="font-medium">
                                                    Event Details (
                                                    {activity.eventType
                                                      .split("_")
                                                      .map((word) =>
                                                        word.length > 2
                                                          ? word
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                          word
                                                            .slice(1)
                                                            .toLowerCase()
                                                          : word.toUpperCase()
                                                      )
                                                      .join(" ")}
                                                    ):
                                                  </p>
                                                  <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                    {activity.eventType ===
                                                      "tab_activated" ? (
                                                      <p>
                                                        From -<br />
                                                        {
                                                          activity.fromTitle
                                                        }{" "}
                                                        <br />
                                                        {activity.fromUrl}
                                                        <br />
                                                        To - <br />
                                                        {activity.toTitle}{" "}
                                                        <br />
                                                        {activity.toUrl}
                                                      </p>
                                                    ) : (
                                                      <p>
                                                        From -<br />
                                                        {
                                                          activity.fromTitle
                                                        }{" "}
                                                        <br />
                                                        {activity.fromUrl}
                                                        <br />
                                                        To - <br />
                                                        {activity.toTitle}{" "}
                                                        <br />
                                                        {activity.toUrl}
                                                      </p>
                                                    )}
                                                  </pre>
                                                </div>
                                                <div>
                                                  <p className="font-medium">
                                                    Additional Info:
                                                  </p>
                                                  <ul className="space-y-1">
                                                    <li>
                                                      <span className="font-medium">
                                                        Problem Id:
                                                      </span>{" "}
                                                      {activity.problemName}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        Platform:
                                                      </span>{" "}
                                                      {activity.platform}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        User Agent:
                                                      </span>{" "}
                                                      {activity.userAgent}
                                                    </li>
                                                  </ul>
                                                </div>
                                              </div>
                                            );
                                          } else if (
                                            activity.eventType === "submission"
                                          ) {
                                            expandedContent = (
                                              <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                  <p className="font-medium">
                                                    Event Details (
                                                    {activity.eventType
                                                      .split("_")
                                                      .map((word) =>
                                                        word.length > 2
                                                          ? word
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                          word
                                                            .slice(1)
                                                            .toLowerCase()
                                                          : word.toUpperCase()
                                                      )
                                                      .join(" ")}
                                                    ):
                                                  </p>
                                                  <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                    <p>
                                                      {(() => {
                                                        const beautifiedCode =
                                                          js_beautify(
                                                            activity.code ?? "",
                                                            { indent_size: 4 }
                                                          );

                                                        // Limit language detection to specific programming languages
                                                        const detectedLang =
                                                          hljs.highlightAuto(
                                                            beautifiedCode,
                                                            [
                                                              "cpp",
                                                              "javascript",
                                                              "python",
                                                              "java",
                                                            ]
                                                          ).language ||
                                                          "unknown";

                                                        return (
                                                          <pre>
                                                            {beautifiedCode}
                                                          </pre>
                                                        );
                                                      })()}
                                                    </p>
                                                  </pre>
                                                </div>
                                                <div>
                                                  <p className="font-medium">
                                                    Additional Info:
                                                  </p>
                                                  <ul className="space-y-1">
                                                    <li>
                                                      <span className="font-medium">
                                                        Problem Id:
                                                      </span>{" "}
                                                      {activity.problemName}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        Platform:
                                                      </span>{" "}
                                                      {activity.platform}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        User Agent:
                                                      </span>{" "}
                                                      {activity.userAgent}
                                                    </li>
                                                  </ul>
                                                </div>
                                              </div>
                                            );
                                          } else if (
                                            activity.eventType ===
                                            "window_focused" ||
                                            activity.eventType ===
                                            "window_blurred"
                                          ) {
                                            expandedContent = (
                                              <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                  <p className="font-medium">
                                                    Event Details (
                                                    {activity.eventType
                                                      .split("_")
                                                      .map((word) =>
                                                        word.length > 2
                                                          ? word
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                          word
                                                            .slice(1)
                                                            .toLowerCase()
                                                          : word.toUpperCase()
                                                      )
                                                      .join(" ")}
                                                    ):
                                                  </p>
                                                  <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                    {activity.eventType ===
                                                      "window_focused" ? (
                                                      <p>
                                                        From -<br />
                                                        {
                                                          activity.fromTitle
                                                        }{" "}
                                                        <br />
                                                        {activity.fromUrl}
                                                        <br />
                                                        To - <br />
                                                        {activity.toTitle}{" "}
                                                        <br />
                                                        {activity.toUrl}
                                                      </p>
                                                    ) : (
                                                      <p>
                                                        From -<br />
                                                        {
                                                          activity.fromTitle
                                                        }{" "}
                                                        <br />
                                                        {activity.fromUrl}
                                                        <br />
                                                        To - <br />
                                                        {activity.toTitle}{" "}
                                                        <br />
                                                        {activity.toUrl}
                                                      </p>
                                                    )}
                                                  </pre>
                                                </div>
                                                <div>
                                                  <p className="font-medium">
                                                    Additional Info:
                                                  </p>
                                                  <ul className="space-y-1">
                                                    <li>
                                                      <span className="font-medium">
                                                        Problem Id:
                                                      </span>{" "}
                                                      {activity.problemName}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        Platform:
                                                      </span>{" "}
                                                      {activity.platform}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        User Agent:
                                                      </span>{" "}
                                                      {activity.userAgent}
                                                    </li>
                                                  </ul>
                                                </div>
                                              </div>
                                            );
                                          } else if (
                                            activity.eventType ===
                                            "url_changed"
                                          ) {
                                            expandedContent = (
                                              <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                  <p className="font-medium">
                                                    Event Details (
                                                    {activity.eventType
                                                      .split("_")
                                                      .map((word) =>
                                                        word.length > 2
                                                          ? word
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                          word
                                                            .slice(1)
                                                            .toLowerCase()
                                                          : word.toUpperCase()
                                                      )
                                                      .join(" ")}
                                                    ):
                                                  </p>
                                                  <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                    <p>
                                                      From -<br />
                                                      {
                                                        activity.fromTitle
                                                      }{" "}
                                                      <br />
                                                      {activity.fromUrl}
                                                      <br />
                                                      To - <br />
                                                      {activity.toTitle}{" "}
                                                      <br />
                                                      {activity.toUrl}
                                                    </p>
                                                  </pre>
                                                </div>
                                                <div>
                                                  <p className="font-medium">
                                                    Additional Info:
                                                  </p>
                                                  <ul className="space-y-1">
                                                    <li>
                                                      <span className="font-medium">
                                                        Problem Id:
                                                      </span>{" "}
                                                      {activity.problemName}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        Platform:
                                                      </span>{" "}
                                                      {activity.platform}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        User Agent:
                                                      </span>{" "}
                                                      {activity.userAgent}
                                                    </li>
                                                  </ul>
                                                </div>
                                              </div>
                                            );
                                          } else {
                                            expandedContent = (
                                              <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                  <p className="font-medium">
                                                    Event Details (Other):
                                                  </p>
                                                  <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                    {JSON.stringify(
                                                      activity.details || {},
                                                      null,
                                                      2
                                                    )}
                                                  </pre>
                                                </div>
                                                <div>
                                                  <p className="font-medium">
                                                    Additional Info:
                                                  </p>
                                                  <ul className="space-y-1">
                                                    <li>
                                                      <span className="font-medium">
                                                        Problem Id:
                                                      </span>{" "}
                                                      {activity.problemName}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        Platform:
                                                      </span>{" "}
                                                      {activity.platform}
                                                    </li>
                                                    <li>
                                                      <span className="font-medium">
                                                        User Agent:
                                                      </span>{" "}
                                                      {activity.userAgent}
                                                    </li>
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
                  // All activities view
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
                        // Use the question data from the grouped data if available
                        const group = groupedData.find(
                          (g) =>
                            g.username === activity.username &&
                            g.problemName === activity.problemName
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
                              <TableCell className="font-medium">
                                {activity.username}
                              </TableCell>
                              <TableCell>
                                {questionData.title || activity.problemName}
                              </TableCell>
                              <TableCell>
                                {questionData.frontendQuestionId || "N/A"}
                              </TableCell>
                              <TableCell>
                                {questionData.difficulty !== "N/A"
                                  ? getDifficultyBadge(questionData.difficulty)
                                  : "N/A"}
                              </TableCell>
                              <TableCell>
                                {getEventTypeBadge(activity.eventType)}
                              </TableCell>
                              <TableCell className="max-w-[250px]">
                                {activity.eventType === "copy" ? (
                                  <div className="truncate">
                                    COPIED:{" "}
                                    {JSON.stringify(
                                      activity.data || {}
                                    ).substring(0, 30)}
                                    ...
                                  </div>
                                ) : activity.eventType === "paste" ? (
                                  <div className="truncate">
                                    PASTED:{" "}
                                    {JSON.stringify(
                                      activity.details?.data || {}
                                    ).substring(0, 30)}
                                    ...
                                  </div>
                                ) : (
                                  <div className="truncate">
                                    {activity.eventType ===
                                            "mouse_movement" &&
                                            activity.details?.viewportWidth !==
                                            undefined &&
                                            activity.details?.viewportHeight !==
                                            undefined
                                            ? `Viewport: ${activity.details.viewportWidth}x${activity.details.viewportHeight}`
                                            : activity.eventType ===
                                              "key_press" &&
                                              activity.numberOfKeys !==
                                              undefined
                                              ? `Keys Pressed: ${activity.numberOfKeys}`
                                              : activity.eventType ===
                                                "tab_activated" &&
                                                activity.fromUrl &&
                                                activity.toUrl
                                                ? `From: ${activity.fromTitle}`
                                                : activity.eventType ===
                                                  "tab_deactivated"
                                                  ? `To: ${activity.toTitle} `
                                                  : activity.eventType ===
                                                    "window_focused"
                                                    ? ` `
                                                    : activity.eventType ===
                                                      "window_blurred"
                                                      ? ` `
                                                      : activity.eventType ===
                                                        "url_changed"
                                                        ? ` `
                                                        : activity.eventType ===
                                                          "mouse_movement"
                                                          ? `200cm Moved `
                                                          : activity.eventType ===
                                                            "session_ended" &&
                                                            activity.sessionDuration !==
                                                            undefined
                                                            ? `Session Duration: ${Math.round(
                                                              activity.sessionDuration / 1000
                                                            )}s, Keys: ${activity.keyPressCount || 0
                                                            }`
                                                            : activity.eventType ===
                                                              "submission"
                                                              ? `Code Submitted`
                                                              : ""}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                {new Date(activity.timestamp).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {renderAIStatus(activity)}
                                  {/* Add suspicion meter for individual activities in all view */}
                                  {aiResponses[activity._id] && (
                                    <SuspicionMeter 
                                      percentage={extractSuspicionPercentage(aiResponses[activity._id])} 
                                      size="xs" 
                                      showLabel={false}
                                    />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Popupsmall activityId={activity._id} aiResponses={aiResponses} />
                                  {/* Show suspicion percentage if available */}
                                  {aiResponses[activity._id] && (() => {
                                    const suspicion = extractSuspicionPercentage(aiResponses[activity._id]);
                                    return suspicion !== null ? (
                                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSuspicionLevel(suspicion).color} bg-opacity-10`}>
                                        {Math.round(suspicion)}%
                                      </span>
                                    ) : null;
                                  })()}
                                </div>
                              </TableCell>
                            </TableRow>

                            {/* Expanded content */}
                            {expandedRows[activity._id] && (
                              <TableRow className="bg-muted/50 border-l-2 border-l-primary">
                                <TableCell></TableCell>
                                <TableCell colSpan={9} className="p-4">
                                  <div className="text-sm">
                                    {(() => {
                                      let expandedContent;

                                      if (
                                        activity.eventType === "copy" ||
                                        activity.eventType === "paste"
                                      ) {
                                        expandedContent = (
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <p className="font-medium">
                                                Event Details (
                                                {activity.eventType
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  activity.eventType.slice(
                                                    1
                                                  )}
                                                ):
                                              </p>
                                              <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                {activity.data}
                                              </pre>
                                            </div>
                                            <div>
                                              <p className="font-medium">
                                                Additional Info:
                                              </p>
                                              <ul className="space-y-1">
                                                <li>
                                                  <span className="font-medium">
                                                    Problem Id:
                                                  </span>{" "}
                                                  {activity.problemName}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    Platform:
                                                  </span>{" "}
                                                  {activity.platform}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    User Agent:
                                                  </span>{" "}
                                                  {activity.userAgent}
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        );
                                      } else if (
                                        activity.eventType === "key_press"
                                      ) {
                                        expandedContent = (
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <p className="font-medium">
                                                Event Details (Key logs):
                                              </p>
                                              <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                {activity?.keyLogs
                                                  ?.map((log) => log.key)
                                                  .join("")
                                                  .replace(
                                                    /(Enter)/g,
                                                    " $1 "
                                                  )}
                                              </pre>
                                            </div>
                                            <div>
                                              <p className="font-medium">
                                                Total Keys Pressed till now
                                                :
                                              </p>
                                              <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                {activity.totalKeyPresses}
                                              </pre>
                                            </div>
                                            <div>
                                              <p className="font-medium">
                                                Additional Info:
                                              </p>
                                              <ul className="space-y-1">
                                                <li>
                                                  <span className="font-medium">
                                                    Problem Id:
                                                  </span>{" "}
                                                  {activity.problemName}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    Platform:
                                                  </span>{" "}
                                                  {activity.platform}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    User Agent:
                                                  </span>{" "}
                                                  {activity.userAgent}
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        );
                                      } else if (
                                        activity.eventType === "key_press"
                                      ) {
                                        expandedContent = (
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <p className="font-medium">
                                                Event Details (Paste):
                                              </p>
                                              <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                {activity.data}
                                              </pre>
                                            </div>
                                            <div>
                                              <p className="font-medium">
                                                Additional Info:
                                              </p>
                                              <ul className="space-y-1">
                                                <li>
                                                  <span className="font-medium">
                                                    Problem Id:
                                                  </span>{" "}
                                                  {activity.problemName}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    Platform:
                                                  </span>{" "}
                                                  {activity.platform}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    User Agent:
                                                  </span>{" "}
                                                  {activity.userAgent}
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        );
                                      } else if (
                                        activity.eventType ===
                                        "tab_activated" ||
                                        activity.eventType ===
                                        "tab_deactivated"
                                      ) {
                                        expandedContent = (
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <p className="font-medium">
                                                Event Details (
                                                {activity.eventType
                                                  .split("_")
                                                  .map((word) =>
                                                    word.length > 2
                                                      ? word
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                      word
                                                        .slice(1)
                                                        .toLowerCase()
                                                      : word.toUpperCase()
                                                  )
                                                  .join(" ")}
                                                ):
                                              </p>
                                              <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                {activity.eventType ===
                                                  "tab_activated" ? (
                                                  <p>
                                                    From -<br />
                                                    {
                                                      activity.fromTitle
                                                    }{" "}
                                                    <br />
                                                    {activity.fromUrl}
                                                    <br />
                                                    To - <br />
                                                    {activity.toTitle}{" "}
                                                    <br />
                                                    {activity.toUrl}
                                                  </p>
                                                ) : (
                                                  <p>
                                                    From -<br />
                                                    {
                                                      activity.fromTitle
                                                    }{" "}
                                                    <br />
                                                    {activity.fromUrl}
                                                    <br />
                                                    To - <br />
                                                    {activity.toTitle}{" "}
                                                    <br />
                                                    {activity.toUrl}
                                                  </p>
                                                )}
                                              </pre>
                                            </div>
                                            <div>
                                              <p className="font-medium">
                                                Additional Info:
                                              </p>
                                              <ul className="space-y-1">
                                                <li>
                                                  <span className="font-medium">
                                                    Problem Id:
                                                  </span>{" "}
                                                  {activity.problemName}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    Platform:
                                                  </span>{" "}
                                                  {activity.platform}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    User Agent:
                                                  </span>{" "}
                                                  {activity.userAgent}
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        );
                                      } else if (
                                        activity.eventType === "submission"
                                      ) {
                                        expandedContent = (
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <p className="font-medium">
                                                Event Details (
                                                {activity.eventType
                                                  .split("_")
                                                  .map((word) =>
                                                    word.length > 2
                                                      ? word
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                      word
                                                        .slice(1)
                                                        .toLowerCase()
                                                      : word.toUpperCase()
                                                  )
                                                  .join(" ")}
                                                ):
                                              </p>
                                              <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                <p>
                                                  {(() => {
                                                    const beautifiedCode =
                                                      js_beautify(
                                                        activity.code ?? "",
                                                        { indent_size: 4 }
                                                      );

                                                    // Limit language detection to specific programming languages
                                                    const detectedLang =
                                                      hljs.highlightAuto(
                                                        beautifiedCode,
                                                        [
                                                          "cpp",
                                                          "javascript",
                                                          "python",
                                                          "java",
                                                        ]
                                                      ).language ||
                                                      "unknown";

                                                    return (
                                                      <pre>
                                                        {beautifiedCode}
                                                      </pre>
                                                    );
                                                  })()}
                                                </p>
                                              </pre>
                                            </div>
                                            <div>
                                              <p className="font-medium">
                                                Additional Info:
                                              </p>
                                              <ul className="space-y-1">
                                                <li>
                                                  <span className="font-medium">
                                                    Problem Id:
                                                  </span>{" "}
                                                  {activity.problemName}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    Platform:
                                                  </span>{" "}
                                                  {activity.platform}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    User Agent:
                                                  </span>{" "}
                                                  {activity.userAgent}
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        );
                                      } else if (
                                        activity.eventType ===
                                        "window_focused" ||
                                        activity.eventType ===
                                        "window_blurred"
                                      ) {
                                        expandedContent = (
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <p className="font-medium">
                                                Event Details (
                                                {activity.eventType
                                                  .split("_")
                                                  .map((word) =>
                                                    word.length > 2
                                                      ? word
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                      word
                                                        .slice(1)
                                                        .toLowerCase()
                                                      : word.toUpperCase()
                                                  )
                                                  .join(" ")}
                                                ):
                                              </p>
                                              <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                {activity.eventType ===
                                                  "window_focused" ? (
                                                  <p>
                                                    From -<br />
                                                    {
                                                      activity.fromTitle
                                                    }{" "}
                                                    <br />
                                                    {activity.fromUrl}
                                                    <br />
                                                    To - <br />
                                                    {activity.toTitle}{" "}
                                                    <br />
                                                    {activity.toUrl}
                                                  </p>
                                                ) : (
                                                  <p>
                                                    From -<br />
                                                    {
                                                      activity.fromTitle
                                                    }{" "}
                                                    <br />
                                                    {activity.fromUrl}
                                                    <br />
                                                    To - <br />
                                                    {activity.toTitle}{" "}
                                                    <br />
                                                    {activity.toUrl}
                                                  </p>
                                                )}
                                              </pre>
                                            </div>
                                            <div>
                                              <p className="font-medium">
                                                Additional Info:
                                              </p>
                                              <ul className="space-y-1">
                                                <li>
                                                  <span className="font-medium">
                                                    Problem Id:
                                                  </span>{" "}
                                                  {activity.problemName}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    Platform:
                                                  </span>{" "}
                                                  {activity.platform}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    User Agent:
                                                  </span>{" "}
                                                  {activity.userAgent}
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        );
                                      } else if (
                                        activity.eventType ===
                                        "url_changed"
                                      ) {
                                        expandedContent = (
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <p className="font-medium">
                                                Event Details (
                                                {activity.eventType
                                                  .split("_")
                                                  .map((word) =>
                                                    word.length > 2
                                                      ? word
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                      word
                                                        .slice(1)
                                                        .toLowerCase()
                                                      : word.toUpperCase()
                                                  )
                                                  .join(" ")}
                                                ):
                                              </p>
                                              <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                <p>
                                                  From -<br />
                                                  {
                                                    activity.fromTitle
                                                  }{" "}
                                                  <br />
                                                  {activity.fromUrl}
                                                  <br />
                                                  To - <br />
                                                  {activity.toTitle}{" "}
                                                  <br />
                                                  {activity.toUrl}
                                                </p>
                                              </pre>
                                            </div>
                                            <div>
                                              <p className="font-medium">
                                                Additional Info:
                                              </p>
                                              <ul className="space-y-1">
                                                <li>
                                                  <span className="font-medium">
                                                    Problem Id:
                                                  </span>{" "}
                                                  {activity.problemName}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    Platform:
                                                  </span>{" "}
                                                  {activity.platform}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    User Agent:
                                                  </span>{" "}
                                                  {activity.userAgent}
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        );
                                      } else {
                                        expandedContent = (
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <p className="font-medium">
                                                Event Details (Other):
                                              </p>
                                              <pre className="bg-muted p-3 rounded-md overflow-x-auto max-h-[200px] text-xs">
                                                {JSON.stringify(
                                                  activity.details || {},
                                                  null,
                                                  2
                                                )}
                                              </pre>
                                            </div>
                                            <div>
                                              <p className="font-medium">
                                                Additional Info:
                                              </p>
                                              <ul className="space-y-1">
                                                <li>
                                                  <span className="font-medium">
                                                    Problem Id:
                                                  </span>{" "}
                                                  {activity.problemName}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    Platform:
                                                  </span>{" "}
                                                  {activity.platform}
                                                </li>
                                                <li>
                                                  <span className="font-medium">
                                                    User Agent:
                                                  </span>{" "}
                                                  {activity.userAgent}
                                                </li>
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
                        );
                      })}
                    </TableBody>
                  </Table>
                )}

                {/* Infinite scroll loading indicator */}
                {view === "all" && !loading && hasMore && (
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
                  ? `Showing ${groupedData.length} groups`
                  : `Showing ${filteredActivitiesList.length} activities`}
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer
        logo={<Hexagon className="h-10 w-10" />}
        brandName="Syntax Sentry"
        socialLinks={[
          {
            icon: <Twitter className="h-5 w-5" />,
            href: "https://twitter.com/syntaxsentry",
            label: "Twitter",
          },
          {
            icon: <Github className="h-5 w-5" />,
            href: "https://github.com/officialSyntaxSentry",
            label: "GitHub",
          },
        ]}
        mainLinks={[
          { href: "/", label: "Home" },
          { href: "/dashboard", label: "Dashboard" },
          { href: "/room", label: "Rooms" },
          { href: "/docs", label: "Docs" },
          { href: "/contact", label: "Contact" },
        ]}
        legalLinks={[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
        ]}
        copyright={{
          text: " 2025 Syntax Sentry",
          license: "All rights reserved",
        }}
      />
    </div>
  );
}
