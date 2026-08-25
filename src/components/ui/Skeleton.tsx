interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      aria-hidden="true"
    />
  )
}

export function TransactionSkeleton() {
  return (
    <div className="px-4 py-3 flex items-center gap-3" aria-hidden="true">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

export function AccountCardSkeleton() {
  return (
    <div className="bg-[var(--surface)] rounded-2xl p-4 flex items-center gap-3 border border-[var(--border)]" aria-hidden="true">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-5 w-20" />
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)]" aria-hidden="true">
      <Skeleton className="h-3 w-16 mb-3" />
      <Skeleton className="h-7 w-28" />
    </div>
  )
}
