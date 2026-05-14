import logoApp from "@/assets/logoApp.png";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  className?: string;
}

export function AppLogo({ className }: AppLogoProps) {
  return (
    <img
      src={logoApp}
      alt="MyTopic"
      className={cn("h-10 w-auto object-contain", className)}
    />
  );
}
