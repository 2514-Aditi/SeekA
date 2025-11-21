import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-primary text-primary-foreground rounded-md p-2 w-8 h-8 flex items-center justify-center">
        <span className="font-headline font-bold text-lg">S</span>
      </div>
      <h1 className="text-2xl font-headline font-bold text-foreground">
        SeekA
      </h1>
    </div>
  );
}
