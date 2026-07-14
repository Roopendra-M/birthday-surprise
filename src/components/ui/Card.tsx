"use client";

import React from "react";
import { motion } from "framer-motion";
import type { CardProps } from "@/types";
import { cn } from "@/utils/cn";

/* ── Variant styles ──────────────────────────────────────── */
const variantStyles: Record<NonNullable<CardProps["variant"]>, string> = {
  default:
    "glass rounded-2xl",
  glass:
    "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl " +
    "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
  outlined:
    "bg-transparent border border-white/15 rounded-2xl",
  elevated:
    "bg-white/8 backdrop-blur-xl border border-white/12 rounded-2xl " +
    "shadow-[0_20px_60px_rgba(0,0,0,0.6),0_4px_16px_rgba(0,0,0,0.3)]",
  gradient:
    "rounded-2xl relative overflow-hidden " +
    "bg-[#0f0c29] border border-violet-500/20 " +
    "shadow-[0_0_40px_rgba(124,58,237,0.15)]",
};

/* ── Card Component ──────────────────────────────────────── */
export default function Card({
  variant = "default",
  className,
  children,
  onClick,
  animate = true,
  delay = 0,
}: CardProps) {
  const isInteractive = !!onClick;

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 24, scale: 0.97 } : undefined}
      whileInView={
        animate
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                delay,
                duration: 0.5,
                ease: "easeOut",
              },
            }
          : undefined
      }
      viewport={{ once: true, margin: "-60px" }}
      whileHover={
        isInteractive
          ? { y: -4, boxShadow: "0 20px 60px rgba(124, 58, 237, 0.25)" }
          : undefined
      }
      whileTap={isInteractive ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        "transition-all duration-300",
        isInteractive && "cursor-pointer select-none",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </motion.div>
  );
}

/* ── Sub-components ──────────────────────────────────────── */
export function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("px-6 pt-6 pb-4", className)}>{children}</div>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("px-6 py-4", className)}>{children}</div>
  );
}

export function CardFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("px-6 pb-6 pt-4 border-t border-white/8", className)}>
      {children}
    </div>
  );
}
