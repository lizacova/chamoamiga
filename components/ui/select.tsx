import * as React from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, options, placeholder, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-[7px]">
        {label && (
          <label htmlFor={inputId} className="font-display font-bold text-sm text-azul-dark">
            {label}
            {hint && <span className="font-body font-normal text-xs text-texto-suave ml-1">({hint})</span>}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'font-body text-[0.95rem] text-texto appearance-none',
            'bg-gris-2 border-[1.5px] border-gris rounded-[12px]',
            'px-[15px] py-[13px] pr-[42px] w-full h-[49px]',
            "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2355606E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_14px_center]",
            'transition-[border-color,box-shadow,background] duration-200',
            'hover:border-[#CFD5DD]',
            'focus:outline-none focus:border-azul focus:bg-white focus:shadow-[0_0_0_4px_rgba(44,92,184,0.12)]',
            error && 'border-rojo bg-white',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[#B93B37] text-xs font-semibold">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
