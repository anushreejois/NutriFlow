import { motion } from "framer-motion";

// --- REUSABLE SKELETON PRIMITIVES ---

export const SkeletonPulse = ({ className = "" }: { className?: string }) => (
  <motion.div
    animate={{ opacity: [0.4, 0.7, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    className={`bg-sage-200/60 dark:bg-gray-700/60 rounded-2xl ${className}`}
  />
);

export const SkeletonText = ({ width = "w-full", className = "" }: { width?: string; className?: string }) => (
  <SkeletonPulse className={`h-4 ${width} ${className}`} />
);

export const SkeletonCircle = ({ size = "w-12 h-12" }: { size?: string }) => (
  <SkeletonPulse className={`${size} rounded-full`} />
);

// --- PAGE-LEVEL SKELETON LAYOUTS ---

export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-sage-50 dark:bg-gray-900 pt-32 pb-20 px-4">
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <SkeletonPulse className="h-10 w-80 mx-auto" />
        <SkeletonText width="w-48" className="mx-auto" />
      </div>

      {/* Tab buttons */}
      <div className="flex justify-center gap-3">
        <SkeletonPulse className="h-12 w-40" />
        <SkeletonPulse className="h-12 w-40" />
      </div>

      {/* Form card */}
      <div className="max-w-3xl mx-auto space-y-6 p-8 bg-white dark:bg-gray-800 rounded-3xl border border-sage-100 dark:border-gray-700">
        <div className="text-center space-y-2">
          <SkeletonPulse className="h-8 w-64 mx-auto" />
          <SkeletonText width="w-48" className="mx-auto" />
        </div>
        {/* Gender buttons */}
        <div className="flex justify-center gap-4">
          <SkeletonPulse className="h-12 w-32" />
          <SkeletonPulse className="h-12 w-32" />
        </div>
        {/* Input fields */}
        <div className="grid grid-cols-3 gap-6">
          <SkeletonPulse className="h-14" />
          <SkeletonPulse className="h-14" />
          <SkeletonPulse className="h-14" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <SkeletonPulse className="h-14" />
          <SkeletonPulse className="h-14" />
        </div>
        {/* Submit button */}
        <SkeletonPulse className="h-14 w-full" />
      </div>
    </div>
  </div>
);

export const BioVaultSkeleton = () => (
  <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pt-28 pb-20 px-6">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10 space-y-3">
        <SkeletonPulse className="h-10 w-40" />
        <SkeletonText width="w-72" />
        <SkeletonPulse className="h-12 w-80 mt-4" />
      </div>

      {/* Plan cards grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2rem] space-y-4">
            <div className="flex justify-between">
              <SkeletonPulse className="h-6 w-24" />
              <SkeletonPulse className="h-4 w-20" />
            </div>
            <SkeletonText width="w-full" />
            <SkeletonText width="w-3/4" />
            <div className="flex gap-4 pt-2">
              <SkeletonPulse className="h-4 w-16" />
              <SkeletonPulse className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="min-h-screen bg-sage-50 dark:bg-gray-950 pt-32 pb-20 px-4">
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <SkeletonPulse className="h-10 w-56 mx-auto" />
        <SkeletonText width="w-40" className="mx-auto" />
      </div>

      {/* Form fields */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-sage-100 dark:border-gray-700 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <SkeletonText width="w-20" />
              <SkeletonPulse className="h-12" />
            </div>
          ))}
        </div>
        <SkeletonPulse className="h-14 w-full mt-4" />
      </div>
    </div>
  </div>
);

export const TrackersSkeleton = () => (
  <div className="min-h-screen bg-sage-50 dark:bg-gray-900 pt-28 pb-20 px-6">
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <SkeletonPulse className="h-10 w-48" />
        <SkeletonText width="w-64" />
      </div>

      {/* Cycle tracker card */}
      <SkeletonPulse className="h-64 w-full rounded-[2.5rem]" />

      {/* Habit + Water grid */}
      <div className="grid grid-cols-2 gap-8">
        <SkeletonPulse className="h-80 rounded-[2.5rem]" />
        <SkeletonPulse className="h-80 rounded-[2.5rem]" />
      </div>

      {/* Weekly progress */}
      <SkeletonPulse className="h-40 w-full rounded-[2.5rem]" />
    </div>
  </div>
);
