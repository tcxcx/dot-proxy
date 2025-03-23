'use client';

import { useEffect, useState } from 'react';
import { useLoading } from '@/store/loading-context';
import LoadingScreen from '@/components/loading';

// This component will be responsible for showing the loading screen
// and coordinating with the SpookyTitle component
export function AppLoadingState() {
  const { isLoading } = useLoading();
  const [showLoader, setShowLoader] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle client-side mounting safely
  useEffect(() => {
    setIsMounted(true);
    
    // Always show the loader initially
    setShowLoader(true);
  }, []);
  
  // Initial loading state handling
  useEffect(() => {
    // Only run this effect after component is mounted
    if (isMounted) {
      // Listen for loading state changes
      if (!isLoading) {
        // Only hide the loader when isLoading becomes false
        // This creates a one-way transition
        setShowLoader(false);
      }
    }
  }, [isLoading, isMounted]);
  
  // Block scrolling during initial load - only on client
  useEffect(() => {
    // Only run this effect after component is mounted
    if (isMounted && showLoader) {
      // Apply complete scroll blocking
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        // Re-enable scrolling when done loading
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, [showLoader, isMounted]);
  
  // Don't render anything during SSR to avoid window reference issues
  if (!isMounted) {
    return null;
  }
  
  return <LoadingScreen isLoading={showLoader} />;
} 