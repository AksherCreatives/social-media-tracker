'use client'

import { useState } from 'react'

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Mode = 'signin' | 'signup'

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const toast = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error); return }

        toast({ title: 'Account created! Signing you in…', status: 'success', duration: 2000, position: 'top' })
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/tracker',
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/tracker')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    await signIn('google', { callbackUrl: '/tracker' })
  }

  const googleEnabled = true // always show; NextAuth hides it if not configured

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      position="relative"
      style={{
        background: `
          radial-gradient(ellipse at 50% 105%, rgba(2, 8, 22, 0.97) 0%, rgba(6, 18, 48, 0.75) 38%, transparent 65%),
          linear-gradient(to bottom, #c4e0f0 0%, #68afd6 22%, #2670a8 48%, #0b2d58 74%, #040e1c 100%)
        `,
      }}
    >
      {/* Subtle noise texture overlay */}
      <Box
        position="fixed"
        inset={0}
        opacity={0.025}
        pointerEvents="none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <Box w="full" maxW="420px">
        {/* Brand */}
        <Flex direction="column" align="center" mb={8}>
          <Box
            w="52px"
            h="52px"
            borderRadius="xl"
            bgGradient="linear(to-br, blue.500, purple.600)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="2xl"
            mb={4}
            boxShadow="0 0 32px rgba(99,102,241,0.4)"
          >
            📊
          </Box>
          <Text color="white" fontWeight="800" fontSize="2xl" letterSpacing="-0.5px">
            Content Tracker
          </Text>
          <Text color="whiteAlpha.500" fontSize="sm" mt={1}>
            {mode === 'signin' ? 'Sign in to your account' : 'Create your free account'}
          </Text>
        </Flex>

        {/* Card */}
        <Box
          bg="rgba(255,255,255,0.06)"
          backdropFilter="blur(24px)"
          border="1px solid"
          borderColor="rgba(255,255,255,0.12)"
          borderRadius="2xl"
          p={8}
          boxShadow="0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
        >
          {/* Google button */}
          <Button
            w="full"
            variant="outline"
            borderColor="rgba(255,255,255,0.18)"
            color="white"
            bg="rgba(255,255,255,0.08)"
            _hover={{ bg: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.3)' }}
            onClick={handleGoogle}
            isLoading={googleLoading}
            loadingText="Redirecting…"
            borderRadius="xl"
            size="lg"
            leftIcon={
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            }
          >
            Continue with Google
          </Button>

          <Flex align="center" my={6} gap={3}>
            <Divider borderColor="whiteAlpha.100" />
            <Text color="whiteAlpha.400" fontSize="xs" whiteSpace="nowrap" flexShrink={0}>
              or with email
            </Text>
            <Divider borderColor="whiteAlpha.100" />
          </Flex>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap={4}>
              {mode === 'signup' && (
                <FormControl>
                  <FormLabel color="whiteAlpha.600" fontSize="xs" fontWeight="700" letterSpacing="wider" textTransform="uppercase">
                    Name
                  </FormLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    bg="rgba(255,255,255,0.07)"
                    border="1px solid"
                    borderColor="rgba(255,255,255,0.15)"
                    color="white"
                    _placeholder={{ color: 'rgba(255,255,255,0.3)' }}
                    _focus={{ borderColor: 'rgba(100,180,255,0.7)', boxShadow: '0 0 0 1px rgba(100,180,255,0.3)' }}
                    _hover={{ borderColor: 'rgba(255,255,255,0.3)' }}
                    borderRadius="xl"
                    size="lg"
                  />
                </FormControl>
              )}

              <FormControl isRequired>
                <FormLabel color="whiteAlpha.600" fontSize="xs" fontWeight="700" letterSpacing="wider" textTransform="uppercase">
                  Email
                </FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  bg="gray.800"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  color="white"
                  _placeholder={{ color: 'whiteAlpha.300' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: 'none' }}
                  _hover={{ borderColor: 'whiteAlpha.400' }}
                  borderRadius="xl"
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="whiteAlpha.600" fontSize="xs" fontWeight="700" letterSpacing="wider" textTransform="uppercase">
                  Password
                </FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
                  bg="gray.800"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  color="white"
                  _placeholder={{ color: 'whiteAlpha.300' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: 'none' }}
                  _hover={{ borderColor: 'whiteAlpha.400' }}
                  borderRadius="xl"
                  size="lg"
                />
              </FormControl>

              {error && (
                <Alert status="error" bg="red.900" border="1px solid" borderColor="red.700" borderRadius="xl">
                  <AlertIcon color="red.400" />
                  <AlertDescription color="red.200" fontSize="sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                bg="rgba(37,99,235,0.9)"
                color="white"
                _hover={{ bg: 'rgba(59,130,246,0.95)' }}
                boxShadow="0 4px 20px rgba(37,99,235,0.4)"
                isLoading={loading}
                loadingText={mode === 'signup' ? 'Creating account…' : 'Signing in…'}
                size="lg"
                borderRadius="xl"
                fontWeight="700"
                mt={2}
              >
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>
            </Flex>
          </form>

          <Flex justify="center" mt={6} gap={1}>
            <Text color="whiteAlpha.500" fontSize="sm">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            </Text>
            <Button
              variant="link"
              color="blue.400"
              fontSize="sm"
              fontWeight="600"
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
              _hover={{ color: 'blue.300' }}
            >
              {mode === 'signin' ? 'Sign up free' : 'Sign in'}
            </Button>
          </Flex>
        </Box>

        <Text color="whiteAlpha.300" fontSize="xs" textAlign="center" mt={6}>
          Your data is stored securely and never shared.
        </Text>
      </Box>
    </Box>
  )
}
