import Link from "next/link";
import { Hexagon } from "lucide-react";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { Button } from "@/app/components/ui/button";

export function Navbar() {
  return (
    <header className="w-full">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Hexagon className="h-6 w-6" />
          <span className="font-bold text-xl">Syntax Sentry</span>
        </Link>
        
        <nav className="hidden md:flex gap-6 items-center">
          <Link 
            href="/" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link 
            href="/dashboard" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link 
            href="/room" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Rooms
          </Link>
          <Link 
            href="/docs" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Docs
          </Link>
          <Link 
            href="/contact" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="default" size="sm" className="hidden md:inline-flex">
            <Link href="https://github.com/officialSyntaxSentry/packed-extension-chrome" target="_blank">
              Install Extension
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
