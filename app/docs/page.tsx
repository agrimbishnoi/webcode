"use client";

import React from "react";
import { ExpandableTabs } from "@/app/components/expandable-tabs";
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
} from "lucide-react";
import { Footer } from "@/app/components/footer";
import { Hexagon, Github, Twitter } from "lucide-react";
import { ThemeToggle } from "@/app/components/theme-toggle";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/app/components/navbar";

// Sample docs data
const docsPosts = [
  {
    id: 1,
    title: "Understanding AI Code Detection: Methods & Practices",
    excerpt: "Learn about the advanced techniques we use to detect AI-generated code and how our algorithms work to ensure transparency in programming.",
    date: "May 15, 2023",
    author: "Agrim Rai",
    authorRole: "Co-Developer",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: 2,
    title: "How to Test Our Alpha Extension: A Step-by-Step Guide",
    excerpt: "Get an early look! This guide walks you through downloading, installing, and testing our packed alpha extension.",
    date: "October 5, 2023",
    author: "Agrim Rai",
    authorRole: "Co-founder",
    coverImage: "https://plus.unsplash.com/premium_photo-1720287601920-ee8c503af775?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder image for extension testing
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 3,
    title: "How to Improve Your Coding Skills Without AI",
    excerpt:
      "Practical tips and strategies to enhance your programming abilities through traditional learning methods and practice.",
    date: "July 12, 2023",
    author: "Swetank Choudhary",
    authorRole: "Co-founder",
    coverImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop",
    readTime: "5 min read",
    featured: false,
  },
  {
    id: 4,
    title: "The Future of Code Analysis Tools",
    excerpt:
      "A deep dive into how code analysis tools are evolving and what to expect in the next generation of programming assistance.",
    date: "August 22, 2023",
    author: "Swetank Choudhary",
    authorRole: "Co-founder",
    coverImage:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000&auto=format&fit=crop",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 5,
    title: "Advanced Evasion Techniques: How AI Cheating Attempts to Bypass Detection",
    excerpt: "A look into the methods used to circumvent AI code detectors, and how advanced systems like Syntax Sentry stay ahead.",
    date: "November 10, 2023",
    author: "Swetank Choudhary",
    authorRole: "Co-founder",
    coverImage: "https://plus.unsplash.com/premium_photo-1676618539992-21c7d3b6df0f?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHNlY3VyaXR5fGVufDB8fDB8fHww", // Image for evasion/security
    readTime: "9 min read",
    featured: true,
  },
  {
    id: 6,
    title: "The Psychology of AI Cheating: Why Students Resort to It and How to Foster Integrity",
    excerpt: "Understanding the motivations behind academic dishonesty involving AI tools and how to cultivate a culture of ethical AI use in education.",
    date: "December 1, 2023",
    author: "Agrim Rai",
    authorRole: "Co-founder",
    coverImage: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1000&auto=format&fit=crop", // Image for psychology/education
    readTime: "6 min read",
    featured: false,
  }
];

function Navigation() {
  return (
    <nav className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <Hexagon className="h-8 w-8" />
        <span className="font-semibold text-lg">Syntax Sentry</span>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <Link
          href="/"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Home
        </Link>
        <Link
          href="/dashboard"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/docs"
          className="text-sm font-medium text-primary transition-colors"
        >
          Docs
        </Link>
        <Link
          href="/contact"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Contact
        </Link>
      </div>
      <ThemeToggle />
    </nav>
  );
}

function DocsCard({
  post,
  index,
}: {
  post: (typeof docsPosts)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`flex flex-col rounded-xl overflow-hidden border border-border ${
        post.featured ? "md:col-span-2" : ""
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-primary/90 text-white text-xs font-medium px-2 py-1 rounded-full">
          {post.readTime}
        </div>
      </div>
      <div className="flex flex-col p-6 flex-grow">
        <div className="text-sm text-muted-foreground mb-2">{post.date}</div>
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-primary font-semibold">
              {post.author.charAt(0)}
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium">{post.author}</div>
              <div className="text-xs text-muted-foreground">
                {post.authorRole}
              </div>
            </div>
          </div>
          <Link
            href={`/docs/${post.id}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Read more
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function DocsPage() {
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
          <Navbar />
          <div className="flex justify-center items-center mt-3 md:hidden ">
            <ExpandableTabs tabs={tabs} />
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-2 text-center"
          >
            Our Docs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
          >
            Insights, tutorials, and updates from our team of experts on AI
            detection, code analysis, and programming best practices.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {docsPosts.map((post, index) => (
              <DocsCard key={post.id} post={post} index={index} />
            ))}
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
