import Image from 'next/image'
import { initials, getGradient } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface AvatarProps {
  name: string
  fotoUrl?: string | null
  size?: number
  className?: string
}

export function Avatar({ name, fotoUrl, size = 48, className }: AvatarProps) {
  const gradient = getGradient(name)
  const fontSize = Math.round(size * 0.36)

  if (fotoUrl) {
    return (
      <span
        className={cn('rounded-full overflow-hidden flex-none block', className)}
        style={{ width: size, height: size }}
      >
        <Image
          src={fotoUrl}
          alt={`Foto de ${name}`}
          width={size}
          height={size}
          className="w-full h-full object-cover"
        />
      </span>
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'rounded-full flex items-center justify-center flex-none text-white font-display font-extrabold',
        className
      )}
      style={{ width: size, height: size, background: gradient, fontSize }}
    >
      {initials(name)}
    </span>
  )
}
