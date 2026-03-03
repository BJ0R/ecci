import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Input.jsx — ECCII logo-derived palette
 * Navy label · gold focus ring · crimson error · meets WCAG AA
 */
export default function Input({
    label, id, value, onChange, error, helper,
    type = 'text', placeholder = '', required = false,
    disabled = false, multiline = false, rows = 3, className = '', ...props
}) {
    const [focused, setFocused] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '_') : undefined);

    const getBorderColor = () => {
        if (error)   return '#c0201e';
        if (focused) return '#e8a020';
        return 'rgba(13,31,92,0.18)';
    };

    const getBoxShadow = () => {
        if (error)   return '0 0 0 3px rgba(192,32,30,0.12)';
        if (focused) return '0 0 0 3px rgba(232,160,32,0.18)';
        return 'none';
    };

    const fieldStyle = {
        borderColor: getBorderColor(),
        boxShadow:   getBoxShadow(),
        background:  disabled ? '#e4eaf8' : '#ffffff',
        color:       '#0d1f5c',
        fontFamily:  "'Outfit', sans-serif",
        transition:  'border-color 0.15s ease, box-shadow 0.15s ease',
    };

    const fieldClass = `
        w-full px-3.5 py-2.5 rounded-lg border text-[14px] leading-relaxed
        outline-none ${disabled ? 'cursor-not-allowed opacity-65' : ''}
        ${multiline ? 'resize-y' : ''}
    `;

    const sharedProps = {
        id: inputId, value: value ?? '', onChange, disabled, placeholder, required,
        className: fieldClass, style: fieldStyle,
        onFocus: () => setFocused(true),
        onBlur:  () => setFocused(false),
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined,
        ...props,
    };

    return (
        <div className={`flex flex-col ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-[11px] font-bold tracking-[0.08em] uppercase mb-1.5"
                    style={{ color: 'rgba(13,31,92,0.55)', fontFamily: "'JetBrains Mono', monospace" }}
                >
                    {label}
                    {required && (
                        <span className="ml-0.5 font-bold" style={{ color: '#c0201e' }} aria-hidden="true">*</span>
                    )}
                </label>
            )}

            {multiline
                ? <textarea rows={rows} {...sharedProps} />
                : <input type={type} {...sharedProps} />
            }

            {error && (
                <p id={`${inputId}-error`} role="alert"
                    className="flex items-start gap-1.5 text-[12px] mt-1.5 font-medium leading-snug"
                    style={{ color: '#8c1816' }}
                >
                    <AlertCircle size={13} className="flex-shrink-0 mt-px" />
                    {error}
                </p>
            )}

            {!error && helper && (
                <p id={`${inputId}-helper`}
                    className="text-[12px] mt-1.5 leading-snug"
                    style={{ color: 'rgba(13,31,92,0.45)' }}
                >
                    {helper}
                </p>
            )}
        </div>
    );
}