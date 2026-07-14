// ─── Common Utility Types ────────────────────────────────────────────────────

export type WithChildren<T = object> = T & { children: React.ReactNode };
export type WithClassName<T = object> = T & { className?: string };

// ─── Animation Types ─────────────────────────────────────────────────────────

export type AnimationVariant =
  | "fadeIn"
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "scaleIn"
  | "slideIn"
  | "bounceIn";

export type EasingPreset = "ease" | "spring" | "bounce" | "smooth";

export interface AnimationConfig {
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
  easing?: EasingPreset;
}

// ─── Component Prop Types ─────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export type CardVariant = "default" | "glass" | "outlined" | "elevated" | "gradient";

export interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  animate?: boolean;
  delay?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

// ─── Theme Types ──────────────────────────────────────────────────────────────

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
}

// ─── Data / Content Types ────────────────────────────────────────────────────

export interface SiteMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}
