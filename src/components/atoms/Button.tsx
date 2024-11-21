import { Button as ShadcnButton } from "@/components/ui/button";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = ({ children, className, variant = "default", size = "default", ...props }: ButtonProps) => {
  return (
    <ShadcnButton
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
};