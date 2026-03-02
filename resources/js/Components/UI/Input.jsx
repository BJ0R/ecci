import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Input.jsx — Tailwind CSS + Lucide icons
 * Labelled form input with gold focus ring, rose error, helper text.
 * Supports: text | textarea (multiline prop) | select (children)
 */
export default function Input({
    label,
    id,
    value,
    onChange,
    error,
    helper,
    type        = 'text',
    placeholder = '',
    required    = false,
    disabled    = false,
    multiline   = false,
    rows        = 3,
    className   = '',
    ...props
}) {
    const [focused, setFocused] = useState(false);

    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '_') : undefined);

    const fieldStyle = {
        borderColor: error ? '#B84848' : focused ? '#B8923A' : '#DDD7CC',
        background:  disabled ? '#F2EDE4' : '#FFFFFF',
        color:       '#0D0D0D',
        fontFamily:  "'Outfit', sans-serif",
    };

    const fieldClass = `
        w-full px-3.5 py-2.5 rounded-lg border text-[13px] leading-relaxed
        outline-none transition-colors duration-150
        ${disabled ? 'cursor-not-allowed' : ''}
        ${multiline ? 'resize-y' : ''}
    `;

    const sharedProps = {
        id:          inputId,
        value:       value ?? '',
        onChange,
        disabled,
        placeholder,
        required,
        className:   fieldClass,
        style:       fieldStyle,
        onFocus:     () => setFocused(true),
        onBlur:      () => setFocused(false),
        ...props,
    };

    return (
        <div className={`flex flex-col ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-[11px] font-semibold tracking-[0.04em] mb-1.5"
                    style={{ color: 'rgba(13,13,13,0.5)' }}
                >
                    {label}
                    {required && <span className="ml-0.5" style={{ color: '#B84848' }}>*</span>}
                </label>
            )}

            {multiline ? (
                <textarea rows={rows} {...sharedProps} />
            ) : (
                <input type={type} {...sharedProps} />
            )}

            {error && (
                <p className="flex items-start gap-1 text-[11px] mt-1 leading-snug" style={{ color: '#B84848' }}>
                    <AlertCircle size={11} className="flex-shrink-0 mt-px" />
                    {error}
                </p>
            )}

            {!error && helper && (
                <p className="text-[11px] mt-1 leading-snug" style={{ color: 'rgba(13,13,13,0.45)' }}>
                    {helper}
                </p>
            )}
        </div>
    );
}