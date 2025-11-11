import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const PAGE_PARAM = "page";
const LIMIT_PARAM = "limit";
const LIMIT_OPTIONS = [10, 20, 50, 100] as const;

interface PaginationProps {
  total: number; // total jumlah data
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ total, className = "" }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Ambil nilai dari query params, default page=1 dan limit=50
  const limitFromQuery = Number(searchParams.get(LIMIT_PARAM));
  const pageFromQuery = Number(searchParams.get(PAGE_PARAM));

  const limit = LIMIT_OPTIONS.includes(limitFromQuery as any)
    ? limitFromQuery
    : 50;
  const page =
    Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1;

  const totalPages = Math.max(1, Math.ceil(total / (limit || 50)));
  const clampPage = (p: number) => Math.min(Math.max(1, p), totalPages);

  // Pastikan default query params ada saat pertama kali render
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;

    if (!params.get(PAGE_PARAM)) {
      params.set(PAGE_PARAM, "1");
      changed = true;
    }
    if (!params.get(LIMIT_PARAM)) {
      params.set(LIMIT_PARAM, String(limit)); // default 50
      changed = true;
    }

    if (changed) {
      setSearchParams(params);
    }
    // We want to run when searchParams changes to ensure defaults present
  }, [searchParams, setSearchParams]);

  const updateParams = React.useCallback(
    (next: Partial<{ page: number; limit: number }>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (typeof next.limit === "number") {
        params.set(LIMIT_PARAM, String(next.limit));
      }
      if (typeof next.page === "number") {
        params.set(PAGE_PARAM, String(clampPage(next.page)));
      }

      setSearchParams(params);
    },
    [searchParams, setSearchParams, totalPages]
  );

  const handlePrev = () => {
    updateParams({ page: clampPage(page - 1) });
  };

  const handleNext = () => {
    updateParams({ page: clampPage(page + 1) });
  };

  const handleFirst = () => {
    updateParams({ page: 1 });
  };

  const handleLast = () => {
    updateParams({ page: totalPages });
  };

  const handleLimitChange: React.ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => {
    const nextLimit = Number(e.target.value);
    const validLimit = LIMIT_OPTIONS.includes(nextLimit as any)
      ? nextLimit
      : 50;
    // Reset page ke 1 saat limit berubah
    updateParams({ limit: validLimit, page: 1 });
  };

  const handlePageInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = Number(e.target.value);
    if (!Number.isNaN(val)) {
      updateParams({ page: clampPage(val) });
    }
  };

  // Generate halaman yang ditampilkan ala shadcn (dengan ellipsis)
  const getVisiblePages = (current: number, totalPgs: number) => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPgs <= 7) {
      for (let i = 1; i <= totalPgs; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    const start = Math.max(2, current - 1);
    const end = Math.min(totalPgs - 1, current + 1);
    if (start > 2) pages.push("ellipsis");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPgs - 1) pages.push("ellipsis");
    pages.push(totalPgs);
    return pages;
  };

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      {/* Limit selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Tampil per halaman
        </span>
        <select
          value={limit}
          onChange={handleLimitChange}
          className="h-9 px-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none"
        >
          {LIMIT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination controls (shadcn style) */}
      <nav className="flex items-center gap-2" aria-label="Pagination">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFirst}
          disabled={page <= 1}
          aria-label="Halaman pertama"
        >
          <ChevronLeft className="h-4 w-4" />
          <ChevronLeft className="h-4 w-4 -ml-2" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={page <= 1}
          aria-label="Sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1">Prev</span>
        </Button>

        {/* Numbered pages */}
        <div className="flex items-center gap-1">
          {visiblePages.map((p, idx) => {
            if (p === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 h-9 inline-flex items-center text-muted-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }
            const isActive = p === page;
            return (
              <Button
                key={p}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={isActive ? "" : "bg-background"}
                onClick={() => updateParams({ page: p })}
                aria-current={isActive ? "page" : undefined}
              >
                {p}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={page >= totalPages}
          aria-label="Berikutnya"
        >
          <span className="mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLast}
          disabled={page >= totalPages}
          aria-label="Halaman terakhir"
        >
          <ChevronRight className="h-4 w-4" />
          <ChevronRight className="h-4 w-4 -ml-2" />
        </Button>

        {/* Quick page jump input */}
        {/* <div className="ml-3 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Halaman</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={page}
            onChange={handlePageInput}
            className="h-9 w-20 px-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none"
          />
          <span className="text-sm text-muted-foreground">dari {totalPages}</span>
        </div> */}
      </nav>
    </div>
  );
};

export default Pagination;
