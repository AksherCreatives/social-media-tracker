'use client'

import { SaasProvider } from '@saas-ui/react'
import { SessionProvider } from 'next-auth/react'

import { theme } from '#theme'

export function Provider(props: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SaasProvider theme={theme}>{props.children}</SaasProvider>
    </SessionProvider>
  )
}
