import type { MetadataRoute } from 'next'
import { APP_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: APP_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${APP_URL}/buscar`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${APP_URL}/solicitudes`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${APP_URL}/necesito`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${APP_URL}/sumarme`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${APP_URL}/quienes-somos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${APP_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${APP_URL}/privacidad`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
