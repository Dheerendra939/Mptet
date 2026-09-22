export type ToolCategory =
  | 'All'
  | 'Finance'
  | 'Social'
  | 'Development'
  | 'Health'
  | 'Marketing'
  | 'Productivity'
  | 'Business'
  | 'E-commerce'
  | 'Career'
  | 'Content'
  | 'Education'
  | 'Legal'
  | 'Utilities';

export interface ToolPreset {
  label: string;
  description?: string;
  values: Record<string, any>;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name?: string;
  text?: string;
  step?: number;
  title?: string;
  description?: string;
}

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  name?: string;
  id?: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'toggle' | 'number';
  placeholder?: string;
  defaultValue: any;
  options?: FormFieldOption[];
  helpText?: string;
  helperText?: string;
  required?: boolean;
}

export interface CalculationMetric {
  label: string;
  value: string;
  detail?: string;
  highlight?: boolean;
}

export interface QuickComputeResult {
  mainResult?: string;
  mainLabel?: string;
  secondaryMetrics?: Array<{ label: string; value: string }>;
  summary?: string;
  error?: string;
}

export interface LongTailUseCase {
  query: string;
  title: string;
  summary: string;
  presetValues?: Record<string, any>;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  aliases?: string[];
  number: string;
  category: ToolCategory;
  title: string;
  shortDescription: string;
  accentColor: string;
  badgeColor: string;
  iconName: string; // Identifier for Lucide icons
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  longTailKeywords?: string[];
  longTailUseCases?: LongTailUseCase[];
  searchVolumeBadge?: string; // e.g. "Global #1 Trending"
  presets: ToolPreset[];
  fields?: FormField[];
  inputs?: FormField[]; // Support alternate naming
  howToSteps: HowToStep[];
  faqs: FAQItem[];
  keyFeatures?: string[];
  features?: string[]; // Support alternate naming
  whyAIMode?: string;
  aiTaskType?: string;
  promptTemplate?: string;
  compilePrompt?: (values: Record<string, any>) => string;
  calculatePreview?: (values: Record<string, any>) => CalculationMetric[];
  quickCompute?: (values: Record<string, any>) => QuickComputeResult;
}

// Legacy interfaces to maintain clean build with inactive legacy template files
export interface Question {
  id: number;
  section: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export type QuestionStatus = 'not-visited' | 'not-answered' | 'answered' | 'marked-for-review';

export interface PromoterProfile {
  userId: string;
  name: string;
  promoCode: string;
  upiNumber?: string;
  email?: string;
  withdrawnAmount?: number;
  commissionPercent?: number;
  requestedCommissionPercent?: number;
  commissionStatus?: 'pending' | 'approved' | 'rejected';
  commissionRequestedAt?: any;
  commissionApprovedAt?: any;
  commissionNote?: string;
  createdAt: any;
}

