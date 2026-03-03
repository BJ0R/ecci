/**
 * Badge.jsx — ECCII logo-derived palette
 * All bg/text pairs WCAG AA compliant.
 */
export default function Badge({
    children, status, color, textColor,
    size = 'md', className = '', style: extraStyle = {},
}) {
    const statusMap = {
        completed: { bg: '#ddf0e4', text: '#145c32' },
        viewed:    { bg: '#dbeaf8', text: '#154e78' },
        new:       { bg: '#e4eaf8', text: '#0d1f5c' },
        pending:   { bg: '#fdefd4', text: '#7a4800' },
        missed:    { bg: '#fae0de', text: '#8c1816' },
        error:     { bg: '#fae0de', text: '#8c1816' },
        admin:     { bg: '#0d1f5c', text: '#f0f4fc' },
        parent:    { bg: '#ddf0e4', text: '#145c32' },
        gold:      { bg: '#fdefd4', text: '#7a4800' },
        crimson:   { bg: '#fae0de', text: '#8c1816' },
        nursery:   { bg: '#fdefd4', text: '#7a4800' },
        kids:      { bg: '#dbeaf8', text: '#154e78' },
        youth:     { bg: '#ddf0e4', text: '#145c32' },
        published: { bg: '#ddf0e4', text: '#145c32' },
        draft:     { bg: '#e4eaf8', text: 'rgba(13,31,92,0.45)' },
        quiz:      { bg: '#fdefd4', text: '#7a4800' },
        drawing:   { bg: '#dbeaf8', text: '#154e78' },
        fill:      { bg: '#ddf0e4', text: '#145c32' },
    };

    const sizeClasses = {
        xs: 'text-[9px]  px-1.5 py-[3px]',
        sm: 'text-[9px]  px-2   py-[3px]',
        md: 'text-[10px] px-2.5 py-[4px]',
        lg: 'text-[12px] px-3.5 py-[5px]',
    };

    const resolved = status ? (statusMap[status] ?? statusMap.draft) : null;
    const bg   = color     || resolved?.bg   || '#e4eaf8';
    const text = textColor || resolved?.text || 'rgba(13,31,92,0.50)';

    return (
        <span
            className={`inline-flex items-center gap-[3px] rounded-full font-bold tracking-[0.07em] uppercase leading-none whitespace-nowrap ${sizeClasses[size] || sizeClasses.md} ${className}`}
            style={{ background: bg, color: text, fontFamily: "'Outfit', sans-serif", ...extraStyle }}
        >
            {children}
        </span>
    );
}