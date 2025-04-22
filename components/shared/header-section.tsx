interface HeaderSectionProps {
  label?: string;
  title: string;
  subtitle?: string;
}

export function HeaderSection({ label, title, subtitle }: HeaderSectionProps) {
  return (
    <div className="font-custom flex flex-col items-center text-center pt-[15%]">
      {label ? (
        <div className="text-gradient_indigo-purple mb-4">
          {label}
        </div>
      ) : null}
      <h2 className="font-custom text-2xl md:text-xl lg:text-xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-6 text-balance text-lg text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
