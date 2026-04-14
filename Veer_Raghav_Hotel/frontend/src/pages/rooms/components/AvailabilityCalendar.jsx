import React, { useEffect, useState } from 'react';
import { format, differenceInDays, isBefore, isToday, addDays, startOfDay } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

const AvailabilityCalendar = ({
  date,
  onDateSelect,
  availabilityData,
  maxGuests,
  selectedGuests,
  className
}) => {
  const [dateError, setDateError] = useState('');
  const [numberOfMonths, setNumberOfMonths] = useState(2);
  const [calendarWidth, setCalendarWidth] = useState('auto');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setNumberOfMonths(1);
        setCalendarWidth('100%');
      } else if (window.innerWidth < 1024) {
        setNumberOfMonths(1);
        setCalendarWidth('auto');
      } else {
        setNumberOfMonths(2);
        setCalendarWidth('auto');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getAvailabilityForDate = (date) => {
    if (!availabilityData || !date) return null;
    const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
    return availabilityData.find(day => day.date === dateStr)?.availableSlots || 0;
  };

  const isValidDateRange = (dateRange) => {
    if (!dateRange || !dateRange.from || !dateRange.to) return false;
    const today = startOfDay(new Date());

    try {
      if (!(dateRange.from instanceof Date) || !(dateRange.to instanceof Date)) return false;
      if (isNaN(dateRange.from.getTime()) || isNaN(dateRange.to.getTime())) return false;
      if (isBefore(dateRange.from, today) && !isToday(dateRange.from)) return false;
      if (!isBefore(dateRange.from, dateRange.to)) return false;

      // Check if either the start or end date has 0 slots
      const fromSlots = getAvailabilityForDate(dateRange.from);
      const toSlots = getAvailabilityForDate(dateRange.to);
      if (fromSlots === 0 || toSlots === 0) return false;

      const maxBookingDate = addDays(today, 365);
      if (isBefore(maxBookingDate, dateRange.to)) return false;

      const nights = differenceInDays(dateRange.to, dateRange.from);
      if (nights < 1) return false;

      return true;
    } catch (error) {
      console.error('Error validating date range:', error);
      return false;
    }
  };

  const formatDateRange = (dateRange) => {
    try {
      if (!dateRange || !dateRange.from || !dateRange.to) {
        return "Select your dates";
      }
      return `${format(startOfDay(dateRange.from), "EEE, MMM d, yyyy")} - ${format(startOfDay(dateRange.to), "EEE, MMM d, yyyy")}`;
    } catch (error) {
      console.error('Error formatting date range:', error);
      return "Select your dates";
    }
  };

  const calculateNights = (dateRange) => {
    try {
      if (!isValidDateRange(dateRange)) return 0;
      return differenceInDays(dateRange.to, dateRange.from);
    } catch (error) {
      console.error('Error calculating nights:', error);
      return 0;
    }
  };

  const getMinSlotsInRange = (fromDate, toDate) => {
    if (!fromDate || !toDate) return null;

    let currentDate = startOfDay(fromDate);
    let minSlots = Infinity;

    while (currentDate <= toDate) {
      const slots = getAvailabilityForDate(currentDate);
      if (slots !== null) {
        minSlots = Math.min(minSlots, slots);
      }
      currentDate = addDays(currentDate, 1);
    }

    return minSlots === Infinity ? null : minSlots;
  };

  const getDateRangeError = (dateRange) => {
    if (!dateRange || !dateRange.from || !dateRange.to) return '';

    const today = startOfDay(new Date());

    try {
      if (isBefore(dateRange.from, today) && !isToday(dateRange.from)) {
        return 'Check-in date cannot be in the past';
      }
      if (!isBefore(dateRange.from, dateRange.to)) {
        return 'Check-out date must be after check-in date';
      }

      // Check for sold out dates
      const fromSlots = getAvailabilityForDate(dateRange.from);
      const toSlots = getAvailabilityForDate(dateRange.to);
      if (fromSlots === 0) {
        return 'Check-in date is sold out';
      }
      if (toSlots === 0) {
        return 'Check-out date is sold out';
      }

      const nights = differenceInDays(dateRange.to, dateRange.from);
      if (nights < 1) {
        return 'Minimum stay is 1 night';
      }
      const maxBookingDate = addDays(today, 365);
      if (isBefore(maxBookingDate, dateRange.to)) {
        return 'Cannot book more than 1 year in advance';
      }

      const minSlots = getMinSlotsInRange(dateRange.from, dateRange.to);
      const requiredRooms = Math.ceil(selectedGuests / maxGuests);
      if (minSlots !== null && requiredRooms > minSlots) {
        return `Only ${minSlots} rooms available for the selected dates`;
      }

      return '';
    } catch (error) {
      console.error('Error getting date range error:', error);
      return 'Invalid date selection';
    }
  };

  const handleDateSelect = (newDate) => {
    if (!newDate) {
      onDateSelect({
        from: null,
        to: null,
        selecting: false
      });
      setDateError('');
      return;
    }

    // Check if selected date is sold out
    if (newDate.from) {
      const fromSlots = getAvailabilityForDate(newDate.from);
      if (fromSlots === 0) {
        setDateError('Cannot select sold out dates');
        return;
      }
    }

    if (!newDate.to) {
      onDateSelect({
        from: startOfDay(newDate.from),
        to: undefined,
        selecting: true
      });
      return;
    }

    const dateRange = {
      from: startOfDay(newDate.from),
      to: startOfDay(newDate.to),
      selecting: false
    }

    const error = getDateRangeError(dateRange);
    if (error) {
      setDateError(error);
      // Reset selection if there's an error
      onDateSelect({
        from: null,
        to: null,
        selecting: false
      });
    } else {
      setDateError('');
      onDateSelect(dateRange);
    }
  };

  return (
    <div className={cn("space-y-2 w-full", className)}>
    <label className="block text-sm font-medium text-gray-700">
      Select Stay Dates
    </label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal truncate",
            !isValidDateRange(date) && "text-muted-foreground"
          )}
        >
          {formatDateRange(date)}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 w-screen max-w-screen-md md:w-auto" 
        align="start"
        sideOffset={4}
      >
        <div className="p-3 border-b">
          <div className="flex flex-wrap justify-center md:justify-evenly items-center gap-2 text-xs md:text-sm">
            <span className="flex items-center">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 border rounded mr-1"></div>
              Available
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 border rounded mr-1"></div>
              Limited
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 border rounded mr-1"></div>
              Critical
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-100 border rounded mr-1"></div>
              Sold out
            </span>
          </div>
        </div>
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from ? startOfDay(date.from) : startOfDay(new Date())}
          selected={{
            from: date?.from ? startOfDay(date.from) : undefined,
            to: date?.to ? startOfDay(date.to) : undefined
          }}
          onSelect={handleDateSelect}
          numberOfMonths={numberOfMonths}
          disabled={(date) => {
            if (!date) return true;
            const today = startOfDay(new Date());
            const slots = getAvailabilityForDate(date);
            return isBefore(date, today) || slots === 0;
          }}
          className={cn("rounded-md border", calendarWidth === '100%' ? 'w-full' : '')}
          modifiers={{
            available: (date) => {
              const slots = getAvailabilityForDate(date);
              return slots >= 6;
            },
            limited: (date) => {
              const slots = getAvailabilityForDate(date);
              return slots >= 3 && slots < 6;
            },
            critical: (date) => {
              const slots = getAvailabilityForDate(date);
              return slots > 0 && slots < 3;
            },
            soldOut: (date) => {
              const slots = getAvailabilityForDate(date);
              return slots === 0;
            }
          }}
          modifiersClassNames={{
            available: "bg-green-200 hover:bg-green-300",
            limited: "bg-yellow-200 hover:bg-yellow-300",
            critical: "bg-red-200 hover:bg-red-300",
            soldOut: "bg-gray-100"
          }}
        />
      </PopoverContent>
    </Popover>

    {dateError && (
      <div className="text-red-500 text-sm flex items-center">
        <AlertCircle className="mr-2 h-4 w-4" />
        {dateError}
      </div>
    )}

    {calculateNights(date) > 0 && (
      <p className="text-sm text-muted-foreground">
        You have selected {calculateNights(date)} nights
      </p>
    )}
  </div>
);
};

export default AvailabilityCalendar;