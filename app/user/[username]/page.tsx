"use client";

import React, { useEffect, useState } from "react";
import { ExpandableTabs } from "@/app/components/expandable-tabs";
import { Footer } from "@/app/components/footer";
import { Hexagon, Github, Twitter } from "lucide-react";
import { ThemeToggle } from "@/app/components/theme-toggle";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
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
  ArrowLeft,
  Calendar,
  Clock,
  LifeBuoy,
  Headphones,
  FileText,
  Lock,
  Loader2,
  Activity,
  Code,
  Target,
  Zap,
  TrendingUp,
  BarChart,
} from "lucide-react";

// Type definitions
interface UserProfile {
  username: string;
  stats: {
    totalActivities: number;
    problemsSolved: number;
    submissions: number;
    keyPresses: number;
    totalSessions: number;
    activitiesPerProblem: number;
    daysActive: number;
    avgContentLength: number;
  };
  platforms: string[];
  eventTypes: string[];
  timeline: {
    firstActivity: string;
    lastActivity: string;
  };
  problemBreakdown: Array<{
    problemName: string;
    activities: number;
    submissions: number;
    keyPresses: number;
    sessionCount: number;
    timeSpentMs: number;
    timeSpentHours: number;
    platforms: string[];
    firstWorked: string;
    lastWorked: string;
  }>;
  recentActivities: Array<{
    eventType: string;
    problemName: string;
    timestamp: string;
    platform: string;
    sessionId: string;
  }>;
  activityPatterns: Array<{
    hour: number;
    count: number;
  }>;
}

function Navigation() {
  return (
    <nav className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <Hexagon className="h-8 w-8" />
        <span className="font-semibold text-lg">Syntax Sentry</span>
      </div>
      
      <div className="hidden md:flex items-center gap-6">
        <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
          Home
        </Link>
        <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
          Dashboard
        </Link>
        <Link href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
          Docs
        </Link>
        <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
          Contact
        </Link>
      </div>
      <ThemeToggle />
    </nav>
  );
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return "just now";
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  const months = Math.floor(diffInDays / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

function StatCard({ icon, title, value, subtitle }: { 
  icon: React.ReactNode; 
  title: string; 
  value: string | number; 
  subtitle?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-primary">{icon}</div>
        <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  );
}

function ProblemCard({ problem }: { problem: UserProfile['problemBreakdown'][0] }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg">{problem.problemName || 'Unknown Problem'}</h3>
        <div className="text-xs text-muted-foreground">
          {formatTimeAgo(problem.lastWorked)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <div className="text-center">
          <div className="text-sm font-medium">{problem.activities}</div>
          <div className="text-xs text-muted-foreground">Activities</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium">{problem.submissions}</div>
          <div className="text-xs text-muted-foreground">Submissions</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium">{problem.sessionCount}</div>
          <div className="text-xs text-muted-foreground">Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium">{problem.timeSpentHours}h</div>
          <div className="text-xs text-muted-foreground">Time Spent</div>
        </div>
      </div>
      
      {problem.platforms.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {problem.platforms.filter(p => p).map((platform, idx) => (
            <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
              {platform}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/users/${encodeURIComponent(username)}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found');
          }
          throw new Error('Failed to fetch user profile');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);
  
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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
          <div className="container mx-auto py-3">
            <Navigation />
          </div>
        </div>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
          <div className="container mx-auto py-3">
            <Navigation />
          </div>
        </div>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">Error: {error}</div>
            <Link href="/search" className="text-primary hover:underline">
              Back to Search
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto py-3">
          <Navigation />
          <div className="flex justify-center items-center mt-3 md:hidden ">
            <ExpandableTabs tabs={tabs} />
          </div>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/search" className="mr-4 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold text-2xl">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profile.username}</h1>
                <div className="text-muted-foreground">
                  Active since {formatTimeAgo(profile.timeline.firstActivity)} • 
                  Last seen {formatTimeAgo(profile.timeline.lastActivity)}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <StatCard 
              icon={<Code size={20} />}
              title="Problems Solved"
              value={profile.stats.problemsSolved}
            />
            <StatCard 
              icon={<Activity size={20} />}
              title="Total Activities"
              value={profile.stats.totalActivities}
            />
            <StatCard 
              icon={<Target size={20} />}
              title="Submissions"
              value={profile.stats.submissions}
            />
            <StatCard 
              icon={<Zap size={20} />}
              title="Key Presses"
              value={profile.stats.keyPresses}
            />
            <StatCard 
              icon={<Clock size={20} />}
              title="Sessions"
              value={profile.stats.totalSessions}
            />
            <StatCard 
              icon={<TrendingUp size={20} />}
              title="Activities/Problem"
              value={profile.stats.activitiesPerProblem}
            />
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard 
              icon={<Calendar size={20} />}
              title="Days Active"
              value={profile.stats.daysActive}
              subtitle="Total days with activity"
            />
            <StatCard 
              icon={<BarChart size={20} />}
              title="Avg Content Length"
              value={Math.round(profile.stats.avgContentLength)}
              subtitle="Characters per activity"
            />
            <StatCard 
              icon={<Building size={20} />}
              title="Platforms Used"
              value={profile.platforms.filter(p => p).length}
              subtitle={profile.platforms.filter(p => p).join(', ') || 'Various'}
            />
          </div>

          {/* Activity Patterns */}
          {profile.activityPatterns.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Activity Patterns (by Hour)</h2>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-end gap-1 h-32">
                  {Array.from({ length: 24 }, (_, hour) => {
                    const data = profile.activityPatterns.find(p => p.hour === hour);
                    const count = data?.count || 0;
                    const maxCount = Math.max(...profile.activityPatterns.map(p => p.count));
                    const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    
                    return (
                      <div key={hour} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-primary/20 rounded-t"
                          style={{ height: `${height}%` }}
                          title={`${hour}:00 - ${count} activities`}
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {hour}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Recent Activities */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <div className="bg-card border border-border rounded-lg">
              {profile.recentActivities.slice(0, 10).map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border-b border-border last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <div className="font-medium text-sm">{activity.eventType}</div>
                      {activity.problemName && (
                        <div className="text-xs text-muted-foreground">{activity.problemName}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                    {activity.platform && (
                      <div className="text-xs bg-muted px-2 py-1 rounded mt-1">
                        {activity.platform}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Problem Breakdown */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Problem Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.problemBreakdown.slice(0, 20).map((problem, idx) => (
                <ProblemCard key={idx} problem={problem} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full mt-auto">
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
            text: "© 2025 Syntax Sentry",
            license: "All rights reserved",
          }}
        />
      </footer>
    </div>
  );
} 