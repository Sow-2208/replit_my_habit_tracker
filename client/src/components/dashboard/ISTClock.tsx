import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function ISTClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const istTime = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(time);

  const istDate = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(time);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <div className="flex flex-col items-end leading-tight">
        <span className="font-medium text-foreground" data-testid="ist-time">{istTime}</span>
        <span className="text-[10px]">{istDate} IST</span>
      </div>
    </div>
  );
}
