"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";


interface BannerProps {
  show: boolean;
  onHide: () => void;
  icon?: React.ReactNode;
  title: React.ReactNode;
  learnMoreUrl?: string;
}

export function Banner({ show, onHide, icon, title, learnMoreUrl }: BannerProps) {
  const router = useRouter();

  if (!show) return null;

  return (
    <div className="relative isolate flex flex-col justify-between gap-3 overflow-hidden rounded-lg border border-green-600/15 bg-gradient-to-r from-lime-100/80 to-emerald-100/80 py-3 pl-4 pr-12 sm:flex-row sm:items-center sm:py-2">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="hidden rounded-full border border-green-600/50 bg-white/50 p-1 shadow-[inset_0_0_1px_1px_#fff] sm:block">
            {icon}
          </div>
        )}
        <p className="text-sm text-gray-900">
          {title}
          {learnMoreUrl && (
            <button
              onClick={() => router.push(learnMoreUrl)}
              className="text-gray-700 underline transition-colors hover:text-black ml-1"
            >
              Learn more
            </button>
          )}
        </p>
      </div>

      <button
        type="button"
        className="absolute inset-y-0 right-2.5 p-1 text-sm text-green-700 underline transition-colors hover:text-green-900"
        onClick={onHide}
      >
        <X className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}
