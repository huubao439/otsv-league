/**
 * Route-level fallback. Pages are cached and prefetched, so this is normally
 * skipped — it only shows on a cold or freshly revalidated route, where it
 * keeps the shell on screen instead of leaving the previous page frozen.
 */
function Bar({ className = "" }: { className?: string }) {
  return <span className={`block animate-pulse rounded-md bg-[var(--surface-2)] ${className}`} />;
}

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="mx-auto flex w-full max-w-[1280px] flex-col gap-5.5 px-4 py-9 pb-18 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-2.5">
        <Bar className="h-3 w-48" />
        <Bar className="h-11 w-80 max-w-full" />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="flex flex-col gap-3 rounded-[22px] border border-border bg-[var(--surface)] p-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Bar className="h-10 w-10 shrink-0 rounded-full" />
              <Bar className="h-4 flex-1" />
              <Bar className="h-4 w-10 shrink-0" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-[20px] border border-border bg-[var(--surface)] p-6">
          <Bar className="h-4 w-28" />
          <Bar className="h-3 w-full" />
          <Bar className="h-3 w-3/4" />
        </div>
      </div>
    </div>
  );
}
