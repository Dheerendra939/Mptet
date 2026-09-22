import React, { useState, useEffect, useMemo } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Zap,
  Share2
} from 'lucide-react';
import { ToolDefinition } from '../types';
import { ToolIcon } from './ToolIcon';

interface ToolFormViewProps {
  tool: ToolDefinition;
  onNavigateHome: () => void;
  onSelectTool: (tool: ToolDefinition) => void;
  allTools: ToolDefinition[];
}

export function ToolFormView({
  tool,
  onNavigateHome,
  onSelectTool,
  allTools
}: ToolFormViewProps) {
  // Normalize fields between fields and inputs
  const normalizedFields = useMemo(() => {
    const raw = tool.fields || tool.inputs || [];
    return raw.map(field => ({
      name: field.name || field.id || 'field',
      label: field.label,
      type: field.type,
      placeholder: field.placeholder,
      defaultValue: field.defaultValue,
      options: field.options,
      helpText: field.helpText || field.helperText,
      required: field.required
    }));
  }, [tool]);

  // Initialize form state from default values of fields
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const raw = tool.fields || tool.inputs || [];
    const initial: Record<string, any> = {};
    raw.forEach(field => {
      const key = field.name || field.id || 'field';
      initial[key] = field.defaultValue;
    });
    return initial;
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [launchedNotice, setLaunchedNotice] = useState<{ url: string; prompt: string } | null>(null);

  const handleCopyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `/tool/${tool.slug}`);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  // When tool changes (via related tool click or routing), reset form state
  useEffect(() => {
    const raw = tool.fields || tool.inputs || [];
    const initial: Record<string, any> = {};
    raw.forEach(field => {
      const key = field.name || field.id || 'field';
      initial[key] = field.defaultValue;
    });
    setFormValues(initial);
    setFieldErrors({});
    setLaunchedNotice(null);
    setOpenFaqIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tool.id]);

  const handleInputChange = (name: string, value: any) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleApplyPreset = (presetValues: Record<string, any>) => {
    setFormValues(prev => ({ ...prev, ...presetValues }));
    setFieldErrors({});
  };

  const currentPrompt = useMemo(() => {
    if (tool.compilePrompt) {
      return tool.compilePrompt(formValues);
    }
    if (tool.promptTemplate) {
      let p = tool.promptTemplate;
      Object.entries(formValues).forEach(([k, v]) => {
        const valStr = String(v ?? '');
        p = p.split(`{${k}}`).join(valStr);
        p = p.split(`\${'{${k}}'}`).join(valStr);
        p = p.split(`\${'{${k}}'}`).join(valStr);
      });
      return p;
    }
    return `Generate a comprehensive report for ${tool.title} based on parameters: ${JSON.stringify(formValues, null, 2)}`;
  }, [tool, formValues]);

  const liveCalculations = useMemo(() => {
    if (tool.calculatePreview) {
      return tool.calculatePreview(formValues);
    }
    if (tool.quickCompute) {
      try {
        const res = tool.quickCompute(formValues);
        if (!res || res.error) return null;
        const metrics: Array<{ label: string; value: string; highlight?: boolean; detail?: string }> = [];
        if (res.mainResult) {
          metrics.push({ label: res.mainLabel || 'Result', value: res.mainResult, highlight: true, detail: res.summary });
        }
        if (res.secondaryMetrics) {
          res.secondaryMetrics.forEach(m => metrics.push({ label: m.label, value: m.value }));
        }
        return metrics;
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [tool, formValues]);

  const handleLaunch = () => {
    // Validate required fields
    const errors: Record<string, string> = {};
    normalizedFields.forEach(field => {
      if (field.required) {
        const val = formValues[field.name];
        if (val === undefined || val === null || String(val).trim() === '') {
          errors[field.name] = `${field.label} is required.`;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const encodedPrompt = encodeURIComponent(currentPrompt);
    const targetUrl = `https://www.google.com/search?q=${encodedPrompt}`;

    setLaunchedNotice({ url: targetUrl, prompt: currentPrompt });

    try {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Popup intercepted by browser sandbox', e);
    }
  };

  const handleCopyPrompt = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    }
  };

  const handleResetForm = () => {
    const initial: Record<string, any> = {};
    normalizedFields.forEach(field => {
      initial[field.name] = field.defaultValue;
    });
    setFormValues(initial);
    setFieldErrors({});
  };

  // Other related tools for the compact footer shelf
  const relatedTools = useMemo(() => {
    return allTools.filter(t => t.id !== tool.id).slice(0, 3);
  }, [allTools, tool.id]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      {/* 1. Breadcrumb navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500">
        <a
          href="/"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              onNavigateHome();
            }
          }}
          className="hover:text-slate-900 transition-colors font-medium"
        >
          All 100 Tools
        </a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-500">{tool.category}</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{tool.title}</span>
      </nav>

      {/* 2. Dispatched Banner Alert if search opened */}
      {launchedNotice && (
        <div className="mb-8 p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700 mt-0.5 shrink-0 border border-slate-200">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Reference Search Opened</p>
              <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                {launchedNotice.prompt}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleCopyPrompt}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-all border border-slate-200 shadow-2xs"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompt ? 'Copied!' : 'Copy Summary'}</span>
            </button>
            <a
              href={launchedNotice.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-white shadow-xs transition-all"
            >
              <span>View Reference</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* 3. Tool Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 shadow-2xs">
              {tool.category}
            </span>
            {tool.searchVolumeBadge && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-100 text-slate-600">
                {tool.searchVolumeBadge}
              </span>
            )}
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded text-slate-400">
              Tool #{tool.number}
            </span>
          </div>

          {/* H1 for Primary Target Keyword SEO */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            {tool.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {tool.shortDescription}
          </p>
        </div>

        <button
          onClick={handleCopyUrl}
          className="self-start inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900 transition-all shadow-2xs shrink-0"
          title="Share tool direct link"
        >
          {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
          <span>{copiedUrl ? 'Link Copied!' : 'Share Tool'}</span>
        </button>
      </div>

      {/* 4. Quick Presets Bar */}
      {tool.presets && tool.presets.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500">
            <Zap className="w-3.5 h-3.5 text-slate-700" />
            <span>Popular Scenarios & Quick Presets:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tool.presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(preset.values)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 transition-all text-left flex items-center gap-1.5 group shadow-2xs"
                title={preset.description}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-slate-900 transition-colors" />
                <span className="font-medium">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Main Dedicated Tool Form Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden mb-8">
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
              <ToolIcon name={tool.iconName} className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Configuration Form</h2>
              <p className="text-xs text-slate-500">Customize parameters to calculate instant verified solutions</p>
            </div>
          </div>

          <button
            onClick={handleResetForm}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            title="Reset to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Dynamic Fields Grid */}
        <div className="space-y-5">
          {normalizedFields.map(field => {
            const hasError = !!fieldErrors[field.name];

            if (field.type === 'toggle') {
              return (
                <div
                  key={field.name}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4 hover:border-slate-300 transition-all cursor-pointer select-none"
                  onClick={() => handleInputChange(field.name, !formValues[field.name])}
                >
                  <div className="space-y-0.5">
                    <label className="text-sm font-semibold text-slate-800 cursor-pointer">
                      {field.label}
                    </label>
                    {field.helpText && (
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {field.helpText}
                      </p>
                    )}
                  </div>
                  {/* Custom Toggle Switch */}
                  <div className="relative inline-flex items-center shrink-0 mt-0.5">
                    <div
                      className={`w-11 h-6 rounded-full transition-colors ${
                        formValues[field.name] ? 'bg-slate-900' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform transform mt-0.5 ml-0.5 shadow-sm ${
                          formValues[field.name] ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            }

            if (field.type === 'textarea') {
              return (
                <div key={field.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                      <span>{field.label}</span>
                      {field.required && <span className="text-rose-500">*</span>}
                    </label>
                  </div>
                  <textarea
                    rows={4}
                    value={formValues[field.name] || ''}
                    placeholder={field.placeholder}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className={`w-full bg-white border rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
                      hasError
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-slate-400 focus:ring-slate-300'
                    }`}
                  />
                  {hasError && <p className="text-xs text-rose-500">{fieldErrors[field.name]}</p>}
                  {field.helpText && !hasError && (
                    <p className="text-xs text-slate-500">{field.helpText}</p>
                  )}
                </div>
              );
            }

            if (field.type === 'select') {
              return (
                <div key={field.name} className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <span>{field.label}</span>
                    {field.required && <span className="text-rose-500">*</span>}
                  </label>
                  <div className="relative">
                    <select
                      value={formValues[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-slate-900 appearance-none focus:outline-none focus:ring-1 transition-all pr-10 ${
                        hasError
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                          : 'border-slate-200 focus:border-slate-400 focus:ring-slate-300'
                      }`}
                    >
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-white text-slate-900">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {hasError && <p className="text-xs text-rose-500">{fieldErrors[field.name]}</p>}
                  {field.helpText && !hasError && (
                    <p className="text-xs text-slate-500">{field.helpText}</p>
                  )}
                </div>
              );
            }

            // Default: text / number
            return (
              <div key={field.name} className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <span>{field.label}</span>
                  {field.required && <span className="text-rose-500">*</span>}
                </label>
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={formValues[field.name] || ''}
                  placeholder={field.placeholder}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    hasError
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-slate-400 focus:ring-slate-300'
                  }`}
                />
                {hasError && <p className="text-xs text-rose-500">{fieldErrors[field.name]}</p>}
                {field.helpText && !hasError && (
                  <p className="text-xs text-slate-500">{field.helpText}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Calculation Preview Shelf (e.g. for EMI, Percentages, Scientific) */}
        {liveCalculations && (
          <div className="mt-8 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Instant Computed Results
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {liveCalculations.map((metric, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    metric.highlight
                      ? 'bg-white border-slate-300 text-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <p className="text-xs text-slate-500 mb-0.5">{metric.label}</p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900">{metric.value}</p>
                  {metric.detail && (
                    <p className="text-[11px] text-slate-500 mt-0.5">{metric.detail}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Primary Action Buttons Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleLaunch}
            className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm sm:text-base shadow-xs transition-all"
          >
            <span>Search Reference Online</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopyPrompt}
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium text-sm border border-slate-200 transition-all shadow-2xs"
            title="Copy calculation summary to clipboard"
          >
            {copiedPrompt ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copiedPrompt ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
          </button>
        </div>

        {/* Real-time Query / Calculation Inspector Accordion */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <button
            onClick={() => setIsPromptExpanded(!isPromptExpanded)}
            className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 transition-colors py-1"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Inspect Calculation Parameters ({currentPrompt.length} characters)</span>
            </span>
            {isPromptExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isPromptExpanded && (
            <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap select-all">
              {currentPrompt}
            </div>
          )}
        </div>
      </div>

      {/* 6. Rich SEO Content Section (Optimized for Google Organic Rank) */}
      <div className="space-y-12 mt-12 border-t border-slate-200 pt-10">
        {/* Step-by-Step How-To (matches Schema.org HowTo) */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            <CheckCircle2 className="w-4 h-4 text-slate-700" />
            <span>Step-by-Step Guide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
            How to Use the {tool.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tool.howToSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200 mb-3">
                  {idx + 1}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{step.name || step.title || `Step ${idx + 1}`}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.text || step.description || ''}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Long-Tail Real-World Use Cases & Specific Search Solutions */}
        {tool.longTailUseCases && tool.longTailUseCases.length > 0 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              <Zap className="w-4 h-4 text-slate-700" />
              <span>Targeted Search Solutions</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              Specific Real-World Questions This Tool Solves
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Frequently searched problems and calculation scenarios. Click any query to load the exact configuration into the form above.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tool.longTailUseCases.map((uc, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      "{uc.query}"
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      <strong className="text-slate-800 font-semibold">{uc.title}:</strong> {uc.summary}
                    </p>
                  </div>

                  {uc.presetValues && (
                    <button
                      onClick={() => handleApplyPreset(uc.presetValues!)}
                      className="self-start text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 transition-all shadow-2xs"
                    >
                      <Zap className="w-3 h-3 text-slate-500" />
                      <span>Load This Exact Calculation</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Features & Calculation Methodology */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            <CheckCircle2 className="w-4 h-4 text-slate-700" />
            <span>Calculation Methodology</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
            Key Features & Verification
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {tool.whyAIMode
              ? tool.whyAIMode.replace(/AI Search Mode/g, 'Dedicated precision computing').replace(/AI/g, 'smart computational')
              : 'Built with verified mathematical algorithms, live input checking, and instant formula execution.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(tool.keyFeatures || tool.features || ['Instant Mathematical Verification', 'Real-Time Edge Case Analysis', 'Clear Formatted Reference Output']).map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feat.replace(/AI/g, 'precision')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Asked Questions (FAQ Accordions matching Schema.org FAQPage) */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            <HelpCircle className="w-4 h-4 text-slate-700" />
            <span>Questions & Answers</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {tool.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-white border border-slate-200 overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-slate-800 hover:text-slate-900"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Long-Tail Keywords Index & Search Intent Tag Cloud */}
        {tool.longTailKeywords && tool.longTailKeywords.length > 0 && (
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              <span>Related Search Terms & Concepts</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tool.longTailKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-1.5"
                >
                  <span className="text-slate-400 text-[10px]">#</span>
                  <span>{kw}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 7. Subtle Footer Shelf: Explore Other Worldwide Tools */}
      <div className="mt-16 pt-10 border-t border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Explore Other Tools</h3>
            <p className="text-xs text-slate-500">Need something else? Switch tools in one click.</p>
          </div>
          <a
            href="/"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                onNavigateHome();
              }
            }}
            className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1 group"
          >
            <span>View All 100 Tools</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {relatedTools.map(rt => (
            <a
              key={rt.id}
              href={`/tool/${rt.slug}`}
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  onSelectTool(rt);
                }
              }}
              className="p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-left transition-all group shadow-2xs block"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{rt.category}</span>
                <span className="text-xs font-mono text-slate-400">#{rt.number}</span>
              </div>
              <p className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors mb-1 line-clamp-1">
                {rt.title}
              </p>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {rt.shortDescription}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
