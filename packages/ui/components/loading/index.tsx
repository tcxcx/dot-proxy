'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const previousLoadingState = useRef(isLoading);
  
  // Enhanced scroll lock implementation
  useEffect(() => {
    if (isLoading) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      
      // Apply techniques to prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore scrolling when loading is complete
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isLoading]);
  
  // Handle transition when loading state changes
  useEffect(() => {
    // Only trigger the transition effect when changing from loading to not loading
    if (previousLoadingState.current && !isLoading) {
      // Add a delay before hiding to ensure smooth transition
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    // Update the ref for next comparison
    previousLoadingState.current = isLoading;
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center w-screen h-screen overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.5, ease: "easeInOut" }
          }}
        >
                  <div className="hero-gradients absolute inset-0 z-0">
                <div className="absolute bottom-auto left-auto right-0 top-0 h-[400px] w-[400px] -translate-x-[20%] translate-y-[10%] rounded-full bg-[rgba(230,0,122,0.3)] opacity-50 blur-[50px]"></div>
                <div className="absolute bottom-auto left-auto right-40 top-0 h-[500px] w-[500px] -translate-x-[50%] translate-y-[30%] rounded-full bg-[rgba(230,0,122,0.2)] opacity-50 blur-[50px]"></div>
                <div className="absolute bottom-auto left-auto left-20 top-0 h-[300px] w-[300px] translate-x-[10%] translate-y-[5%] rounded-full bg-[rgba(230,0,122,0.4)] opacity-50 blur-[50px]"></div>
                <div className="absolute bottom-auto left-auto left-10 top-20 h-[400px] w-[300px] translate-x-[10%] translate-y-[5%] rounded-full bg-[rgba(230,0,122,0.25)] opacity-50 blur-[50px]"></div>
            </div>
          {/* Logo animation */}
          <motion.div
            className="mb-10 relative w-48 h-48"
            animate={{ 
              scale: [0.95, 1, 0.95],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <Image
              src="/Polkadot_Logo_Horizontal_Pink_White.svg"
              alt="Polkadot Logo"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
          
          {/* "DOT PROXY GOV" text with the Unbounded font */}
          <motion.div 
            className="flex flex-col items-center"
          >        
            {/* Loading bar */}
            <div className="w-64 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-transparent rounded-full"
                initial={{ width: '0%', x: '-100%' }}
                animate={{
                  width: '100%', 
                  x: '100%'
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
            
            {/* Loading text with animated dots */}
            <motion.div 
              className="mt-4 text-gray-400 text-sm font-unbounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center">
                <span>LOADING</span>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="inline-block ml-[0.1em]"
                    animate={{ 
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: i * 0.2 // Stagger the animations
                    }}
                  >
                    .
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

