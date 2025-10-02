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
  ArrowLeft,
  Calendar,
  Clock,
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
import { useParams, useRouter } from "next/navigation";

// Sample docs data - same as in docs/page.tsx
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
    content: `
      <p>In the rapidly evolving landscape of programming and software development, artificial intelligence has become both a powerful tool and a potential challenge for educational institutions and coding platforms. At Syntax Sentry, we've developed sophisticated methods to detect AI-generated code, ensuring transparency and maintaining the integrity of programming education and assessment.</p>
      
      <h2>The Challenge of AI-Generated Code</h2>
      
      <p>With the rise of advanced language models like GPT-4, GitHub Copilot, and other AI coding assistants, it has become increasingly difficult to distinguish between human-written and AI-generated code. This presents significant challenges for:</p>
      
      <ul>
        <li>Educational institutions assessing student work</li>
        <li>Coding platforms hosting competitions</li>
        <li>Companies evaluating candidates' technical skills</li>
        <li>Open-source projects maintaining quality standards</li>
      </ul>
      
      <p>Our mission at Syntax Sentry is not to discourage the use of AI tools, which can be valuable learning aids, but to provide transparency about their usage.</p>
      
      <h2>Our Detection Methodology</h2>
      
      <p>Syntax Sentry employs a multi-layered approach to AI code detection:</p>
      
      <h3>1. Stylometric Analysis</h3>
      
      <p>Every programmer has a unique "fingerprint" in their coding style. Our algorithms analyze patterns in:</p>
      
      <ul>
        <li>Variable naming conventions</li>
        <li>Code formatting preferences</li>
        <li>Function organization</li>
        <li>Comment style and frequency</li>
        <li>Problem-solving approaches</li>
      </ul>
      
      <p>By establishing a baseline of a user's coding style across multiple submissions, we can identify deviations that may indicate AI assistance.</p>
      
      <h3>2. Statistical Pattern Recognition</h3>
      
      <p>AI models often generate code with statistical patterns that differ from human-written code. Our system analyzes:</p>
      
      <ul>
        <li>Token distribution and frequency</li>
        <li>Syntactic structures</li>
        <li>Error patterns and correction methods</li>
        <li>Solution approach uniqueness</li>
      </ul>
      
      <h3>3. Temporal Analysis</h3>
      
      <p>The timing and sequence of code creation can reveal important clues. We examine:</p>
      
      <ul>
        <li>Typing speed and patterns</li>
        <li>Editing behavior</li>
        <li>Time spent on different parts of the solution</li>
        <li>Debugging approaches</li>
      </ul>
      
      <h3>4. Contextual Understanding</h3>
      
      <p>Our system evaluates whether the code demonstrates a deep understanding of the problem context or exhibits the more generic patterns typical of AI-generated solutions.</p>
      
      <h2>Accuracy and Continuous Improvement</h2>
      
      <p>No detection system is perfect, which is why we:</p>
      
      <ul>
        <li>Provide confidence scores rather than binary judgments</li>
        <li>Continuously train our models on new data</li>
        <li>Incorporate feedback from users and educators</li>
        <li>Adapt to evolving AI coding capabilities</li>
      </ul>
      
      <p>Our current accuracy rates exceed 94% in controlled testing environments, with ongoing improvements as we gather more data.</p>
      
      <h2>Ethical Considerations</h2>
      
      <p>We recognize the ethical complexities of AI detection and are committed to:</p>
      
      <ul>
        <li>Transparency in our methodologies</li>
        <li>Privacy protection for all users</li>
        <li>Avoiding false positives that could unfairly impact students or developers</li>
        <li>Supporting educational uses of AI while maintaining assessment integrity</li>
      </ul>
      
      <h2>Looking Forward</h2>
      
      <p>As AI continues to evolve, so too will our detection methods. We're investing in research to stay ahead of the curve, ensuring that Syntax Sentry remains a trusted tool for maintaining transparency in programming education and assessment.</p>
      
      <p>By providing clear insights into the origin of code, we help create an environment where AI can be used as a learning tool while preserving the value of human skill development and fair assessment.</p>
    `
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
    content: `
      <p>We're excited to give you a sneak peek at the alpha version of Syntax Sentry! Your feedback is invaluable at this stage. This guide will walk you through downloading, installing (loading), and testing the packed browser extension.</p>

      <h2>What is a Packed Extension?</h2>
      <p>A packed extension is typically a <code>.crx</code> file (for Chrome-based browsers) or a <code>.zip</code> file that contains all the extension's code and assets. For alpha testing, we might provide it as a <code>.zip</code> file that you'll load as an "unpacked" extension.</p>

      <h2>Step 1: Download the Extension File</h2>
      <p>You will receive a link to download the extension package (e.g., <code>syntax-sentry-alpha.zip</code>). Download this file to a known location on your computer.</p>
      <p>If it's a <code>.zip</code> file, extract its contents into a dedicated folder. For example, create a folder named <code>syntax-sentry-alpha-test</code> and extract the files there.</p>

      <h2>Step 2: Enable Developer Mode in Your Browser</h2>
      <p>These instructions are for Google Chrome, but other Chromium-based browsers (like Edge, Brave, Opera) will have very similar steps.</p>
      <ol>
        <li>Open your Chrome browser.</li>
        <li>Type <code>chrome://extensions</code> into the address bar and press Enter.</li>
        <li>In the top right corner of the Extensions page, toggle on "Developer mode".</li>
      </ol>
      <p>Enabling Developer Mode will reveal new options, including "Load unpacked".</p>

      <h2>Step 3: Load the Extension</h2>
      <p>With Developer Mode enabled:</p>
      <ol>
        <li>Click on the "Load unpacked" button that appeared on the Extensions page.</li>
        <li>A file dialog will open. Navigate to and select the folder where you extracted the extension files (e.g., <code>syntax-sentry-alpha-test</code>). Do <em>not</em> select the .zip file itself; select the folder containing the <code>manifest.json</code> file and other extension assets.</li>
        <li>Click "Select Folder".</li>
      </ol>
      <p>If successful, you should see the Syntax Sentry extension card appear in your list of extensions. Make sure it's enabled (the toggle switch on the card should be blue).</p>

      <h2>Step 4: Testing the Extension</h2>
      <p>Now it's time to test! The specific testing procedures will depend on the current features of the alpha build. We will provide a separate document or instructions outlining what to test.</p>
      <p>Generally, you'll want to:</p>
      <ul>
        <li>Interact with the extension's UI (if any).</li>
        <li>Use it in scenarios it's designed for (e.g., on coding websites, IDEs if it integrates).</li>
        <li>Try to break it! Edge cases and unexpected behavior are important to find.</li>
        <li>Note any errors, visual glitches, or confusing aspects.</li>
      </ul>

      <h2>Step 5: Reporting Feedback and Bugs</h2>
      <p>Your feedback is crucial. Please report any bugs, suggestions, or general thoughts through the channels we've provided (e.g., a specific email address, a feedback form, or a shared document).</p>
      <p>When reporting a bug, please include:</p>
      <ul>
        <li>Steps to reproduce the bug.</li>
        <li>What you expected to happen.</li>
        <li>What actually happened.</li>
        <li>Screenshots or screen recordings if possible.</li>
        <li>Your browser version and operating system.</li>
      </ul>
      <p>Thank you for helping us make Syntax Sentry better!</p>
    `
  },
  {
    id: 3,
    title: "How to Improve Your Coding Skills Without AI",
    excerpt: "Practical tips and strategies to enhance your programming abilities through traditional learning methods and practice.",
    date: "July 12, 2023",
    author: "Sarah Johnson",
    authorRole: "Senior Developer",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop",
    readTime: "5 min read",
    featured: false,
    content: `
      <p>While AI coding assistants offer convenient shortcuts, developing strong programming skills still requires dedicated practice and understanding. This article provides strategies for improving your coding abilities independently.</p>
      
      <h2>Deliberate Practice Techniques</h2>
      
      <p>Effective skill development comes from focused, intentional practice that pushes your boundaries. Consider these approaches:</p>
      
      <ul>
        <li>Solve problems without looking at solutions first</li>
        <li>Implement the same solution in multiple programming languages</li>
        <li>Refactor existing code to improve efficiency</li>
        <li>Participate in code reviews to gain different perspectives</li>
      </ul>
      
      <h2>Building a Learning Routine</h2>
      
      <p>Consistency is key to skill development. Establish a regular practice schedule that includes:</p>
      
      <ul>
        <li>Daily coding challenges of increasing difficulty</li>
        <li>Reading high-quality code from open-source projects</li>
        <li>Building personal projects that solve real problems</li>
        <li>Teaching concepts to others to solidify understanding</li>
      </ul>
      
      <p>By investing in these fundamental practices, you'll develop a deeper understanding of programming principles that will serve you well regardless of how AI tools evolve.</p>
    `
  },
  {
    id: 4,
    title: "The Future of Code Analysis Tools",
    excerpt: "A deep dive into how code analysis tools are evolving and what to expect in the next generation of programming assistance.",
    date: "August 22, 2023",
    author: "David Park",
    authorRole: "Technology Futurist",
    coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000&auto=format&fit=crop",
    readTime: "7 min read",
    featured: false,
    content: `
      <p>Code analysis tools are undergoing a significant transformation, moving beyond simple linting and error detection to become sophisticated programming partners. This article explores emerging trends and future directions.</p>
      
      <h2>Beyond Syntax: Semantic Understanding</h2>
      
      <p>Next-generation code analysis tools are developing deeper semantic understanding, allowing them to:</p>
      
      <ul>
        <li>Identify logical errors and edge cases</li>
        <li>Suggest architectural improvements</li>
        <li>Detect potential security vulnerabilities earlier in development</li>
        <li>Provide context-aware recommendations</li>
      </ul>
      
      <h2>Personalized Development Environments</h2>
      
      <p>Future tools will adapt to individual coding styles and preferences, creating personalized experiences that enhance productivity while supporting skill development.</p>
      
      <h2>Collaborative Intelligence</h2>
      
      <p>The most promising direction is the evolution of collaborative intelligence, where human creativity and AI capabilities combine to create better software than either could produce alone.</p>
      
      <p>As these tools evolve, the most successful developers will be those who learn to effectively collaborate with AI assistants while maintaining their core programming skills and critical thinking abilities.</p>
    `
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
    content: `
      <p>As AI code generation tools become more sophisticated, so do the attempts to use them illicitly to bypass academic integrity checks or misrepresent coding abilities. Understanding these evasion techniques is crucial for developing robust detection systems.</p>

      <h2>Common Evasion Tactics</h2>
      <p>Students and sometimes even developers might employ various strategies to make AI-generated code appear original:</p>
      <ul>
        <li><strong>Superficial Modifications:</strong> Changing variable names, reordering lines of code that don't affect logic, or altering comments. These are often the easiest to detect.</li>
        <li><strong>Code Obfuscation:</strong> Intentionally making code harder to understand by using complex syntax, indirect logic, or tools designed to scramble code. While this can make manual review difficult, it often leaves statistical fingerprints detectable by AI.</li>
        <li><strong>Paraphrasing and Rephrasing:</strong> Using AI tools to rewrite or "humanize" existing AI-generated code. This can involve changing sentence structures in comments or altering coding patterns slightly.</li>
        <li><strong>Incremental AI Use:</strong> Generating small snippets of code with AI and manually integrating them into a larger, human-written project. This is harder to detect but can still show inconsistencies in style or complexity.</li>
        <li><strong>Mosaic Plagiarism:</strong> Combining code from multiple AI outputs or online sources, making minor changes to each piece.</li>
      </ul>

      <h2>How Syntax Sentry Addresses Evasion</h2>
      <p>Our detection mechanisms are designed to look beyond surface-level changes:</p>
      <h3>1. Deep Stylometric Analysis</h3>
      <p>We don't just look at variable names. Our system analyzes deep structural patterns, function complexity, choice of algorithms, and even subtle consistencies in how a user typically structures their logic. Evasion attempts often introduce anomalies in these deeper patterns.</p>
      <h3>2. Behavioral Biometrics</h3>
      <p>The process of writing code is as important as the final product. We analyze typing cadence, editing patterns, and the sequence of code construction. AI-generated code often appears too quickly or with an unnaturally polished edit history.</p>
      <h3>3. Cross-Comparison and Historical Data</h3>
      <p>By comparing a submission against a user's past work and a vast database of known AI-generated code patterns, we can identify outliers and suspicious similarities, even if the code has been modified.</p>
      <h3>4. Semantic Understanding</h3>
      <p>Our models attempt to understand the 'intent' and 'method' of the code. Obfuscated or heavily modified AI code can sometimes lose semantic coherence or introduce subtle logical flaws that our system flags.</p>

      <h2>The Arms Race</h2>
      <p>The development of AI detection is an ongoing 'arms race' with evasion techniques. As AI tools evolve, detection methods must become more sophisticated. We continuously update our models with new data and research emerging evasion strategies to ensure Syntax Sentry remains at the forefront of academic integrity and code transparency.</p>
      <p>Our goal is not just to catch cheating, but to encourage genuine learning and skill development by providing a fair and transparent assessment environment.</p>
    `
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
    content: `
      <p>The rise of powerful AI coding assistants presents a new dimension to the age-old problem of academic dishonesty. Understanding why students might resort to using these tools inappropriately is key to developing effective countermeasures and fostering a culture of integrity.</p>

      <h2>Motivations Behind AI-Assisted Cheating</h2>
      <p>Several factors can contribute to a student's decision to misuse AI tools:</p>
      <ul>
        <li><strong>Academic Pressure:</strong> Intense competition, fear of failure, and the pressure to achieve high grades can lead students to seek shortcuts.</li>
        <li><strong>Lack of Confidence:</strong> Students who doubt their own abilities or feel unprepared for an assignment may turn to AI for a quick solution.</li>
        <li><strong>Time Constraints:</strong> Heavy workloads, part-time jobs, and poor time management can make students feel that using AI is their only option to meet deadlines.</li>
        <li><strong>Misunderstanding of Ethical Boundaries:</strong> Some students may not fully grasp what constitutes plagiarism or academic dishonesty when using AI tools, especially if guidelines are unclear.</li>
        <li><strong>Perceived Normalization:</strong> If students believe "everyone else is doing it," they may be more likely to engage in similar behavior.</li>
        <li><strong>Thrill or Curiosity:</strong> For a small minority, trying to "beat the system" can be a motivating factor.</li>
      </ul>

      <h2>Fostering a Culture of Academic Integrity</h2>
      <p>Preventing AI-assisted cheating requires a multi-pronged approach that goes beyond just detection:</p>
      <h3>1. Clear Policies and Expectations</h3>
      <p>Educational institutions must establish and clearly communicate policies regarding the use of AI tools in coursework. This includes defining what is permissible and what constitutes academic misconduct.</p>
      <h3>2. Educating on Ethical AI Use</h3>
      <p>Instead of outright banning AI tools, educators can teach students how to use them ethically as learning aids—for example, for brainstorming, understanding concepts, or debugging, rather than for generating final submissions.</p>
      <h3>3. Designing AI-Resistant Assessments</h3>
      <p>Assignments that require higher-order thinking, creativity, personalized reflection, or in-class components are more difficult to complete solely with AI. Focus on the process of learning, not just the final output.</p>
      <h3>4. Promoting Intrinsic Motivation</h3>
      <p>Help students find genuine interest in the subject matter. When students are intrinsically motivated, they are less likely to cheat.</p>
      <h3>5. Open Dialogue and Support</h3>
      <p>Create an environment where students feel comfortable discussing challenges and seeking help. Addressing the root causes of stress and anxiety can reduce the temptation to cheat.</p>
      <h3>6. Emphasizing the Value of Original Work</h3>
      <p>Highlight the importance of developing one's own problem-solving skills and the long-term benefits of genuine learning over short-term gains from cheating.</p>

      <p>At Syntax Sentry, while we provide tools for detection, we believe that fostering an ethical academic environment is a collaborative effort involving educators, students, and institutions. By understanding the psychology behind AI cheating, we can better address its root causes and promote genuine academic achievement.</p>
    `
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
        <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
          Home
        </Link>
        <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
          Dashboard
        </Link>
        <Link href="/docs" className="text-sm font-medium text-primary transition-colors">
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

export default function DocsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  
  const post = docsPosts.find(post => post.id === id);
  
  if (!post) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Docs post not found</h1>
        <p className="mb-6">The docs post you're looking for doesn't exist.</p>
        <Link href="/docs" className="text-primary hover:underline">
          Return to docs
        </Link>
      </div>
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
      
      <main className="flex-grow">
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="container mx-auto px-4 absolute inset-0 z-20 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href="/docs" 
                className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to docs
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-3xl">
                {post.title}
              </h1>
              <div className="flex items-center text-white/90 space-x-4">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-8 border-b pb-6">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-primary font-semibold text-lg">
                {post.author.charAt(0)}
              </div>
              <div className="ml-4">
                <div className="font-medium">{post.author}</div>
                <div className="text-sm text-muted-foreground">{post.authorRole}</div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="mt-12 pt-6 border-t">
              <h3 className="text-xl font-semibold mb-4">Continue Reading</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {docsPosts
                  .filter(p => p.id !== post.id)
                  .slice(0, 2)
                  .map((relatedPost, index) => (
                    <Link key={relatedPost.id} href={`/docs/${relatedPost.id}`}>
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className="flex items-start space-x-4 group"
                      >
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={relatedPost.coverImage} 
                            alt={relatedPost.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {relatedPost.readTime}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
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