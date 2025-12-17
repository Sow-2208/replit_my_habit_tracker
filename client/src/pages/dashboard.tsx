import { HabitTracker } from "@/components/dashboard/HabitTracker";
import { CalendarView } from "@/components/dashboard/CalendarView";
import { ProgressCharts } from "@/components/dashboard/ProgressCharts";
import { MotivationSection } from "@/components/dashboard/MotivationSection";
import { JourneyPath } from "@/components/dashboard/JourneyPath";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LayoutDashboard, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import generatedImage from "@assets/generated_images/minimalist_student_desk_texture.png";

export default function Dashboard() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      {/* Navbar */}
      <nav className="h-16 border-b border-border/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">FocusFlow</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="rounded-full hover:bg-muted"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 border-2 border-background" />
        </div>
      </nav>

      {/* Main Content */}
      <ScrollArea className="flex-1 w-full">
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
          
          {/* Hero / Header Section */}
          <div className="relative rounded-3xl overflow-hidden bg-primary/5 min-h-[180px] p-6 md:p-10 flex flex-col justify-center">
             {/* Background Image Overlay */}
             <div 
               className="absolute inset-0 opacity-10 dark:opacity-5 mix-blend-multiply pointer-events-none"
               style={{ 
                 backgroundImage: `url(${generatedImage})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}
             />
             
             <div className="relative z-10 max-w-2xl">
               <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                 Good Morning, Scholar! 🎓
               </h1>
               <p className="text-muted-foreground text-lg">
                 Small steps every day lead to big results. Let's keep that streak alive.
               </p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Tracker */}
            <div className="lg:col-span-2 space-y-8">
              <HabitTracker />
              <CalendarView />
            </div>

            {/* Right Column - Stats & Motivation */}
            <div className="space-y-8">
              <MotivationSection />
              <ProgressCharts />
              <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50">
                <h3 className="font-heading font-semibold mb-2">Monthly Reflection</h3>
                <textarea 
                  className="w-full bg-transparent resize-none border-none focus:ring-0 text-sm p-0 placeholder:text-muted-foreground/70"
                  rows={4}
                  placeholder="What went well this month? What can I improve? Write your thoughts here..."
                />
              </div>
            </div>
          </div>

          {/* Bottom Section - Journey */}
          <div className="pt-4 pb-12">
            <JourneyPath />
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
