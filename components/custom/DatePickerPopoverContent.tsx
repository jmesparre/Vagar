"use client";

"use client";

import * as React from "react";
import { format, differenceInDays, parse } from "date-fns";
import { DateRange } from "react-day-picker";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { H3, Small } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";

interface DatePickerPopoverContentProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  onClose: () => void;
}

export const DatePickerPopoverContent: React.FC<DatePickerPopoverContentProps> = ({
  date,
  setDate,
  onClose,
}) => {
  const [fromValue, setFromValue] = React.useState<string>(
    date?.from ? format(date.from, "MM/dd/yyyy") : ""
  );
  const [toValue, setToValue] = React.useState<string>(
    date?.to ? format(date.to, "MM/dd/yyyy") : ""
  );

  React.useEffect(() => {
    setFromValue(date?.from ? format(date.from, "MM/dd/yyyy") : "");
    setToValue(date?.to ? format(date.to, "MM/dd/yyyy") : "");
  }, [date]);

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValue(e.target.value);
    const parsedDate = parse(e.target.value, "MM/dd/yyyy", new Date());
    if (!isNaN(parsedDate.getTime())) {
      setDate({ from: parsedDate, to: date?.to });
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToValue(e.target.value);
    const parsedDate = parse(e.target.value, "MM/dd/yyyy", new Date());
    if (!isNaN(parsedDate.getTime())) {
      setDate({ from: date?.from, to: parsedDate });
    }
  };

  const nights = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <H3>{nights > 0 ? `${nights} nights` : "Select dates"}</H3>
          <Small className="text-muted-foreground">
            {date?.from && date?.to
              ? `${format(date.from, "MMM d, yyyy")} - ${format(
                  date.to,
                  "MMM d, yyyy"
                )}`
              : "Add your travel dates for exact pricing"}
          </Small>
        </div>
        <div className="flex space-x-2">
            <div className="relative">
                <Input 
                    value={fromValue}
                    onChange={handleFromChange}
                    placeholder="MM/DD/YYYY"
                    className="pr-8"
                />
                {fromValue && <X className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer" onClick={() => setDate({ from: undefined, to: date?.to })} />}
            </div>
            <div className="relative">
                <Input 
                    value={toValue}
                    onChange={handleToChange}
                    placeholder="MM/DD/YYYY"
                    className="pr-8"
                />
                {toValue && <X className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer" onClick={() => setDate({ from: date?.from, to: undefined })} />}
            </div>
        </div>
      </div>
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        className="p-0"
      />
      <div className="flex justify-end items-center mt-4 space-x-2">
        <Button variant="link" onClick={() => setDate(undefined)}>
          Clear dates
        </Button>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};
