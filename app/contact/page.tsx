"use client";

import React, { useState } from "react";
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
  ArrowLeft,
  Calendar,
  Clock,
  LifeBuoy,
  Headphones,
  FileText,
  Lock,
  Send
} from "lucide-react";import { Footer } from "@/app/components/footer";
import { Hexagon, Github, Twitter } from "lucide-react";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/input";
import { Label } from "@/app/components/ui/lable";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/app/components/navbar";


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
        <Link href="/contact" className="text-sm font-medium text-primary transition-colors">
          Contact
        </Link>
      </div>
      <ThemeToggle />
    </nav>
  );
}

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
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
          <Navbar />
          <div className="mt-3 md:hidden flex justify-center">
            <ExpandableTabs tabs={tabs} />
          </div>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl font-bold mb-3">Contact Us</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Have questions or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-3"
            >
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Send size={24} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground text-center">
                      Thank you for reaching out. We'll get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">Name</Label>
                      <Input 
                        id="name"
                        name="name"
                        type="text" 
                        placeholder="Your name" 
                        required 
                        className="h-10"
                        value={formState.name}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email" 
                        placeholder="your.email@example.com" 
                        required 
                        className="h-10"
                        value={formState.email}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm">Message</Label>
                      <textarea 
                        id="message"
                        name="message"
                        placeholder="How can we help you?" 
                        required 
                        rows={4}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formState.message}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-10"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-2"
            >
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border h-full flex flex-col justify-center">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <a 
                      href="mailto:syntaxsentry@gmail.com" 
                      className="text-primary hover:underline"
                    >
                      syntaxsentry@gmail.com
                    </a>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Office Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9AM - 5PM EST
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Response Time</h3>
                    <p className="text-muted-foreground">
                      We typically respond within 24-48 business hours.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
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