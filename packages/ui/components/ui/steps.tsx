"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface StepProps {
  number: number;
  children: React.ReactNode;
}

export function Step({
  number,
  children,
}: StepProps) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm">
        {number}
      </div>
      <div className="flex-1 pt-1">{children}</div>
    </div>
  );
}

// @ts-ignore - Intentionally empty interface
interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Steps({
  children,
  className,
  ...props
}: StepsProps) {
  const childCount = React.Children.count(children);
  
  return (
    <div
      className={cn("space-y-4", className)}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;
        
        return (
          <div className="relative">
            {index !== childCount - 1 && (
              <div className="absolute left-[15px] top-[30px] bottom-0 w-[1px] bg-border" />
            )}
            {/* We need to safely clone the element with number prop */}
            {React.cloneElement(child, {
              // @ts-ignore - Intentionally empty interface
              number: index + 1
            })}
          </div>
        );
      })}
    </div>
  );
} 