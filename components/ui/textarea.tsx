import * as React from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-[7px]">
        {label && (
          <label htmlFor={inputId} className="font-display font-bold text-sm text-azul-dark">
            {label}
            {hint && <span className="font-body font-normal text-xs text-texto-suave ml-1">({hint})</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'font-body text-[0.95rem] text-texto',
            'bg-gris-2 border-[1.5px] border-gris rounded-[12px]',
            'px-[15px] py-[13px] w-full resize-vertical min-h-[110px]',
            'transition-[border-color,box-shadow,background] duration-200',
            'hover:border-[#CFD5DD]',
            'focus:outline-none focus:border-azul focus:bg-white focus:shadow-[0_0_0_4px_rgba(44,92,184,0.12)]',
            error && 'border-rojo bg-white',
            className
          )}
          {...props}
        />
        {error && <p className="text-[#B93B37] text-xs font-semibold">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
