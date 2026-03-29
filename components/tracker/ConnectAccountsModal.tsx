'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from '@chakra-ui/react'

import {
  connectDemo,
  connectLive,
  disconnectPlatform,
  formatLastSynced,
  getConnections,
  syncPlatform,
} from '../../lib/tracker-connections'
import type { Platform, PlatformConnection } from '../../types/tracker'
import { PLATFORM_OAUTH, PLATFORMS } from '../../types/tracker'

interface Props {
  isOpen: boolean
  onClose: () => void
  onChanged: () => void
}

// ─── Single platform connection card ─────────────────────────────────────────

function PlatformConnectCard({
  platform,
  connection,
  onChanged,
}: {
  platform: Platform
  connection: PlatformConnection
  onChanged: () => void
}) {
  const meta = PLATFORMS[platform]
  const oauth = PLATFORM_OAUTH[platform]
  const toast = useToast()

  const [expanded, setExpanded] = useState(false)
  const [accessToken, setAccessToken] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [connecting, setConnecting] = useState(false)

  const isConnected = connection.mode !== 'disconnected'

  async function handleDemoConnect() {
    setConnecting(true)
    await new Promise((r) => setTimeout(r, 600)) // simulate auth delay
    connectDemo(platform)
    toast({
      title: `${meta.label} connected (demo)`,
      status: 'success',
      duration: 2000,
      position: 'top-right',
    })
    setConnecting(false)
    setExpanded(false)
    onChanged()
  }

  async function handleLiveConnect() {
    if (!accessToken.trim()) return
    setConnecting(true)
    await new Promise((r) => setTimeout(r, 800))
    connectLive(platform, { accessToken: accessToken.trim() })
    toast({
      title: `${meta.label} connected (live)`,
      description: 'Access token saved. Real API sync will fetch today\'s metrics.',
      status: 'success',
      duration: 3000,
      position: 'top-right',
    })
    setConnecting(false)
    setExpanded(false)
    setAccessToken('')
    onChanged()
  }

  async function handleSync() {
    setSyncing(true)
    const result = await syncPlatform(platform)
    setSyncing(false)
    if (result.success) {
      toast({
        title: `${meta.label} synced`,
        status: 'success',
        duration: 1500,
        position: 'top-right',
      })
    } else {
      toast({ title: result.error, status: 'error', duration: 2000, position: 'top-right' })
    }
    onChanged()
  }

  function handleDisconnect() {
    disconnectPlatform(platform)
    toast({
      title: `${meta.label} disconnected`,
      status: 'info',
      duration: 1500,
      position: 'top-right',
    })
    onChanged()
  }

  return (
    <Box
      bg="gray.800"
      borderRadius="xl"
      border="1px solid"
      borderColor={isConnected ? `${meta.color}44` : 'whiteAlpha.100'}
      overflow="hidden"
      transition="border-color 0.2s"
    >
      {/* Header row */}
      <Flex align="center" gap={3} p={4}>
        <Box
          w="40px"
          h="40px"
          borderRadius="lg"
          bg={`${meta.color}22`}
          border="1px solid"
          borderColor={`${meta.color}44`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="lg"
          flexShrink={0}
        >
          {meta.icon}
        </Box>

        <Box flex={1} minW={0}>
          <Flex align="center" gap={2}>
            <Text color="white" fontWeight="700" fontSize="sm">
              {meta.label}
            </Text>
            {isConnected && (
              <Badge
                colorScheme={connection.mode === 'live' ? 'green' : 'purple'}
                fontSize="9px"
                borderRadius="full"
                px={2}
                variant="subtle"
              >
                {connection.mode === 'live' ? '● Live' : '◆ Demo'}
              </Badge>
            )}
          </Flex>

          {isConnected ? (
            <Flex align="center" gap={2} mt={0.5}>
              <Text color="whiteAlpha.500" fontSize="xs">
                {connection.profileHandle ?? connection.profileName ?? 'Connected'}
              </Text>
              {connection.followerCount && (
                <>
                  <Text color="whiteAlpha.300" fontSize="xs">·</Text>
                  <Text color="whiteAlpha.500" fontSize="xs">
                    {connection.followerCount.toLocaleString()} followers
                  </Text>
                </>
              )}
              <Text color="whiteAlpha.300" fontSize="xs">·</Text>
              <Text color="whiteAlpha.400" fontSize="xs">
                Synced {formatLastSynced(connection.lastSyncedAt)}
              </Text>
            </Flex>
          ) : (
            <Text color="whiteAlpha.400" fontSize="xs" mt={0.5}>
              Not connected
            </Text>
          )}
        </Box>

        {/* Actions */}
        <Flex gap={2} flexShrink={0}>
          {isConnected ? (
            <>
              <Button
                size="xs"
                variant="ghost"
                color="whiteAlpha.600"
                _hover={{ bg: 'blue.900', color: 'blue.300' }}
                onClick={handleSync}
                isLoading={syncing}
                borderRadius="md"
                leftIcon={syncing ? undefined : <span>↻</span>}
              >
                Sync
              </Button>
              <Button
                size="xs"
                variant="ghost"
                color="whiteAlpha.400"
                _hover={{ bg: 'red.900', color: 'red.400' }}
                onClick={handleDisconnect}
                borderRadius="md"
              >
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              size="xs"
              bg={`${meta.color}22`}
              color={meta.color}
              border="1px solid"
              borderColor={`${meta.color}44`}
              _hover={{ bg: `${meta.color}33` }}
              onClick={() => setExpanded((v) => !v)}
              borderRadius="md"
              px={3}
            >
              {expanded ? 'Cancel' : 'Connect'}
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Connect panel */}
      <Collapse in={expanded} animateOpacity>
        <Box borderTop="1px solid" borderColor="whiteAlpha.100" p={4}>
          <Tabs variant="unstyled" size="sm">
            <TabList gap={2} mb={4}>
              {(['Demo', 'Live API'] as const).map((label) => (
                <Tab
                  key={label}
                  borderRadius="full"
                  px={4}
                  py={1}
                  fontSize="xs"
                  fontWeight="600"
                  color="whiteAlpha.500"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  _selected={{
                    bg: label === 'Demo' ? 'purple.900' : 'blue.900',
                    color: label === 'Demo' ? 'purple.300' : 'blue.300',
                    borderColor: label === 'Demo' ? 'purple.600' : 'blue.600',
                  }}
                >
                  {label}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {/* Demo tab */}
              <TabPanel p={0}>
                <Alert
                  status="info"
                  bg="blue.900"
                  border="1px solid"
                  borderColor="blue.700"
                  borderRadius="lg"
                  mb={3}
                >
                  <AlertIcon color="blue.300" />
                  <AlertDescription color="blue.200" fontSize="xs">
                    Demo mode connects instantly and auto-generates realistic metrics each time
                    you sync. Perfect for testing the dashboard.
                  </AlertDescription>
                </Alert>
                <Button
                  size="sm"
                  bg="purple.600"
                  color="white"
                  _hover={{ bg: 'purple.500' }}
                  onClick={handleDemoConnect}
                  isLoading={connecting}
                  loadingText="Connecting…"
                  borderRadius="lg"
                  w="full"
                >
                  Connect {meta.label} (Demo)
                </Button>
              </TabPanel>

              {/* Live API tab */}
              <TabPanel p={0}>
                <Box
                  bg="gray.900"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  p={3}
                  mb={3}
                >
                  <Text color="whiteAlpha.700" fontSize="xs" fontWeight="700" mb={2}>
                    Setup Steps
                  </Text>
                  {oauth.setupSteps.map((step, i) => (
                    <Flex key={i} gap={2} mb={1.5}>
                      <Box
                        w="18px"
                        h="18px"
                        borderRadius="full"
                        bg={`${meta.color}22`}
                        border="1px solid"
                        borderColor={`${meta.color}44`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="9px"
                        color={meta.color}
                        fontWeight="700"
                        flexShrink={0}
                        mt="1px"
                      >
                        {i + 1}
                      </Box>
                      <Text color="whiteAlpha.600" fontSize="xs">
                        {step}
                      </Text>
                    </Flex>
                  ))}
                  <Link
                    href={oauth.apiDocsUrl}
                    isExternal
                    color="blue.400"
                    fontSize="xs"
                    mt={2}
                    display="block"
                  >
                    View API docs →
                  </Link>
                </Box>

                <FormControl mb={3}>
                  <FormLabel
                    color="whiteAlpha.600"
                    fontSize="xs"
                    fontWeight="700"
                    letterSpacing="wider"
                    textTransform="uppercase"
                  >
                    Access Token
                  </FormLabel>
                  <Input
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="Paste your OAuth access token…"
                    type="password"
                    size="sm"
                    bg="gray.900"
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                    color="white"
                    _placeholder={{ color: 'whiteAlpha.300' }}
                    _focus={{ borderColor: 'blue.400', boxShadow: 'none' }}
                    borderRadius="lg"
                  />
                  <FormHelperText color="whiteAlpha.400" fontSize="xs">
                    Stored locally. For production, use server-side token handling.
                  </FormHelperText>
                </FormControl>

                <Button
                  size="sm"
                  bg="blue.600"
                  color="white"
                  _hover={{ bg: 'blue.500' }}
                  onClick={handleLiveConnect}
                  isLoading={connecting}
                  loadingText="Connecting…"
                  isDisabled={!accessToken.trim()}
                  borderRadius="lg"
                  w="full"
                >
                  Connect {meta.label} (Live)
                </Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Collapse>
    </Box>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function ConnectAccountsModal({ isOpen, onClose, onChanged }: Props) {
  const [connections, setConnections] = useState(getConnections())
  const toast = useToast()
  const [syncingAll, setSyncingAll] = useState(false)

  const reload = useCallback(() => {
    setConnections(getConnections())
    onChanged()
  }, [onChanged])

  useEffect(() => {
    if (isOpen) reload()
  }, [isOpen, reload])

  const platforms: Platform[] = ['youtube', 'instagram', 'x', 'linkedin', 'facebook', 'tiktok']
  const connectedPlatforms = platforms.filter((p) => connections[p].mode !== 'disconnected')

  async function handleSyncAll() {
    if (connectedPlatforms.length === 0) return
    setSyncingAll(true)
    const { syncAllConnected } = await import('../../lib/tracker-connections')
    await syncAllConnected()
    setSyncingAll(false)
    reload()
    toast({
      title: `Synced ${connectedPlatforms.length} platform${connectedPlatforms.length > 1 ? 's' : ''}`,
      status: 'success',
      duration: 2000,
      position: 'top-right',
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.700" />
      <ModalContent
        bg="gray.900"
        border="1px solid"
        borderColor="whiteAlpha.100"
        borderRadius="2xl"
        maxH="90vh"
      >
        <ModalHeader pb={0}>
          <Flex justify="space-between" align="center">
            <Box>
              <Text color="white" fontWeight="800" fontSize="lg">
                Connected Accounts
              </Text>
              <Text color="whiteAlpha.500" fontSize="xs" mt={0.5}>
                {connectedPlatforms.length} of {platforms.length} platforms connected
              </Text>
            </Box>
            {connectedPlatforms.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                color="blue.400"
                border="1px solid"
                borderColor="blue.800"
                bg="blue.900"
                _hover={{ bg: 'blue.800' }}
                onClick={handleSyncAll}
                isLoading={syncingAll}
                loadingText="Syncing…"
                borderRadius="lg"
                mr={8}
              >
                ↻ Sync All
              </Button>
            )}
          </Flex>

          {/* Connection status pills */}
          <Flex gap={2} mt={3} flexWrap="wrap">
            {platforms.map((p) => {
              const conn = connections[p]
              const meta = PLATFORMS[p]
              const connected = conn.mode !== 'disconnected'
              return (
                <Flex
                  key={p}
                  align="center"
                  gap={1.5}
                  px={2}
                  py={1}
                  borderRadius="full"
                  bg={connected ? `${meta.color}15` : 'whiteAlpha.50'}
                  border="1px solid"
                  borderColor={connected ? `${meta.color}44` : 'whiteAlpha.100'}
                >
                  <Box
                    w="6px"
                    h="6px"
                    borderRadius="full"
                    bg={connected ? meta.color : 'whiteAlpha.300'}
                  />
                  <Text
                    fontSize="10px"
                    fontWeight="600"
                    color={connected ? meta.color : 'whiteAlpha.400'}
                  >
                    {meta.label}
                  </Text>
                </Flex>
              )
            })}
          </Flex>
          <Divider mt={4} borderColor="whiteAlpha.100" />
        </ModalHeader>

        <ModalCloseButton color="whiteAlpha.600" />

        <ModalBody py={4}>
          <Flex direction="column" gap={3}>
            {platforms.map((p) => (
              <PlatformConnectCard
                key={p}
                platform={p}
                connection={connections[p]}
                onChanged={reload}
              />
            ))}
          </Flex>

          <Alert
            status="warning"
            mt={4}
            bg="yellow.900"
            border="1px solid"
            borderColor="yellow.700"
            borderRadius="lg"
          >
            <AlertIcon color="yellow.400" />
            <AlertDescription color="yellow.200" fontSize="xs">
              <Text fontWeight="700" mb={1}>Production Note</Text>
              Live API mode requires a server-side proxy (Next.js API routes) to handle OAuth
              token exchange and API calls securely. Access tokens shown here are stored in
              localStorage for demo purposes only.
            </AlertDescription>
          </Alert>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
