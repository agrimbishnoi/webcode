"use client";

import React, { useEffect, useState } from "react";
import { ExpandableTabs } from "@/app/components/expandable-tabs";
import { Footer } from "@/app/components/footer";
import { Hexagon, Github, Twitter } from "lucide-react";
import { ThemeToggle } from "@/app/components/theme-toggle";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Input } from "@/app/components/input";
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
  ArrowLeft,SearchIcon,
  Calendar,
  Clock,
  LifeBuoy,
  Headphones,
  FileText,
  Lock,
  Loader2,
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
  };
  platforms: string[];
  firstActivity: string;
  lastActivity: string;
  uniqueProblems: string[];
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

function UserCard({ user, index }: { user: UserProfile, index: number }) {
  // Calculate AI usage score based on activities vs problems ratio
  // Higher ratio suggests more automated/AI assistance
  const aiUsageScore = Math.min(Math.round((user.stats.activitiesPerProblem / 50) * 100), 100);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-border bg-card"
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold text-xl">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{user.username}</h3>
          <div className="text-muted-foreground">Active Developer</div>
          <div className="text-xs text-muted-foreground mt-1">
            Last active: {formatTimeAgo(user.lastActivity)}
          </div>
        </div>
      </div>
      
      <div className="flex-grow md:border-l md:pl-4 mt-4 md:mt-0">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-muted/50 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Problems Solved</div>
            <div className="font-medium">{user.stats.problemsSolved}</div>
          </div>
          <div className="bg-muted/50 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Total Activities</div>
            <div className="font-medium">{user.stats.totalActivities}</div>
          </div>
          <div className="bg-muted/50 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Submissions</div>
            <div className="font-medium">{user.stats.submissions}</div>
          </div>
          <div className="bg-muted/50 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Sessions</div>
            <div className="font-medium">{user.stats.totalSessions}</div>
          </div>
          <div className="bg-muted/50 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Days Active</div>
            <div className="font-medium">{user.stats.daysActive}</div>
          </div>
          <div className="bg-muted/50 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Avg Activities/Problem</div>
            <div className="font-medium">{user.stats.activitiesPerProblem}</div>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <div className="text-sm">Activity Level:</div> */}
            {/* <div className="w-full max-w-32 bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  aiUsageScore < 20 
                    ? 'bg-green-500' 
                    : aiUsageScore < 50 
                      ? 'bg-yellow-500' 
                      : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(aiUsageScore, 100)}%` }}
              ></div>
            </div> */}
            {/* <div className="text-sm font-medium">{aiUsageScore}%</div> */}
          </div>
          
          <div className="flex items-center gap-2">
            {user.platforms.length > 0 && (
              <div className="text-xs bg-muted px-2 py-1 rounded">
                {user.platforms.filter(p => p).join(', ') || 'Various'}
              </div>
            )}
            <Link 
              href={`/user/${user.username}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SearchPage() {
  const params = useParams();
  const searchQuery = decodeURIComponent(params.query as string);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery]);
  
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/search" className="mr-4 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">Search Results</h1>
          </div>
          <div className="mb-8 max-w-md">
            <form 
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.querySelector('input') as HTMLInputElement;
                if (input.value.trim()) {
                  window.location.href = `/search/${encodeURIComponent(input.value.trim())}`;
                }
              }}
            >
              <Input 
                type="search" 
                placeholder="Search users..." 
                className="pr-10 h-11"
                defaultValue={searchQuery}
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <SearchIcon size={18} />
              </button>
            </form>
          </div>
          
          <div className="mb-4">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : (
              <div className="text-muted-foreground">
                {users.length} {users.length === 1 ? 'result' : 'results'} for "{searchQuery}"
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">Error: {error}</div>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-sm text-primary hover:underline"
                >
                  Try Again
                </button>
              </div>
            ) : users.length > 0 ? (
              users.map((user, index) => (
                <UserCard key={user.username} user={user} index={index} />
              ))
            ) : (
              <div className="text-center py-12">
                <SearchIcon size={48} className="mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No results found</h2>
                <div className="text-muted-foreground mb-6">
                  We couldn't find any users matching "{searchQuery}"
                </div>
                <div className="text-sm text-muted-foreground">
                  Try searching for a different username
                </div>
              </div>
            )}
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