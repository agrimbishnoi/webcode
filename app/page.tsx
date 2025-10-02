"use client";
import DatabaseWithRestApi from "@/app/components/database-with-rest-api";
import { FaqSection } from "@/app//components/faq";
import { Hero } from "@/app/components/animated-hero";
import {
  Home,
  LayoutDashboard,
  DoorOpen,
  LifeBuoy,
  FileText,
} from "lucide-react";
import { ExpandableTabs } from "@/app/components/expandable-tabs";
import { Feature } from "@/app/components/feature-section-with-grid";
import { Hexagon, Github, Twitter } from "lucide-react";
import { Footer } from "@/app/components/footer";
import React, { useState } from "react";
import { Compare } from "@/app/components/compare";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/app/components/hero-highlight";
import { Input } from "@/app/components/input";
import { Label } from "@/app/components/ui/lable";
import { ArrowRight, Search } from "lucide-react";
import { useId } from "react";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { HeroVideoDialog } from "@/app/components/hero-video-dialog";
import { TestimonialsSection } from "@/app/components/testimonials-with-marquee";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Navbar } from "@/app/components/navbar";
import { Wrench } from "lucide-react";
import { Banner } from "@/app/components/banner";


function BannerDemo() {
  const [show, setShow] = useState(true);

  return (
    <Banner
      show={show}
      onHide={() => setShow(false)}
      icon={<Wrench className="m-px h-4 w-4 text-green-800" />}
      title={
        <>
          <span className="font-semibold">Syntax Sentry is in Alpha!</span>
          <br />
          Be among the first to test and experience the platform as we continue
          to improve and add new features.
        </>
      }
      learnMoreUrl="docs/2"
    />
  );
}

function SearchComponent() {
  const id = useId();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search/${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4 max-w-xl mx-auto w-full"
    >
      <div className="text-center mb-2">
        <h2 className="text-2xl font-semibold">Search LeetCode Activity</h2>
        <p className="text-muted-foreground mt-1">
          Find user activities and track coding patterns
        </p>
      </div>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative rounded-lg border-2 border-input bg-background/80 backdrop-blur-sm hover:border-primary/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 shadow-lg">
          <Input
            id={id}
            className="peer pl-11 pr-11 h-14 text-base border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-0"
            placeholder="Search leetcode username and find activities"
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-4 text-muted-foreground peer-disabled:opacity-50">
            <Search size={20} strokeWidth={2} />
          </div>
          <button
            type="submit"
            className="absolute inset-y-0 end-0 flex h-full w-14 items-center justify-center rounded-e-md text-muted-foreground hover:text-foreground transition-colors focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Submit search"
          >
            <ArrowRight size={20} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function HeroDemo() {
  return (
    <div className="block">
      <Hero />
    </div>
  );
}

function FeatureDemo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full"
    >
      <Feature />
    </motion.div>
  );
}

function CompareDemo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 px-4 mb-8"
    >
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <Compare
          firstImage="https://assets.aceternity.com/code-problem.png"
          secondImage="https://assets.aceternity.com/code-solution.png"
          firstImageClassName="object-cover object-left-top"
          secondImageClassname="object-cover object-left-top"
          className="h-[250px] w-full md:w-[500px] md:h-[500px]"
          slideMode="hover"
        />
        <div className="max-w-md">
          <h3 className="text-xl font-semibold mb-2">
            AI Detection Technology
          </h3>
          <p className="text-muted-foreground">
            Syntax Sentry employs in-house machine learning models and advanced
            algorithms to detect whether a piece of code was generated by AI or
            manually written by a human. The system also estimates the
            percentage of AI-generated content, allowing for transparency in
            programming assignments, coding competitions, and online learning
            platforms like LeetCode.{" "}
          </p>
          <div className="mt-4">
            <Link
              href="/docs/1"
              className="inline-flex items-center text-primary hover:underline"
            >
              Read our Methods & Practices
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const DEMO_FAQS = [
  {
    question: "What is Syntax Sentry?",
    answer: "Syntax Sentry is a Chrome extension that monitors user activity on LeetCode problem pages to detect cheating behaviors and analyze coding patterns. It provides real-time insights and logs activity for further review.",
  },
  {
    question: "How does Syntax Sentry track activity?",
    answer: "Once activated on a LeetCode problem page, Syntax Sentry captures user interactions, such as code submissions, tab switches, clipboard usage, and keystrokes. This data is securely sent to a Next.js backend for analysis and visualization.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, Syntax Sentry ensures that all collected data is handled safely. It does not store sensitive personal information and only logs activity relevant to cheating detection. The data is stored in MongoDB and can only be accessed through authorized channels.",
  },
  {
    question: "Where is the collected data stored?",
    answer: "All activity data is stored in a MongoDB database, ensuring safe and efficient data handling. The data can be accessed and analyzed through the Syntax Sentry dashboard in real time.",
  },
];

function HeroHighlightDemo() {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        Dashboard showcasing all users & AI-powered activity analysis —
        <Highlight className="text-black dark:text-white">
          Making everything transparent. For everyone.
        </Highlight>
      </motion.h1>
    </HeroHighlight>
  );
}

function HeroVideoDialogDemoTopInBottomOut() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative max-w-4xl mx-auto px-4 md:px-8"
    >
      <HeroVideoDialog
        className="dark:hidden block"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/U0IQ9q-gGCo"
        thumbnailSrc="https://raw.githubusercontent.com/agrim-rai/personal-cdn/refs/heads/main/Screenshot%202025-05-17%20123418.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/U0IQ9q-gGCo"
        thumbnailSrc="https://raw.githubusercontent.com/agrim-rai/personal-cdn/refs/heads/main/Screenshot%202025-05-17%20123418.png"
        thumbnailAlt="Hero Video"
      />
    </motion.div>
  );
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

function BackgroundBeamsDemo() {
  return (
    <div className="h-[40rem] w-full rounded-md bg-background relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground text-center font-sans font-bold">
          Join the waitlist
        </h1>
        <p></p>
        <p className="text-muted-foreground max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Welcome to MailJet, the best transactional email service on the web.
          We provide reliable, scalable, and customizable email solutions for
          your business. Whether you&apos;re sending order confirmations,
          password reset emails, or promotional campaigns, MailJet has got you
          covered.
        </p>
        <Input
          type="email"
          placeholder="hi@manuarora.in"
          className="w-full mt-4 relative z-10"
        />
      </div>
    </div>
  );
}

const testimonials = [
  {
    author: {
      name: "Emma Thompson",
      handle: "@emmaai",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    text: "Using this AI platform has transformed how we handle data analysis. The speed and accuracy are unprecedented.",
    href: "https://twitter.com/emmaai",
  },
  {
    author: {
      name: "David Park",
      handle: "@davidtech",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    text: "The API integration is flawless. We've reduced our development time by 60% since implementing this solution.",
    href: "https://twitter.com/davidtech",
  },
  {
    author: {
      name: "Sofia Rodriguez",
      handle: "@sofiaml",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    },
    text: "Finally, an AI tool that actually understands context! The accuracy in natural language processing is impressive.",
  },
];

export default function HomePage() {
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center mt-3 md:hidden ">
        <ExpandableTabs tabs={tabs} />
      </div>

      <main className="flex-grow">
        <section className="mx-auto p-4 p-6 md:py-10">
          <BannerDemo />

          <HeroDemo />
        </section>

        <section className="container mx-auto px-4 py-6 md:py-10">
          <SearchComponent />
        </section>

        <section className="container mx-auto px-4 py-8 md:py-12 space-y-16">
          <HeroVideoDialogDemoTopInBottomOut />
          <FeatureDemo />
          <div className="flex justify-center items-center w-full p-4 rounded-xl bg-accent/20 w-full">
            <DatabaseWithRestApi />
          </div>
          <CompareDemo />

          <HeroHighlightDemo />

<FaqSection
  title="Frequently Asked Questions"
  description="Everything you need to know about our platform"
  items={DEMO_FAQS}
  contactInfo={{
    title: "Still have questions?",
    description: "We're here to help you",
    buttonText: "Contact Support",
    onContact: () => (window.location.href = "/contact") 
  }}
/>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          ></motion.div>
        </section>
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
