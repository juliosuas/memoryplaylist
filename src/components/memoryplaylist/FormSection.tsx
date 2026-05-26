import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  subtitle?: string;
  step?: number;
  children: React.ReactNode;
  className?: string;
}

export const FormSection = ({
  title,
  subtitle,
  step,
  children,
  className,
}: FormSectionProps) => {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-start gap-3">
        {step !== undefined && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
            {step}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className={step !== undefined ? "pl-11" : ""}>{children}</div>
    </section>
  );
};
