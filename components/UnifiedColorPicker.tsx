'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { COLOR_OPTIONS, getColorOption, isCustomColor, rgbToHex } from '@lib/goalIconsColors';

interface UnifiedColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
  labelClassName?: string;
}

const parseRgbToHex = (value: string) => {
  if (value.startsWith('#')) return value;
  const match = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return '#ffffff';
  return rgbToHex(Number(match[1]), Number(match[2]), Number(match[3]));
};

export default function UnifiedColorPicker({
  value,
  onChange,
  label,
  className,
  labelClassName,
}: UnifiedColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showRgb, setShowRgb] = useState(false);
  const [customHex, setCustomHex] = useState('#ffffff');
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = useMemo(() => getColorOption(value), [value]);

  useEffect(() => {
    if (isCustomColor(value)) {
      setCustomHex(parseRgbToHex(value));
    } else if (value) {
      const option = getColorOption(value);
      setCustomHex(option.bgColor);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowRgb(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (color: string) => {
    onChange(color);
    setIsOpen(false);
    setShowRgb(false);
  };

  return (
    <div className={`relative ${className ?? ''}`} ref={rootRef}>
      {label && (
        <label className={`${labelClassName ?? 'mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'}`}>
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-slate-900 shadow-sm transition hover:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        aria-label="Seleccionar color"
      >
        <span
          className="h-8 w-8 rounded-full border-2 border-slate-300 dark:border-slate-500"
          style={{ backgroundColor: selected.bgColor, borderColor: selected.borderColor }}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-30 mt-3 w-[18rem] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-950">
          <div className="grid grid-cols-6 gap-3">
            {COLOR_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => handleSelect(option.key)}
                className={`h-11 w-11 rounded-full border-2 transition-all ${
                  value === option.key ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-transparent hover:scale-110 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
                style={{ backgroundColor: option.bgColor, borderColor: option.borderColor }}
                aria-label={option.label}
              />
            ))}
            <button
              type="button"
              onClick={() => setShowRgb(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-100 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:border-slate-400 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
              aria-label="Color RGB personalizado"
            >
              RGB
            </button>
          </div>

          {showRgb && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customHex}
                  onChange={(event) => setCustomHex(event.target.value)}
                  className="h-12 w-12 cursor-pointer rounded-full border border-slate-300 p-0 dark:border-slate-600"
                  aria-label="Seleccionar color RGB"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Color personalizado</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Elige un color directo desde la paleta.</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
                  <span className="h-8 w-8 rounded-full border border-slate-300" style={{ backgroundColor: customHex }} />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{customHex.toUpperCase()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelect(customHex)}
                  className="rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
