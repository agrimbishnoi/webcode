"use client";

import React, { useState } from "react";
import { ExpandableTabs } from "@/app/components/expandable-tabs";
import { Footer } from "@/app/components/footer";
import { Hexagon, Github, Twitter } from "lucide-react";
import { ThemeToggle } from "@/app/components/theme-toggle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/input";
import {
  Home,
  LayoutDashboard,
  DoorOpen,
  FileText,
  LifeBuoy,
  SearchIcon,
  Users,
  TrendingUp,
} from "lucide-react";

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

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
          <div className="flex justify-center items-center mt-3 md:hidden">
            <ExpandableTabs tabs={tabs} />
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="mb-6">
              <SearchIcon className="mx-auto h-16 w-16 text-primary mb-4" />
              <h1 className="text-4xl font-bold mb-4">Search Users</h1>
              <div className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover developers and their coding activities. Search by username to view detailed profiles, problem-solving statistics, and activity patterns.
              </div>
            </div>

            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Enter username to search..."
                  className="pr-12 h-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SearchIcon size={20} />
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 rounded-lg border border-border bg-card">
              <Users className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">User Profiles</h3>
              <div className="text-muted-foreground">
                View comprehensive profiles with activity metrics, problem-solving history, and platform usage
              </div>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-border bg-card">
              <TrendingUp className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Activity Analytics</h3>
              <div className="text-muted-foreground">
                Analyze coding patterns, session data, submission counts, and time spent on problems
              </div>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-border bg-card">
              <SearchIcon className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Data</h3>
              <div className="text-muted-foreground">
                All data is fetched live from activity logs, providing up-to-date insights and statistics
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="font-medium mb-2">1. Enter Username</div>
                <div className="text-muted-foreground">Type the username you want to search for</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="font-medium mb-2">2. View Results</div>
                <div className="text-muted-foreground">Browse through matching user profiles</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="font-medium mb-2">3. Explore Profile</div>
                <div className="text-muted-foreground">Click to see detailed analytics and metrics</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="font-medium mb-2">4. Analyze Data</div>
                <div className="text-muted-foreground">Review activity patterns and problem history</div>
              </div>
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