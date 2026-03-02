/**
 * Button.jsx — Tailwind CSS
 * ECCII design-system button: primary | gold | ghost | danger | sage | sky
 */
export default function Button({
    children,
    variant  = 'primary',
    size     = 'md',
    disabled = false,
    type     = 'button',
    as,
    href,
    onClick,
    className = '',
    ...props
}) {
    const base = `
        inline-flex items-center justify-center gap-1.5
        rounded-lg font-semibold leading-none
        transition-all duration-200
        whitespace-nowrap no-underline
        disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const sizes = {
        sm: 'px-3.5 py-1.5 text-[12px] h-[30px]',
        md: 'px-5    py-2.5 text-[13px] h-[38px]',
        lg: 'px-7    py-3   text-[14px] h-[46px]',
    };

    const variants = {
        primary: 'bg-[#0D0D0D] text-[#FAF7F2] hover:bg-[#222222]',
        gold:    'bg-[#B8923A] text-[#0D0D0D] hover:bg-[#A07830]',
        ghost:   'bg-transparent text-[#0D0D0D] border border-[#DDD7CC] hover:border-[#0D0D0D]',
        danger:  'bg-[#FAEAEA] text-[#B84848] hover:bg-[#F5D5D5]',
        sage:    'bg-[#EAF3EC] text-[#3E6B52] hover:bg-[#D4EBD9]',
        sky:     'bg-[#E6F1F8] text-[#2B5F82] hover:bg-[#CCE4F2]',
    };

    const cls = `${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`;

    if (as === 'a' || href) {
        return (
            <a href={href} className={cls} {...props}>
                {children}
            </a>
        );
    }

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={cls}
            {...props}
        >
            {children}
        </button>
    );
}