export type Platform =
  | 'youtube'
  | 'instagram'
  | 'x'
  | 'linkedin'
  | 'facebook'
  | 'tiktok'

export interface DailyEntry {
  id: string
  date: string // YYYY-MM-DD
  platform: Platform
  impressions: number
  views: number
  likes: number
  comments: number
  shares: number
  saves: number
  followersGained: number
  notes: string
  createdAt: string
  updatedAt: string
}

export interface PlatformMeta {
  label: string
  color: string
  gradient: string[]
  icon: string
}

export const PLATFORMS: Record<Platform, PlatformMeta> = {
  youtube: {
    label: 'YouTube',
    color: '#FF0000',
    gradient: ['#FF0000', '#FF6B6B'],
    icon: '▶',
  },
  instagram: {
    label: 'Instagram',
    color: '#E1306C',
    gradient: ['#833AB4', '#E1306C'],
    icon: '◉',
  },
  x: {
    label: 'X (Twitter)',
    color: '#1DA1F2',
    gradient: ['#1DA1F2', '#0d8de0'],
    icon: '✕',
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    gradient: ['#0A66C2', '#0077B5'],
    icon: '▣',
  },
  facebook: {
    label: 'Facebook',
    color: '#1877F2',
    gradient: ['#1877F2', '#42A5F5'],
    icon: 'f',
  },
  tiktok: {
    label: 'TikTok',
    color: '#69C9D0',
    gradient: ['#010101', '#69C9D0'],
    icon: '♪',
  },
}

export type MetricKey =
  | 'impressions'
  | 'views'
  | 'likes'
  | 'comments'
  | 'shares'
  | 'saves'
  | 'followersGained'

export const METRIC_LABELS: Record<MetricKey, string> = {
  impressions: 'Impressions',
  views: 'Views',
  likes: 'Likes',
  comments: 'Comments',
  shares: 'Shares',
  saves: 'Saves',
  followersGained: 'Followers Gained',
}

export type TimeFilter = 'today' | 'week' | 'month' | '3months' | 'all'

export interface AggregatedMetrics {
  impressions: number
  views: number
  likes: number
  comments: number
  shares: number
  saves: number
  followersGained: number
}

export interface ChartDataPoint {
  date: string
  impressions: number
  views: number
  likes: number
  comments: number
  shares: number
}

export interface PlatformSummary {
  platform: Platform
  metrics: AggregatedMetrics
  entryCount: number
}

export type ConnectionMode = 'live' | 'demo' | 'disconnected'

export interface PlatformConnection {
  platform: Platform
  mode: ConnectionMode
  connectedAt?: string
  lastSyncedAt?: string
  // Live mode credentials (stored client-side for demo; real app would use server-side)
  accessToken?: string
  refreshToken?: string
  // Profile info populated after connect
  profileName?: string
  profileHandle?: string
  followerCount?: number
  // Sync state
  syncing?: boolean
  syncError?: string
}

// OAuth endpoints & required scopes per platform
export interface PlatformOAuthConfig {
  authUrl: string
  scopes: string[]
  apiDocsUrl: string
  setupSteps: string[]
}

export const PLATFORM_OAUTH: Record<Platform, PlatformOAuthConfig> = {
  youtube: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
    apiDocsUrl: 'https://developers.google.com/youtube/v3',
    setupSteps: [
      'Go to Google Cloud Console and create a project',
      'Enable the YouTube Data API v3',
      'Create OAuth 2.0 credentials (Web application)',
      'Add your redirect URI and paste credentials below',
    ],
  },
  instagram: {
    authUrl: 'https://api.instagram.com/oauth/authorize',
    scopes: ['instagram_basic', 'instagram_content_publish', 'pages_read_engagement'],
    apiDocsUrl: 'https://developers.facebook.com/docs/instagram-api',
    setupSteps: [
      'Create a Meta Developer app at developers.facebook.com',
      'Add Instagram Graph API product',
      'Get your App ID and App Secret',
      'Set up Instagram Business or Creator account',
    ],
  },
  x: {
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    scopes: ['tweet.read', 'users.read', 'offline.access'],
    apiDocsUrl: 'https://developer.twitter.com/en/docs/twitter-api',
    setupSteps: [
      'Apply for X (Twitter) Developer account at developer.twitter.com',
      'Create a new Project and App',
      'Enable OAuth 2.0 and set callback URL',
      'Copy your Client ID and Client Secret below',
    ],
  },
  linkedin: {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scopes: ['r_liteprofile', 'r_emailaddress', 'r_organization_social'],
    apiDocsUrl: 'https://learn.microsoft.com/en-us/linkedin/',
    setupSteps: [
      'Create a LinkedIn Developer app at developer.linkedin.com',
      'Request access to Marketing Developer Platform',
      'Add your redirect URL in Auth settings',
      'Copy Client ID and Client Secret below',
    ],
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    scopes: ['pages_show_list', 'pages_read_engagement', 'read_insights'],
    apiDocsUrl: 'https://developers.facebook.com/docs/graph-api',
    setupSteps: [
      'Create a Meta Developer app at developers.facebook.com',
      'Add Facebook Login product',
      'Add your Page as a test or production asset',
      'Copy App ID and App Secret below',
    ],
  },
  tiktok: {
    authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    scopes: ['user.info.basic', 'video.list', 'video.insights'],
    apiDocsUrl: 'https://developers.tiktok.com/doc/overview',
    setupSteps: [
      'Apply for TikTok Developer account at developers.tiktok.com',
      'Create a new app and request Content Posting API access',
      'Add your redirect domain to the allowlist',
      'Copy Client Key and Client Secret below',
    ],
  },
}
