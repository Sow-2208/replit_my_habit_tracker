import { HabitTracker } from "@/components/dashboard/HabitTracker";
import { CalendarView } from "@/components/dashboard/CalendarView";
import { ProgressCharts } from "@/components/dashboard/ProgressCharts";
import { MotivationSection } from "@/components/dashboard/MotivationSection";
import { JourneyPath } from "@/components/dashboard/JourneyPath";
import { StreakStats } from "@/components/dashboard/StreakStats";
import { ISTClock } from "@/components/dashboard/ISTClock";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import generatedImage from "@assets/generated_images/minimalist_student_desk_texture.png";

function getGreeting() {
  const hour = new Date().toLocaleString('en-US', { 
    timeZone: 'Asia/Kolkata', 
    hour: 'numeric', 
    hour12: false 
  });
  const h = parseInt(hour);
  if (h >= 5 && h < 12) return "Good Morning";
  if (h >= 12 && h < 17) return "Good Afternoon";
  if (h >= 17 && h < 21) return "Good Evening";
  return "Good Night";
}

export default function Dashboard() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      <nav className="h-16 border-b border-border/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">FocusFlow</span>
        </div>
        
        <div className="flex items-center gap-4">
          <ISTClock />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="rounded-full hover:bg-muted"
            data-testid="button-theme-toggle"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 border-2 border-background" />
        </div>
      </nav>

      <ScrollArea className="flex-1 w-full">
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
          
          <div className="relative rounded-3xl overflow-hidden bg-primary/5 min-h-[160px] p-6 md:p-8 flex flex-col justify-center">
             <div 
               className="absolute inset-0 opacity-10 dark:opacity-5 mix-blend-multiply pointer-events-none"
               style={{ 
                 backgroundImage: `url(${generatedImage})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}
             />
             
             <div className="relative z-10 max-w-2xl">
               <h1 className="text-2xl md:text-3xl font-heading font-bold mb-1" data-testid="greeting-text">
                 {greeting}, Scholar! 🎓
               </h1>
               <p className="text-muted-foreground text-base">
                 Small steps every day lead to big results. Let's keep that streak alive.
               </p>
             </div>
          </div>

          <StreakStats />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <HabitTracker />
              <ProgressCharts />
              <CalendarView />
            </div>

            <div className="space-y-6">
              <MotivationSection />
              <div className="p-5 rounded-2xl bg-secondary/30 border border-border/50">
                <h3 className="font-heading font-semibold mb-2 text-sm">Monthly Reflection</h3>
                <textarea 
                  className="w-full bg-transparent resize-none border-none focus:ring-0 text-sm p-0 placeholder:text-muted-foreground/70 focus:outline-none"
                  rows={4}
                  placeholder="What went well this month? What can I improve? Write your thoughts here..."
                  data-testid="textarea-reflection"
                />
              </div>
              <JourneyPath />
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
