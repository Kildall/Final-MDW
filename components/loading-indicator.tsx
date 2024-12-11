'use client';
import { Progress } from "@/components/ui/progress";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface LoadingIndicatorProps {
  position?: 'fixed' | 'relative';
}

export const LoadingIndicator = ({ position = 'fixed' }: LoadingIndicatorProps) => {
  const isLoading = useSelector((state: RootState) => state.loading.activeThunks.length > 0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      setProgress(0)
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(timer)
            return 90
          }
          return prev + 10
        })
      }, 200)

      return () => clearInterval(timer)
    } else {
      setProgress(100)
      const timer = setTimeout(() => setProgress(0), 200)
      return () => clearInterval(timer)
    }
  }, [isLoading])

  if (!isLoading && progress === 0) return null

  const positionClasses = {
    fixed: "fixed top-0 left-0 right-0 z-50",
    relative: "relative w-full"
  }

  return (
    <div className={positionClasses[position]}>
      <Progress value={progress} className="h-1 rounded-none" />
    </div>
  )
}