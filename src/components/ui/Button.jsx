import React from 'react';

export default function Button({
  children,
  variant = 'gold', // 'gold' | 'secondary' | 'pink' | 'hint' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  let baseClass = 'font-display font-black rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 select-none';

  let sizeClass = 'px-6 py-2.5 text-base';
  if (size === 'sm') sizeClass = 'px-3.5 py-1.5 text-xs';
  if (size === 'lg') sizeClass = 'px-8 py-3.5 text-lg shadow-xl';

  let variantClass = '';
  if (variant === 'gold') {
    variantClass = 'btn-gold';
  } else if (variant === 'secondary') {
    variantClass = 'btn-secondary';
  } else if (variant === 'pink') {
    variantClass = 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:brightness-110 shadow-lg shadow-pink-500/30';
  } else if (variant === 'hint') {
    variantClass = 'btn-hint';
  } else if (variant === 'ghost') {
    variantClass = 'bg-transparent text-slate-300 hover:text-white hover:bg-white/10 border border-white/20';
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClass} ${sizeClass} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
