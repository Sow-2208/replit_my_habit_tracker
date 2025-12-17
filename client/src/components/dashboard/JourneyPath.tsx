import { CheckCircle2, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  { id: 1, title: "Start", description: "Day 1", unlocked: true },
  { id: 2, title: "Building", description: "7 Day Streak", unlocked: true },
  { id: 3, title: "Consistent", description: "30 Day Streak", unlocked: false },
  { id: 4, title: "Mastery", description: "100 Day Streak", unlocked: false },
  { id: 5, title: "Lifestyle", description: "365 Days", unlocked: false },
];

export function JourneyPath() {
  return (
    <div className="w-full py-6">
      <h3 className="text-lg font-heading font-semibold mb-4 px-1">Your Journey</h3>
      
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full z-0" />
        
        <div className="relative z-10 flex justify-between items-center px-2">
          {STAGES.map((stage, i) => (
            <div key={stage.id} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300",
                stage.unlocked 
                  ? "bg-white border-primary text-primary shadow-sm scale-110" 
                  : "bg-muted border-muted-foreground/30 text-muted-foreground/50"
              )}>
                {stage.unlocked ? <CheckCircle2 className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
              </div>
              <div className="text-center hidden md:block">
                <p className={cn("text-xs font-bold", stage.unlocked ? "text-primary" : "text-muted-foreground")}>{stage.title}</p>
                <p className="text-[10px] text-muted-foreground">{stage.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
