import { useHabitStore } from "@/lib/habit-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function MotivationSection() {
  const { motivations } = useHabitStore();
  const [currentQuote, setCurrentQuote] = useState(motivations[0]);

  // Rotate quotes randomly on mount or click
  useEffect(() => {
    const random = motivations[Math.floor(Math.random() * motivations.length)];
    setCurrentQuote(random);
  }, []);

  const nextQuote = () => {
    const random = motivations[Math.floor(Math.random() * motivations.length)];
    setCurrentQuote(random);
  };

  return (
    <Card className="bg-gradient-to-br from-accent/20 to-secondary/20 border-none shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Quote className="h-24 w-24 text-primary" />
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-heading">
          <Sparkles className="h-4 w-4 text-orange-400" />
          Daily Inspiration
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="min-h-[100px] flex flex-col justify-center">
          <p className="text-xl md:text-2xl font-hand leading-relaxed text-foreground/90">
            "{currentQuote.text}"
          </p>
          {currentQuote.author && (
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              — {currentQuote.author}
            </p>
          )}
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground hover:text-primary"
            onClick={nextQuote}
          >
            New Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
