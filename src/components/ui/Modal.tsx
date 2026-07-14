"use client";

import React, { useEffect, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { ModalProps } from "@/types";
import { cn } from "@/utils/cn";
import Button from "./Button";

/* ── Size map ─────────────────────────────────────────────── */
const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  sm:   "max-w-sm",
  md:   "max-w-lg",
  lg:   "max-w-2xl",
  xl:   "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)]",
};

/* ── Motion variants ──────────────────────────────────────── */
const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
} as const;

const panelVariants = {
  hidden:  { opacity: 0, scale: 0.92, y: 24 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 28, delay: 0.05 },
  },
  exit:    {
    opacity: 0, scale: 0.94, y: 16,
    transition: { duration: 0.18, ease: "easeIn" as const },
  },
} as const;

/* ── Modal Component ──────────────────────────────────────── */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
}: ModalProps) {
  const titleId = useId();
  const descId  = useId();

  /* Lock scroll when open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* Close on Escape */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );
  useEffect(() => {
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ────────────────────────────────── */}
          <motion.div
            key="modal-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md"
          />

          {/* ── Panel ───────────────────────────────────── */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <motion.div
              key="modal-panel"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "relative w-full",
                sizeClasses[size],
                /* Glass card */
                "bg-[#13103a]/95 backdrop-blur-2xl",
                "border border-white/10 rounded-3xl",
                "shadow-[0_30px_80px_rgba(0,0,0,0.7),0_0_60px_rgba(124,58,237,0.15)]",
                "overflow-hidden"
              )}
            >
              {/* Gradient accent top-bar */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent"
              />

              {/* ── Header ──────────────────────────────── */}
              {(title || showCloseButton) && (
                <div className="flex items-start justify-between px-6 pt-6 pb-4">
                  <div className="flex-1 min-w-0 pr-4">
                    {title && (
                      <h2
                        id={titleId}
                        className="text-xl font-bold text-white leading-tight"
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p
                        id={descId}
                        className="mt-1 text-sm text-white/60 leading-relaxed"
                      >
                        {description}
                      </p>
                    )}
                  </div>

                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={onClose}
                      aria-label="Close modal"
                      className="shrink-0 !h-8 !w-8 !p-0 rounded-xl text-white/50 hover:text-white hover:bg-white/10"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              )}

              {/* Divider if header present */}
              {(title || showCloseButton) && (
                <div className="divider mx-6" aria-hidden="true" />
              )}

              {/* ── Body ────────────────────────────────── */}
              <div className="px-6 py-5 overflow-y-auto max-h-[70vh] no-scrollbar">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
