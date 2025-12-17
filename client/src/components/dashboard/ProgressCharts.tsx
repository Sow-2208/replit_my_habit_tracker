import { useHabitStore } from "@/lib/habit-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { subDays, format } from "date-fns";

export function ProgressCharts() {
  const { habits } = useHabitStore();

  // Generate last 30 days data
  const data = Array.from({ length: 14 }).map((_, i) => {
    const date = subDays(new Date(), 13 - i); // Last 14 days (2 weeks)
    const dateStr = format(date, "yyyy-MM-dd");
    
    let completedCount = 0;
    if (habits.length > 0) {
      habits.forEach(h => {
        if (h.completedDates.includes(dateStr)) completedCount++;
      });
    }

    const percentage = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
    
    return {
      date: format(date, "MMM dd"),
      percentage,
      completed: completedCount
    };
  });

  return (
    <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-heading">Performance Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPerc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} 
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} 
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
              />
              <Area 
                type="monotone" 
                dataKey="percentage" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPerc)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
