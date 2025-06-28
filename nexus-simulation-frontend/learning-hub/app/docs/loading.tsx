import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-96" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-10 flex-1" />
        </div>

        <div className="mt-2">
          <Skeleton className="h-10 w-96" />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="mt-2 h-4 w-full" />
              <div className="mt-4 flex items-center gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="mt-6 h-9 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
