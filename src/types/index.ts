import type { ReactNode } from "react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "generators" | "converters" | "analyzers" | "ai" | "image";
  component: React.ComponentType;
  isFavorite?: boolean;
  lastUsed?: number;
}

export interface HistoryEntry {
  id: string;
  toolId: string;
  action: string;
  timestamp: number;
  data?: any;
  result?: any;
}

export interface UserPreferences {
  theme: "dark" | "light";
  jwtSecret: string;
  passwordLength: number;
  passwordOptions: {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
  encodingDefaults: {
    defaultType: "base64" | "url" | "html" | "hex";
  };
  colorPaletteDefaults: {
    defaultType: "monochromatic" | "analogous" | "complementary" | "triadic";
  };
  regexDefaults: {
    globalFlag: boolean;
    caseInsensitiveFlag: boolean;
    multilineFlag: boolean;
  };
}

export interface PWAState {
  deferredPrompt: any;
  showInstallPrompt: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
}

export interface AppState {
  // Navigation
  currentTool: string | null;
  setCurrentTool: (toolId: string | null) => void;

  // PWA
  pwa: PWAState;
  setPWAState: (updates: Partial<PWAState>) => void;

  // User preferences
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;

  // History
  history: HistoryEntry[];
  addToHistory: (
    toolId: string,
    action: string,
    data?: any,
    result?: any
  ) => void;
  clearHistory: () => void;
  getToolHistory: (toolId: string) => HistoryEntry[];

  // Favorites
  favorites: string[];
  toggleFavorite: (toolId: string) => void;
  getFavoriteTools: () => string[];

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Statistics
  toolUsageStats: Record<string, number>;
  incrementToolUsage: (toolId: string) => void;
  getMostUsedTools: () => Array<{ toolId: string; count: number }>;
}

// Component props interfaces
export interface ToolCardProps {
  tool: Tool;
  onClick: (toolId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
  usageCount?: number;
}

export interface DashboardProps {
  tools: Tool[];
  onToolSelect: (toolId: string) => void;
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
  fullWidth?: boolean;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "password" | "email" | "number" | "url" | "tel" | "search";
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  icon?: ReactNode;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}

export interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  multiple?: boolean;
  searchable?: boolean;
}

export interface TextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
  resize?: "none" | "vertical" | "horizontal" | "both";
  maxLength?: number;
  minLength?: number;
  autoFocus?: boolean;
}

export interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  indeterminate?: boolean;
}

export interface RadioProps {
  label?: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  name?: string;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
  variant?: "default" | "glass" | "bordered";
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnBackdrop?: boolean;
  className?: string;
  showCloseButton?: boolean;
}

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
}

export interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: "primary" | "secondary" | "white";
}

export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showValue?: boolean;
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
}

// Tool-specific interfaces
export interface JWTPayload {
  [key: string]: any;
}

export interface JWTHeader {
  alg: string;
  typ: string;
  [key: string]: any;
}

export interface MockDataField {
  name: string;
  type:
    | "name"
    | "email"
    | "phone"
    | "address"
    | "date"
    | "id"
    | "number"
    | "text"
    | "boolean";
  enabled: boolean;
  options?: any;
}

export interface ColorPalette {
  colors: string[];
  type: "monochromatic" | "analogous" | "complementary" | "triadic";
  baseColor: string;
}

export interface RegexTest {
  pattern: string;
  testString: string;
  flags: {
    global: boolean;
    ignoreCase: boolean;
    multiline: boolean;
  };
  matches: Array<{
    match: string;
    index: number;
    groups: string[];
  }>;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type NonEmptyArray<T> = [T, ...T[]];

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
