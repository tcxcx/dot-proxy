'use client';
import { useState, useRef, useEffect } from 'react';
import SplineCanvas from '../spline-canvas';
import { useLoading } from '@/store/loading-context';
import { ShieldCheck } from "lucide-react";
import { cn } from '@/lib/utils';
import { fontUnbounded } from '@/fonts';

export default function SplineHero() {
    const { isLoading, setIsLoading } = useLoading();
    const splineContainerRef = useRef<HTMLDivElement>(null);
    const [splineLoaded, setSplineLoaded] = useState(false);
    
    // Initialize loading state when component mounts
    useEffect(() => {
        // Ensure loading is active when component mounts
        if (!splineLoaded) {
            setIsLoading(true);
        }
    }, [setIsLoading, splineLoaded]);
    
    // Callback function to handle Spline loaded event
    const handleSplineLoaded = () => {
        console.log("Spline loaded! Starting transition delay...");
        
        // Add a delay after the Spline is loaded before showing the content
        setTimeout(() => {
            console.log("Transition delay complete, showing content");
            setSplineLoaded(true);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
                      {/* Content that appears after loading */}
                      <div className={`relative z-20 text-center transition-opacity duration-1000 ${splineLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <h1
                  className={cn(
                    "text-4xl sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-foreground/70 via-foreground to-foreground/70",
                    fontUnbounded.className
                  )}
                >
                    Proxy Gov
                </h1>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <p className="text-sm sm:text-base">Secure governance participation for Polkadot</p>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <p className="text-base sm:text-lg">Secure Your Voice in Polkadot. Stake your DOT. Vote on proposals. </p>
                </div>
            </div>
            {/* Background gradient blobs */}
            <div className="hero-gradients absolute inset-0 z-0">
                <div className="absolute bottom-auto left-auto right-0 top-0 h-[400px] w-[400px] -translate-x-[20%] translate-y-[10%] rounded-full bg-[rgba(230,0,122,0.3)] opacity-50 blur-[50px]"></div>
                <div className="absolute bottom-auto left-auto right-40 top-0 h-[500px] w-[500px] -translate-x-[50%] translate-y-[30%] rounded-full bg-[rgba(230,0,122,0.2)] opacity-50 blur-[50px]"></div>
                <div className="absolute bottom-auto left-auto left-20 top-0 h-[300px] w-[300px] translate-x-[10%] translate-y-[5%] rounded-full bg-[rgba(230,0,122,0.4)] opacity-50 blur-[50px]"></div>
                <div className="absolute bottom-auto left-auto left-10 top-20 h-[400px] w-[300px] translate-x-[10%] translate-y-[5%] rounded-full bg-[rgba(230,0,122,0.25)] opacity-50 blur-[50px]"></div>
            </div>
            
            {/* Spline Canvas Container */}
            <div 
                ref={splineContainerRef}
                className="spline-container absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center z-10 [&_canvas]:!touch-none"
            >
                <SplineCanvas
                    splineUrl="https://prod.spline.design/oW0f3lYwfhpmEYsS/scene.splinecode"
                    className="w-full h-full max-w-full max-h-full object-contain"
                    onLoaded={handleSplineLoaded}
                />
            </div>
        </div>
    );
}
