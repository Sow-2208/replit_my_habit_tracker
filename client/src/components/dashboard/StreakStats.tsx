import { useHabits } from "@/lib/habit-store";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Trophy, Target, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function StreakStats() {
  const { data: habits = [] } = useHabits();
  
  const today = format(new Date(), "yyyy-MM-dd");
  
  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const totalHabits = habits.length;
  const todayPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  
  const currentStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.longestStreak)) : 0;
  
  const allCompletedToday = totalHabits > 0 && completedToday === totalHabits;

  const stats = [
    {
      label: "Today's Progress",
      value: `${completedToday}/${totalHabits}`,
      subtext: `${todayPercentage}% complete`,
      icon: Target,
      color: allCompletedToday ? "text-green-500" : "text-blue-500",
      bgColor: allCompletedToday ? "bg-green-500/10" : "bg-blue-500/10",
    },
    {
      label: "Current Streak",
      value: currentStreak,
      subtext: "days",
      icon: Flame,
      color: currentStreak > 0 ? "text-orange-500" : "text-muted-foreground",
      bgColor: currentStreak > 0 ? "bg-orange-500/10" : "bg-muted/30",
    },
    {
      label: "Best Streak",
      value: longestStreak,
      subtext: "days",
      icon: Trophy,
      color: longestStreak > 0 ? "text-amber-500" : "text-muted-foreground",
      bgColor: longestStreak > 0 ? "bg-amber-500/10" : "bg-muted/30",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, i) => (
        <Card 
          key={i} 
          className={cn(
            "border-none shadow-sm transition-all duration-300",
            stat.bgColor,
            allCompletedToday && i === 0 && "ring-2 ring-green-500/50 animate-pulse"
          )}
        >
          <CardContent className="p-4 flex flex-col items-center text-center">
            <stat.icon className={cn("h-6 w-6 mb-2", stat.color)} />
            <span className={cn("text-2xl font-bold font-heading", stat.color)} data-testid={`stat-value-${i}`}>
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground">{stat.subtext}</span>
            <span className="text-[10px] text-muted-foreground/70 mt-1">{stat.label}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
