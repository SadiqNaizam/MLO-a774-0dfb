import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // For combining class names if needed, though variant might be enough

interface CuisineCategoryChipProps {
  cuisineName: string;
  onClick: (cuisineName: string) => void;
  isActive?: boolean;
  className?: string; // Allow for additional custom styling
}

const CuisineCategoryChip: React.FC<CuisineCategoryChipProps> = ({
  cuisineName,
  onClick,
  isActive = false,
  className,
}) => {
  console.log(`CuisineCategoryChip loaded for: ${cuisineName}, isActive: ${isActive}`);

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      className={cn(
        "rounded-full h-8 px-4 text-sm transition-all duration-200 ease-in-out",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", // Accessibility
        isActive ? "shadow-md" : "hover:bg-accent hover:text-accent-foreground",
        className // Allow parent to pass additional classes
      )}
      onClick={() => onClick(cuisineName)}
      aria-pressed={isActive} // Accessibility for active state
    >
      {cuisineName}
    </Button>
  );
};

export default CuisineCategoryChip;