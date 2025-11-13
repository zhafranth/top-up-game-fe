import * as React from "react";
import { Card } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type StatusValue =
  | "pending"
  | "processing"
  | "success"
  | "failed"
  | string;

export interface FilterProps {
  className?: string;
  showStatus?: boolean; // tampilkan dropdown status
  showDateTimeRange?: boolean; // tampilkan date range + time
  statusOptions?: { label: string; value: StatusValue }[]; // opsi status
  defaultStatus?: StatusValue | "all"; // default status saat tidak ada query
  // Callback saat filter berubah (setelah query params di-update)
  onFiltersChange?: (filters: {
    status?: StatusValue;
    start?: Date;
    end?: Date;
  }) => void;
}

// Nama query param yang digunakan
const STATUS_PARAM = "status";
const START_PARAM = "start"; // format: yyyy-MM-dd'T'HH:mm
const END_PARAM = "end"; // format: yyyy-MM-dd'T'HH:mm

// Helper: parse string "yyyy-MM-dd'T'HH:mm" menjadi Date
function parseDateTimeString(s?: string): { date?: Date; time?: string } {
  if (!s) return {};
  const dt = new Date(s);
  // Jika dt invalid, coba parsing manual
  if (isNaN(dt.getTime())) {
    // format lokal tanpa zona: yyyy-MM-dd'T'HH:mm
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
    if (!m) return {};
    const year = Number(m[1]);
    const monthIndex = Number(m[2]) - 1;
    const day = Number(m[3]);
    const hh = Number(m[4]);
    const mm = Number(m[5]);
    const d = new Date();
    d.setFullYear(year, monthIndex, day);
    d.setHours(hh);
    d.setMinutes(mm);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return {
      date: d,
      time: `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`,
    };
  }
  // to keep local HH:mm for the time input
  const timeStr = `${String(dt.getHours()).padStart(2, "0")}:${String(
    dt.getMinutes()
  ).padStart(2, "0")}`;
  return { date: dt, time: timeStr };
}

// Helper: gabungkan tanggal + waktu menjadi Date
function combineDateTime(date?: Date, time?: string): Date | undefined {
  if (!date) return undefined;
  if (!time) return date;
  const [hh, mm] = time.split(":").map((s) => parseInt(s, 10));
  const d = new Date(date);
  if (!Number.isNaN(hh)) d.setHours(hh);
  if (!Number.isNaN(mm)) d.setMinutes(mm);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}

export function Filter({
  className,
  showStatus = true,
  showDateTimeRange = true,
  statusOptions = [
    { label: "Semua", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Success", value: "success" },
    { label: "Failed", value: "failed" },
  ],
  defaultStatus = "all",
  onFiltersChange,
}: FilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // State internal
  const [status, setStatus] = React.useState<StatusValue | "all">(
    defaultStatus
  );
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();
  const [startTime, setStartTime] = React.useState<string | undefined>(); // HH:mm
  const [endTime, setEndTime] = React.useState<string | undefined>(); // HH:mm

  // Inisialisasi dari query params saat mount / saat URL berubah
  React.useEffect(() => {
    const qStatus = searchParams.get(STATUS_PARAM) ?? undefined;
    const qStart = searchParams.get(START_PARAM) ?? undefined;
    const qEnd = searchParams.get(END_PARAM) ?? undefined;

    setStatus((qStatus as StatusValue) || defaultStatus);

    const { date: sDate, time: sTime } = parseDateTimeString(
      qStart || undefined
    );
    const { date: eDate, time: eTime } = parseDateTimeString(qEnd || undefined);

    setStartDate(sDate);
    setEndDate(eDate);
    setStartTime(sTime);
    setEndTime(eTime);
  }, [searchParams]);

  // Update query params helper
  const updateQueryParams = React.useCallback(
    (
      next: Partial<{ status?: StatusValue | "all"; start?: Date; end?: Date }>
    ) => {
      const params = new URLSearchParams(searchParams.toString());
      // console.log("next", next);

      // Status
      if (showStatus && typeof next.status !== "undefined") {
        if (next.status === "all" || next.status === "") {
          params.delete(STATUS_PARAM);
        } else {
          params.set(STATUS_PARAM, String(next.status));
        }
      }

      // Start (selalu update jika disediakan)

      if (next.start !== undefined) {
        if (!next.start) {
          params.delete(START_PARAM);
        } else {
          params.set(START_PARAM, format(next.start, "yyyy-MM-dd'T'HH:mm"));
        }
      }

      // End (selalu update jika disediakan)
      if (next.end !== undefined) {
        if (!next.end) {
          params.delete(END_PARAM);
        } else {
          params.set(END_PARAM, format(next.end, "yyyy-MM-dd'T'HH:mm"));
        }
      }

      setSearchParams(params);

      onFiltersChange?.({
        status: params.get(STATUS_PARAM) || undefined,
        start: params.get(START_PARAM)
          ? new Date(params.get(START_PARAM)!)
          : undefined,
        end: params.get(END_PARAM)
          ? new Date(params.get(END_PARAM)!)
          : undefined,
      });
    },
    [searchParams, setSearchParams, onFiltersChange, showStatus]
  );

  // Handlers
  const handleStatusChange = (value: StatusValue | "all") => {
    setStatus(value);
    updateQueryParams({ status: value });
  };

  const handleStartDateChange = (date?: Date) => {
    setStartDate(date);
    const merged = combineDateTime(date, startTime);
    updateQueryParams({ start: merged });
  };

  const handleEndDateChange = (date?: Date) => {
    setEndDate(date);
    const merged = combineDateTime(date, endTime);
    // console.log("merged", merged);
    // console.log("date", date);
    updateQueryParams({ end: merged });
  };

  const resetDate = () => {
    // setStatus(defaultStatus);
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime(undefined);
    setEndTime(undefined);

    const params = new URLSearchParams(searchParams.toString());
    // params.delete(STATUS_PARAM);
    params.delete(START_PARAM);
    params.delete(END_PARAM);
    setSearchParams(params);
    onFiltersChange?.({});
  };
  // const resetFilters = () => {
  //   setStatus(defaultStatus);
  //   setStartDate(undefined);
  //   setEndDate(undefined);
  //   setStartTime(undefined);
  //   setEndTime(undefined);

  //   const params = new URLSearchParams(searchParams.toString());
  //   params.delete(STATUS_PARAM);
  //   params.delete(START_PARAM);
  //   params.delete(END_PARAM);
  //   setSearchParams(params);
  //   onFiltersChange?.({});
  // };

  return (
    <Card className={cn("p-6 mb-6", className)}>
      <div className={cn("flex gap-4")}>
        <div className="flex-1">
          <p className="mb-2">
            {/* <FilterIcon className="h-4 w-4 text-muted-foreground" /> */}
            {showDateTimeRange ? "Filter Tanggal & Waktu" : "Filter Tanggal"}
          </p>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            startPlaceholder="Tanggal mulai"
            endPlaceholder="Tanggal akhir"
            onClear={resetDate}
          />
        </div>

        {showStatus && (
          <div className="flex-1">
            <p className="mb-2">Status</p>
            <select
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={status}
              onChange={(e) =>
                handleStatusChange(e.target.value as StatusValue | "all")
              }
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* <div className="mt-6 flex-1 flex-col gap-3 justify-end">
        <Button variant="outline" onClick={resetFilters}>
          Reset Filter
        </Button>
      </div> */}
    </Card>
  );
}

export default Filter;
