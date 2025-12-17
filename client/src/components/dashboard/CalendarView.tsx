import { useHabitStore } from "@/lib/habit-store";
import { format, startOfYear, eachDayOfInterval, endOfYear, getDay, isSameDay, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function CalendarView() {
  const { habits } = useHabitStore();
  const currentYear = new Date().getFullYear();
  const start = startOfYear(new Date());
  const end = endOfYear(new Date());
  
  const days = eachDayOfInterval({ start, end });

  // Calculate daily completion rate
  // Map: '2025-01-01' -> completion percentage (0-1)
  const activityMap = new Map<string, number>();

  days.forEach(day => {
    const dateStr = format(day, "yyyy-MM-dd");
    let completedCount = 0;
    if (habits.length === 0) {
      activityMap.set(dateStr, 0);
      return;
    }
    
    habits.forEach(habit => {
      if (habit.completedDates.includes(dateStr)) {
        completedCount++;
      }
    });
    
    activityMap.set(dateStr, completedCount / habits.length);
  });

  // Helper to get color based on intensity
  const getColor = (intensity: number) => {
    if (intensity === 0) return "bg-muted/40"; // No activity
    if (intensity <= 0.25) return "bg-primary/30"; // Low
    if (intensity <= 0.5) return "bg-primary/50"; // Medium
    if (intensity <= 0.75) return "bg-primary/75"; // High
    return "bg-primary"; // Perfect
  };

  // Group by months for display
  const months = Array.from({ length: 12 }, (_, i) => {
    return days.filter(d => d.getMonth() === i);
  });

  return (
    <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-heading">Yearly Consistency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[800px]">
             {months.map((monthDays, monthIdx) => (
               <div key={monthIdx} className="flex flex-col gap-1">
                 <span className="text-[10px] font-medium text-muted-foreground mb-2">
                   {format(new Date(currentYear, monthIdx), "MMM")}
                 </span>
                 <div className="grid grid-rows-7 grid-flow-col gap-1">
                   {/* Pad beginning of month to align with weekdays */}
                   {Array.from({ length: getDay(monthDays[0]) }).map((_, i) => (
                     <div key={`empty-${i}`} className="w-2.5 h-2.5" />
                   ))}
                   
                   {monthDays.map(day => {
                     const dateStr = format(day, "yyyy-MM-dd");
                     const intensity = activityMap.get(dateStr) || 0;
                     const isToday = isSameDay(day, new Date());
                     
                     return (
                       <TooltipProvider key={dateStr}>
                         <Tooltip delayDuration={100}>
                           <TooltipTrigger asChild>
                             <div 
                               className={cn(
                                 "w-2.5 h-2.5 rounded-[2px] transition-colors cursor-default",
                                 getColor(intensity),
                                 isToday && "ring-1 ring-offset-1 ring-foreground"
                               )} 
                             />
                           </TooltipTrigger>
                           <TooltipContent className="text-xs">
                             {format(day, "MMM d, yyyy")}: {Math.round(intensity * 100)}%
                           </TooltipContent>
                         </Tooltip>
                       </TooltipProvider>
                     );
                   })}
                 </div>
               </div>
             ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4 justify-end">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-muted/40" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-primary/30" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-primary/50" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-primary/75" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-primary" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
