import * as React from "react";
import { CalendarIcon, MoveRight, XCircle } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./input";

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange?: (date: Date | undefined) => void;
  onEndDateChange?: (date: Date | undefined) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
  className?: string;
  showTime?: boolean;
  onClear?: () => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startPlaceholder = "Pilih tanggal mulai",
  endPlaceholder = "Pilih tanggal akhir",
  className,
  showTime = true,
  onClear,
}: DateRangePickerProps) {
  const [startOpen, setStartOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);

  // Local states to manage date selection before time is chosen
  const [startSelectedDate, setStartSelectedDate] = React.useState<
    Date | undefined
  >(undefined);
  const [endSelectedDate, setEndSelectedDate] = React.useState<
    Date | undefined
  >(undefined);
  const [startTime, setStartTime] = React.useState<string>("00:00:00");
  const [endTime, setEndTime] = React.useState<string>("00:00:00");

  const normalizeTime = (val: string) => (val.length === 5 ? `${val}:00` : val);
  const combineDateAndTime = (date: Date, timeStr: string) => {
    const [h = "00", m = "00", s = "00"] = timeStr.split(":");
    const hours = parseInt(h, 10) || 0;
    const minutes = parseInt(m, 10) || 0;
    const seconds = parseInt(s, 10) || 0;
    const result = new Date(date);
    result.setHours(hours, minutes, seconds, 0);
    return result;
  };

  React.useEffect(() => {
    if (startOpen) {
      const d = startSelectedDate ?? startDate;
      setStartTime(d ? format(d, "HH:mm:ss") : "00:00:00");
    }
  }, [startOpen]);

  React.useEffect(() => {
    if (endOpen) {
      const d = endSelectedDate ?? endDate;
      setEndTime(d ? format(d, "HH:mm:ss") : "00:00:00");
    }
  }, [endOpen]);

  return (
    <div
      className={cn(
        "flex gap-4 w-full rounded-md border border-border bg-slate-900 px-3 py-2 text-sm items-center",
        className
      )}
    >
      <div className="flex-1">
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger asChild>
            <button
              // variant={"outline"}
              className={cn(
                "flex w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(startDate, "dd-MM-yy HH:mm:ss")
              ) : (
                <span>{startPlaceholder}</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startSelectedDate ?? startDate}
              onSelect={(date) => {
                if (!date) {
                  onStartDateChange?.(undefined);
                  return;
                }
                if (showTime) {
                  setStartSelectedDate(date);
                  // Keep popover open until time is set
                } else {
                  const final = combineDateAndTime(date, "00:00:00");
                  onStartDateChange?.(final);
                  setStartOpen(false);
                  if (!endDate) setEndOpen(true);
                }
              }}
              initialFocus
            />
            {showTime && (
              <div className="p-3 border-t">
                <Input
                  type="time"
                  step={1}
                  value={startTime}
                  onChange={(e) => {
                    const val = normalizeTime(e.target.value);
                    console.log("startTime", val);
                    setStartTime(val);
                    const baseDate = startSelectedDate ?? startDate;
                    if (baseDate) {
                      const final = combineDateAndTime(baseDate, val);
                      onStartDateChange?.(final);
                    }
                  }}
                />
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
      <MoveRight size={14} />
      <div className="flex-1">
        <Popover open={endOpen} onOpenChange={setEndOpen}>
          <PopoverTrigger asChild>
            <button
              // variant={"outline"}
              className={cn(
                "flex w-full justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? (
                format(endDate, "dd-MM-yy HH:mm:ss")
              ) : (
                <span>{endPlaceholder}</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endSelectedDate ?? endDate}
              onSelect={(date) => {
                if (!date) {
                  onEndDateChange?.(undefined);
                  return;
                }
                if (showTime) {
                  setEndSelectedDate(date);
                  // Keep popover open until time is set
                } else {
                  const final = combineDateAndTime(date, "00:00:00");
                  onEndDateChange?.(final);
                  setEndOpen(false);
                }
              }}
              initialFocus
            />
            {showTime && (
              <div className="p-3 border-t">
                <Input
                  type="time"
                  step={1}
                  value={endTime}
                  onChange={(e) => {
                    const val = normalizeTime(e.target.value);
                    setEndTime(val);
                    const baseDate = endSelectedDate ?? endDate;
                    if (baseDate) {
                      const final = combineDateAndTime(baseDate, val);
                      console.log("final", final);
                      onEndDateChange?.(final);
                    }
                  }}
                />
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
      <button
        onClick={() => {
          onClear?.();
        }}
        className="text-muted-foreground"
      >
        <XCircle size={14} />
      </button>
    </div>
  );
}
