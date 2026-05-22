const variantStyles = {
  default: 'bg-slate-100 text-slate-600',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-orange-100 text-orange-700',
  primary: 'bg-navy/10 text-navy',
  error: 'bg-red-100 text-red-700',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantStyles[variant] || variantStyles.default} ${className}`}>
      {children}
    </span>
  )
}
