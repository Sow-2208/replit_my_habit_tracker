import { useState } from "react";
import { useHabitStore } from "@/lib/habit-store";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { Check, Plus, Trash2, Trophy, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export function HabitTracker() {
  const { habits, toggleHabit, addHabit, deleteHabit } = useHabitStore();
  const [newHabitName, setNewHabitName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleToggle = (habitId: string, date: Date) => {
    toggleHabit(habitId, date);
    
    // Check if all habits for today are completed for confetti
    // This runs before the state update finishes, so we check if (completed + 1) == total
    // But simplified: just trigger small confetti on every completion
    if (!habits.find(h => h.id === habitId)?.completedDates.includes(format(date, 'yyyy-MM-dd'))) {
       confetti({
         particleCount: 30,
         spread: 60,
         origin: { y: 0.7 },
         colors: ['#88B04B', '#92A8D1', '#F7CAC9']
       });
    }
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      addHabit(newHabitName, "other");
      setNewHabitName("");
      setIsAdding(false);
    }
  };

  return (
    <Card className="w-full border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-heading text-primary">Daily Habits</CardTitle>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 gap-1 rounded-full text-xs font-medium border-primary/20 text-primary hover:bg-primary/10"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="h-3 w-3" /> New Habit
        </Button>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <form onSubmit={handleAddHabit} className="mb-4 flex gap-2 animate-in slide-in-from-top-2 fade-in">
            <Input 
              placeholder="What do you want to achieve?" 
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="h-9 text-sm"
              autoFocus
            />
            <Button type="submit" size="sm" className="h-9">Add</Button>
          </form>
        )}

        <div className="space-y-4">
          {/* Week Header - Hidden on mobile, shown on desktop */}
          <div className="hidden md:grid grid-cols-[2fr_repeat(7,1fr)_40px] gap-2 mb-2 text-xs font-medium text-muted-foreground text-center">
            <div className="text-left pl-2">Habit</div>
            {weekDays.map(day => (
              <div key={day.toString()} className={cn(
                "py-1 rounded-md",
                isSameDay(day, today) && "bg-primary/10 text-primary font-bold"
              )}>
                {format(day, "EEE")}
              </div>
            ))}
            <div></div>
          </div>

          {habits.map(habit => (
            <div key={habit.id} className="group relative bg-card hover:bg-white dark:hover:bg-slate-800 transition-colors rounded-xl border border-border/50 p-3 shadow-sm hover:shadow-md">
              <div className="md:hidden flex justify-between items-center mb-3">
                <span className="font-medium text-sm">{habit.name}</span>
                <div className="flex gap-2">
                   {habit.streak > 0 && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px] gap-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                      <Flame className="h-3 w-3 fill-orange-500 text-orange-500" />
                      {habit.streak}
                    </Badge>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteHabit(habit.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 md:grid-cols-[2fr_repeat(7,1fr)_40px] gap-2 items-center">
                <div className="hidden md:flex items-center gap-2 min-w-0">
                  <span className="truncate font-medium text-sm text-foreground/80">{habit.name}</span>
                  {habit.streak > 0 && (
                    <div className="flex items-center text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded-full">
                      <Flame className="h-3 w-3 mr-0.5 fill-orange-500" />
                      {habit.streak}
                    </div>
                  )}
                </div>

                {weekDays.map(day => {
                  const isCompleted = habit.completedDates.includes(format(day, "yyyy-MM-dd"));
                  const isToday = isSameDay(day, today);
                  return (
                    <div key={day.toString()} className="flex flex-col items-center justify-center">
                      <span className="md:hidden text-[10px] text-muted-foreground mb-1">{format(day, "EEE")}</span>
                      <button
                        onClick={() => handleToggle(habit.id, day)}
                        className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 border",
                          isCompleted 
                            ? "bg-primary text-primary-foreground border-primary shadow-[0_2px_8px_-2px_rgba(34,197,94,0.4)]" 
                            : "bg-muted/30 border-transparent hover:bg-muted text-transparent hover:border-border",
                          isToday && !isCompleted && "ring-2 ring-primary/20 border-primary/40"
                        )}
                      >
                        <Check className={cn("h-4 w-4 stroke-[3]", isCompleted ? "opacity-100 scale-100" : "opacity-0 scale-50")} />
                      </button>
                    </div>
                  );
                })}

                <div className="hidden md:flex justify-end">
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteHabit(habit.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {habits.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-2">No habits tracked yet.</p>
              <Button variant="outline" onClick={() => setIsAdding(true)}>Create your first habit</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
