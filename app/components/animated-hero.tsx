"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChartColumn, MoveRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["AI-Driven Integrity","Ethical Always", "Safe & Just"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex gap-6 md:gap-8 py-12 md:py-20 lg:py-32 items-center justify-center flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button variant="secondary" size="sm" className="gap-2" asChild>
              <Link href="/docs/1">
                Read our Methods & Practices<MoveRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex gap-4 flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl max-w-2xl tracking-tighter text-center font-regular px-4">
              <span className="text-spektr-cyan-50">Syntax Sentry is </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center px-4">
              Syntax Sentry is an advanced AI-powered tool designed to detect and analyze potential cheating in coding assessments. By tracking user activity, code modifications, and behavioral patterns, we ensure fair competition and maintain academic integrity.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 w-full justify-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button size="lg" className="gap-2" variant="outline" asChild>
              <Link href="/dashboard">
                Dashboard <ChartColumn className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" className="gap-2">
              <a href="https://github.com/officialSyntaxSentry/packed-extension-chrome" target="_blank" rel="noopener noreferrer">
              Install Chromium Extension <MoveRight className="w-4 h-4" />
              </a>
              
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
