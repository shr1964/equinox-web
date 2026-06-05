import { Button } from "@/components/atoms/button";
import type { ButtonProps } from "@/components/atoms/button";

const CAL_URL = "https://app.cal.eu/equinox/15min?overlayCalendar=true&layout=month_view";

type PrimaryCTAButtonProps = {
  children: React.ReactNode;
  className?: string;
  withArrow?: boolean;

  
};

export function PrimaryCTAButton({ children, className, withArrow = true }: PrimaryCTAButtonProps) {
  return (
    <Button
      href={CAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      variant="primary"
      withArrow={withArrow}
      className={className}
    >
      {children}
    </Button>
  );
}
