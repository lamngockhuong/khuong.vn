// Config types for identity landing page
export interface Link {
  label: string
  url: string
  icon: 'globe' | 'github' | 'linkedin' | 'email'
}

export interface Avatar {
  type: 'letter' | 'image'
  value: string
}

export interface SEO {
  title: string
  description: string
  canonical: string
  ogImage: string
}

export interface Analytics {
  goatcounter?: string
}

export interface ThemeOverride {
  colors?: {
    primary?: string
    background?: string
    text?: string
  }
}

export interface Themes {
  enabled: string[]
  overrides?: Record<string, ThemeOverride>
}

export interface Config {
  name: string
  role: string
  avatar: Avatar
  links: Link[]
  seo: SEO
  analytics: Analytics
  themes: Themes
  customCSS?: string
}

// Import config at build time
import configData from '../config.json'
export const config: Config = configData as Config
