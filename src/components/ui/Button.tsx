"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import type { ButtonProps } from "@/types";
import { cn } from "@/utils/cn";

/* ── Variant styles ──────────────────────────────────────── */
const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg " +
    "hover:from-violet-500 hover:to-pink-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] " +
    "active:scale-95 border-0",
  secondary:
    "glass text-white hover:bg-white/10 border border-white/10 " +
    "hover:border-white/20 hover:shadow-[0_0_20px_rgba(124,58,237,0.2)]",
  ghost:
    "bg-transparent text-white/80 hover:text-white hover:bg-white/8 border-0",
  danger:
    "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg " +
    "hover:from-red-500 hover:to-rose-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] " +
    "border-0",
  outline:
    "bg-transparent border border-violet-500/50 text-violet-300 " +
    "hover:bg-violet-500/10 hover:border-violet-400 hover:text-violet-200",
};

/* ── Size styles ─────────────────────────────────────────── */
const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "h-7  px-3  text-xs  gap-1.5 rounded-lg",
  sm: "h-9  px-4  text-sm  gap-2   rounded-xl",
  md: "h-11 px-5  text-sm  gap-2   rounded-xl",
  lg: "h-12 px-6  text-base gap-2.5 rounded-2xl",
  xl: "h-14 px-8  text-lg  gap-3   rounded-2xl",
};

/* ── Loading spinner ─────────────────────────────────────── */
function Spinner({ size }: { size: string }) {
  const spinnerSize =
    size === "xs" || size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <svg
      className={`${spinnerSize} animate-spin`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/* ── Button Component ─────────────────────────────────────── */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className,
      disabled,
      onClick,
      type = "button",
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        whileTap={{ scale: isDisabled ? 1 : 0.96 }}
        whileHover={{ y: isDisabled ? 0 : -1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(
          /* Base */
          "inline-flex items-center justify-center font-semibold",
          "cursor-pointer select-none",
          "transition-all duration-200",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500",
          /* State */
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          fullWidth && "w-full",
          /* Variant + Size */
          variantStyles[variant],
          sizeStyles[size],
          /* Overflow for shine */
          "relative overflow-hidden",
          className
        )}
        // Spread only safe, non-conflicting HTML attrs
        aria-label={(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)["aria-label"]}
        aria-disabled={isDisabled}
        id={(rest as React.ButtonHTMLAttributes<HTMLButtonElement>).id}
      >
        {/* Shine overlay */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0
            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"
        />

        {isLoading ? (
          <Spinner size={size} />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}

        <span className="relative">{children}</span>

        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
