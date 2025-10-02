import { Badge } from "@/app/components/ui/badge";
import Image from "next/image";

function Feature() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div></div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                Something new!
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
                Groundbreaking anti-cheating features never seen before in
                competitive coding.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <div className="bg-muted rounded-md aspect-video mb-2">
                <Image
                  src="/img/img2.jpg"
                  alt="Image"
                  width={500}
                  height={300}
                />
              </div>
              <h3 className="text-xl tracking-tight">
                User Activity Monitoring
              </h3>
              <p className="text-muted-foreground text-base">
                Track key presses, mouse movements, and tab activity to detect
                inactivity, suspicious behavior, and potential cheating
                attempts.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-muted rounded-md aspect-video mb-2">
                <Image
                  src="/img/img3.png"
                  alt="Image"
                  width={500}
                  height={300}
                />
              </div>
              <h3 className="text-xl tracking-tight">
                Code Integrity and AI Detection
              </h3>
              <p className="text-muted-foreground text-base">
                Analyze code modifications, detect AI-assisted code generation,
                and ensure the integrity of the written solution.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-muted rounded-md aspect-video mb-2">
                <Image
                  src="/img/img4.png"
                  alt="Image"
                  width={500}
                  height={300}
                />
              </div>
              <h3 className="text-xl tracking-tight">
                Clipboard & Behavioral Analysis
              </h3>
              <p className="text-muted-foreground text-base">
                Monitor clipboard history, detect repeated pasting, and compare
                user behavior against others to identify anomalies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
