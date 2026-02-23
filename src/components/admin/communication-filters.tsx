'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Search, X } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

interface CommunicationFiltersProps {
  onSearch: (value: string) => void;
  onDateChange: (range: DateRange | undefined) => void;
  onExport?: () => void;
}

export function CommunicationFilters({ onSearch, onDateChange, onExport }: CommunicationFiltersProps) {
  const [searchValue, setSearchValue] = useState('');
  const [date, setDate] = useState<DateRange | undefined>();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearch(val);
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range);
    onDateChange(range);
  };

  const clearFilters = () => {
    setSearchValue('');
    setDate(undefined);
    onSearch('');
    onDateChange(undefined);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6 bg-muted/30 p-4 rounded-2xl border border-border/50">
      {/* Search */}
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, subject..."
          value={searchValue}
          onChange={handleSearchChange}
          className="pl-10 rounded-xl bg-background border-border/50 h-10"
        />
      </div>

      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full md:w-[260px] justify-start text-left font-normal rounded-xl h-10 bg-background border-border/50",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-full md:w-auto ml-auto">
        {(searchValue || date) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10 rounded-xl px-4 gap-2">
            <X className="h-4 w-4" /> Clear
          </Button>
        )}
        
        {onExport && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onExport}
            className="h-10 rounded-xl px-4 border-primary text-primary hover:bg-primary/5 font-bold"
          >
            Export to CSV
          </Button>
        )}
      </div>
    </div>
  );
}
