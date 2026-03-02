/**
 * Badge.jsx — Tailwind CSS
 * Status pill / label badge from the ECCII component library.
 */
export default function Badge({
    children,
    status,
    color,
    textColor,
    size = 'md',
    className = '',
    style: extraStyle = {},
}) {
    const statusMap = {
        completed: { bg: '#EAF3EC', text: '#3E6B52' },
        viewed:    { bg: '#E6F1F8', text: '#2B5F82' },
        new:       { bg: '#E6F1F8', text: '#2B5F82' },
        pending:   { bg: '#FEF3E2', text: '#C06A1A' },
        missed:    { bg: '#FAEAEA', text: '#B84848' },
        error:     { bg: '#FAEAEA', text: '#B84848' },
        admin:     { bg: '#0D0D0D', text: '#FAF7F2' },
        parent:    { bg: '#EAF3EC', text: '#3E6B52' },
        gold:      { bg: '#FDF6E8', text: '#C06A1A' },
        nursery:   { bg: '#FEF3E2', text: '#C06A1A' },
        kids:      { bg: '#E6F1F8', text: '#2B5F82' },
        youth:     { bg: '#EAF3EC', text: '#3E6B52' },
        published: { bg: '#EAF3EC', text: '#3E6B52' },
        draft:     { bg: '#F2EDE4', text: 'rgba(13,13,13,0.5)' },
        quiz:      { bg: '#FDF6E8', text: '#B8923A' },
        drawing:   { bg: '#E6F1F8', text: '#2B5F82' },
        fill:      { bg: '#EAF3EC', text: '#3E6B52' },
    };

    const sizeClasses = {
        xs: 'text-[9px]  px-1.5 py-0.5',
        sm: 'text-[9px]  px-2   py-0.5',
        md: 'text-[10px] px-2.5 py-0.5',
        lg: 'text-[12px] px-3.5 py-1',
    };

    const resolved = status ? (statusMap[status] ?? statusMap.draft) : null;
    const bg   = color     || resolved?.bg   || '#F2EDE4';
    const text = textColor || resolved?.text || 'rgba(13,13,13,0.5)';

    return (
        <span
            className={`
                inline-flex items-center rounded-full font-bold tracking-[0.06em] uppercase
                leading-none whitespace-nowrap
                ${sizeClasses[size] || sizeClasses.md}
                ${className}
            `}
            style={{ background: bg, color: text, ...extraStyle }}
        >
            {children}
        </span>
    );
}