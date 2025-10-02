import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/app/components/ui/testimonial-card"
import { useEffect, useRef, useState } from "react"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className 
}: TestimonialsSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section className={cn(
      "bg-background text-foreground",
      "py-12 sm:py-16 md:py-20 px-0",
      className
    )}>
      <div className="mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-8">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-6">
          <h2 className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-4xl sm:leading-tight">
            {title}
          </h2>
          <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-lg">
            {description}
          </p>
        </div>

        <div 
          className="relative w-full overflow-hidden py-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          ref={containerRef}
        >
          {/* Single marquee with continuous movement */}
          <div 
            className={cn(
              "flex gap-4",
              isHovered ? "animate-pause" : "animate-marquee"
            )}
            style={{ 
              animationDuration: "30s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite" 
            }}
          >
            {/* Double the testimonials to create a smooth loop */}
            {[...testimonials, ...testimonials, ...testimonials].map((testimonial, idx) => (
              <div 
                key={`testimonial-${idx}`} 
                className="flex-shrink-0 w-[300px] md:w-[350px]"
              >
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
          
          {/* Gradient overlays for smooth fade effect */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        </div>
      </div>
    </section>
  )
}