/**
 * Button.jsx — ECCII logo-derived palette
 * primary (navy) | gold | ghost | danger | sage | sky
 * min-height 44px for touch accessibility on md+
 */
export default function Button({
    children, variant = 'primary', size = 'md', disabled = false,
    type = 'button', as, href, onClick, className = '', ...props
}) {
    const base = `
        inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold
        leading-none transition-all duration-200 whitespace-nowrap no-underline
        disabled:opacity-40 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    `;

    const sizes = {
        sm: 'px-4    text-[12px] h-[34px]  min-w-[64px]',
        md: 'px-5    text-[13px] h-[42px]  min-w-[80px]',
        lg: 'px-7    text-[15px] h-[48px]  min-w-[100px]',
    };

    const variants = {
        primary: `bg-[#0d1f5c] text-white
                  hover:bg-[#162a7a] active:bg-[#0a1540]
                  focus-visible:ring-[#0d1f5c]
                  shadow-[0_2px_8px_rgba(13,31,92,0.28)]`,

        gold:    `bg-[#e8a020] text-[#0d1f5c] font-bold
                  hover:bg-[#d08c14] active:bg-[#b87010]
                  focus-visible:ring-[#e8a020]
                  shadow-[0_2px_8px_rgba(232,160,32,0.30)]`,

        ghost:   `bg-transparent text-[#0d1f5c]
                  border border-[rgba(13,31,92,0.22)]
                  hover:bg-[rgba(13,31,92,0.05)] hover:border-[rgba(13,31,92,0.40)]
                  focus-visible:ring-[#0d1f5c]`,

        danger:  `bg-[rgba(192,32,30,0.09)] text-[#8c1816]
                  hover:bg-[rgba(192,32,30,0.16)]
                  focus-visible:ring-[#c0201e]`,

        sage:    `bg-[#ddf0e4] text-[#145c32]
                  hover:bg-[#c6e8d2]
                  focus-visible:ring-[#1e6e42]`,

        sky:     `bg-[#dbeaf8] text-[#154e78]
                  hover:bg-[#c2ddf2]
                  focus-visible:ring-[#1a5c8a]`,
    };

    const cls = `${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`;

    if (as === 'a' || href) return <a href={href} className={cls} {...props}>{children}</a>;

    return (
        <button type={type} disabled={disabled} onClick={onClick} className={cls} {...props}>
            {children}
        </button>
    );
}