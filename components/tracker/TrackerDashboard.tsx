'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/react'

import {
  formatLastSynced,
  getConnections,
  syncAllConnected,
} from '../../lib/tracker-connections'
import {
  deleteEntry as apiDeleteEntry,
  fetchEntries,
  seedEntries,
} from '../../lib/tracker-api'
import {
  filterByTime,
  getChartData,
  getPlatformChartData,
  getPlatformSummaries,
  todayISO,
} from '../../lib/tracker-storage'
import type { DailyEntry, Platform, PlatformConnection, TimeFilter } from '../../types/tracker'
import { PLATFORMS } from '../../types/tracker'
import { ConnectAccountsModal } from './ConnectAccountsModal'
import { ManualEntryModal } from './ManualEntryModal'
import { PlatformBarChart, TrendChart } from './MetricsChart'
import { SummaryCard } from './SummaryCard'

// ─── Platform mini-card ───────────────────────────────────────────────────────

function PlatformCard({ summary }: { summary: ReturnType<typeof getPlatformSummaries>[0] }) {
  const meta = PLATFORMS[summary.platform]
  const m = summary.metrics
  return (
    <Box
      bg="rgba(255,255,255,0.07)"
      backdropFilter="blur(16px)"
      borderRadius="xl"
      border="1px solid"
      borderColor="rgba(255,255,255,0.12)"
      p={4}
      position="relative"
      overflow="hidden"
      _hover={{ borderColor: `${meta.color}55`, transform: 'translateY(-2px)', bg: 'rgba(255,255,255,0.1)' }}
      transition="all 0.2s"
    >
      <Box
        position="absolute"
        bottom="-24px"
        right="-24px"
        w="72px"
        h="72px"
        borderRadius="full"
        bg={meta.color}
        opacity={0.08}
        filter="blur(18px)"
        pointerEvents="none"
      />
      <Flex align="center" gap={3} mb={3}>
        <Box
          w="32px"
          h="32px"
          borderRadius="md"
          bg={`${meta.color}22`}
          border="1px solid"
          borderColor={`${meta.color}44`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="sm"
          flexShrink={0}
        >
          {meta.icon}
        </Box>
        <Box>
          <Text color="white" fontWeight="700" fontSize="sm">{meta.label}</Text>
          <Text color="whiteAlpha.400" fontSize="xs">{summary.entryCount} days logged</Text>
        </Box>
      </Flex>
      <Grid templateColumns="1fr 1fr" gap={2}>
        {(
          [
            ['impressions', 'Impressions'],
            ['views', 'Views'],
            ['likes', 'Likes'],
            ['comments', 'Comments'],
          ] as const
        ).map(([key, label]) => (
          <Box key={key}>
            <Text color="whiteAlpha.400" fontSize="9px" fontWeight="600" letterSpacing="wider" textTransform="uppercase">
              {label}
            </Text>
            <Text color="white" fontWeight="700" fontSize="sm">
              {m[key].toLocaleString()}
            </Text>
          </Box>
        ))}
      </Grid>
    </Box>
  )
}

// ─── Time filter pill ─────────────────────────────────────────────────────────

const TIME_FILTERS: { key: TimeFilter; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: '7 Days' },
  { key: 'month', label: '30 Days' },
  { key: '3months', label: '90 Days' },
  { key: 'all', label: 'All Time' },
]

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function TrackerDashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const connectDisclosure = useDisclosure()
  const { data: session } = useSession()
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [connections, setConnections] = useState<Record<Platform, PlatformConnection>>(
    {} as Record<Platform, PlatformConnection>,
  )
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<TimeFilter>('month')
  const [editEntry, setEditEntry] = useState<DailyEntry | null>(null)
  const [page, setPage] = useState(0)
  const [syncingAll, setSyncingAll] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<string | undefined>()
  const PAGE_SIZE = 10

  const reload = useCallback(async () => {
    try {
      const data = await fetchEntries()
      setEntries(data)
      setConnections(getConnections())
    } catch {
      // silently keep previous data on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    seedEntries().then(() => reload())
  }, [reload])

  const numConnected = Object.values(connections).filter(
    (c) => c && c.mode !== 'disconnected',
  ).length

  async function handleSyncAll() {
    if (numConnected === 0) return
    setSyncingAll(true)
    await syncAllConnected()
    setLastSyncTime(new Date().toISOString())
    setSyncingAll(false)
    reload()
  }

  // Derived data
  const filtered = filterByTime(entries, filter)
  const prevFilter: TimeFilter = filter === 'today' ? 'today' : filter === 'week' ? 'week' : filter === 'month' ? 'month' : '3months'

  // Aggregate totals
  const totals = filtered.reduce(
    (acc, e) => ({
      impressions: acc.impressions + e.impressions,
      views: acc.views + e.views,
      likes: acc.likes + e.likes,
      comments: acc.comments + e.comments,
      shares: acc.shares + e.shares,
      followersGained: acc.followersGained + e.followersGained,
    }),
    { impressions: 0, views: 0, likes: 0, comments: 0, shares: 0, followersGained: 0 },
  )

  const platformSummaries = getPlatformSummaries(entries, filter)
  const chartData = getChartData(entries, filter)
  const platformBarData = getPlatformChartData(entries, filter)

  // Table data — sorted newest first
  const tableEntries = [...filtered].sort((a, b) => b.date.localeCompare(a.date))
  const pageEntries = tableEntries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(tableEntries.length / PAGE_SIZE)

  function handleEdit(entry: DailyEntry) {
    setEditEntry(entry)
    onOpen()
  }

  async function handleDelete(id: string) {
    await apiDeleteEntry(id)
    reload()
  }

  function handleModalClose() {
    setEditEntry(null)
    onClose()
  }

  const engagementRate =
    totals.impressions > 0
      ? (((totals.likes + totals.comments + totals.shares) / totals.impressions) * 100).toFixed(2)
      : '0.00'

  return (
    <Box
      minH="100vh"
      color="white"
      position="relative"
      style={{
        background: `
          radial-gradient(ellipse at 50% 105%, rgba(2, 8, 22, 0.97) 0%, rgba(6, 18, 48, 0.75) 38%, transparent 65%),
          linear-gradient(to bottom, #c4e0f0 0%, #68afd6 22%, #2670a8 48%, #0b2d58 74%, #040e1c 100%)
        `,
      }}
    >
      {/* Header */}
      <Box
        bg="rgba(255,255,255,0.06)"
        backdropFilter="blur(20px)"
        borderBottom="1px solid"
        borderColor="rgba(255,255,255,0.1)"
        px={{ base: 4, md: 8 }}
        py={4}
        position="sticky"
        top={0}
        zIndex={10}
        style={{ boxShadow: '0 1px 24px rgba(0,0,0,0.2)' }}
      >
        <Flex justify="space-between" align="center" maxW="1400px" mx="auto">
          <Flex align="center" gap={3}>
            <Box
              w="36px"
              h="36px"
              borderRadius="lg"
              bgGradient="linear(to-br, blue.500, purple.500)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="lg"
            >
              📊
            </Box>
            <Box>
              <Text fontWeight="800" fontSize="lg" color="white" letterSpacing="-0.3px">
                Content Tracker
              </Text>
              <Text color="whiteAlpha.500" fontSize="xs">
                Organic performance across all platforms
              </Text>
            </Box>
          </Flex>

          {/* User menu */}
          {session?.user && (
            <Menu>
              <MenuButton>
                <Flex align="center" gap={2} cursor="pointer" _hover={{ opacity: 0.8 }}>
                  <Avatar
                    size="sm"
                    name={session.user.name ?? session.user.email ?? 'U'}
                    src={session.user.image ?? undefined}
                    bg="blue.500"
                  />
                  <Box display={{ base: 'none', md: 'block' }}>
                    <Text color="white" fontSize="xs" fontWeight="600" lineHeight="1.2">
                      {session.user.name ?? 'Account'}
                    </Text>
                    <Text color="whiteAlpha.500" fontSize="10px">{session.user.email}</Text>
                  </Box>
                </Flex>
              </MenuButton>
              <MenuList bg="gray.800" border="1px solid" borderColor="whiteAlpha.200" minW="160px">
                <MenuItem
                  bg="transparent"
                  color="red.400"
                  _hover={{ bg: 'red.900' }}
                  fontSize="sm"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          )}

          <Flex align="center" gap={2} flexWrap="wrap">
            {/* Sync all button — only when connected */}
            {numConnected > 0 && (
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
                title={lastSyncTime ? `Last sync: ${formatLastSynced(lastSyncTime)}` : 'Sync now'}
              >
                ↻ Sync {numConnected} platform{numConnected > 1 ? 's' : ''}
              </Button>
            )}

            {/* Connect accounts button */}
            <Button
              size="sm"
              variant="ghost"
              color={numConnected > 0 ? 'green.400' : 'whiteAlpha.600'}
              border="1px solid"
              borderColor={numConnected > 0 ? 'green.800' : 'whiteAlpha.200'}
              bg={numConnected > 0 ? 'green.900' : 'transparent'}
              _hover={{ bg: numConnected > 0 ? 'green.800' : 'whiteAlpha.100' }}
              onClick={connectDisclosure.onOpen}
              borderRadius="lg"
            >
              {numConnected > 0 ? `● ${numConnected} Connected` : '⊕ Connect Accounts'}
            </Button>

            <Button
              size="sm"
              bg="blue.500"
              color="white"
              _hover={{ bg: 'blue.400' }}
              borderRadius="lg"
              onClick={() => { setEditEntry(null); onOpen() }}
              fontWeight="600"
            >
              + Add Entry
            </Button>
          </Flex>
        </Flex>
      </Box>

      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} py={6}>
        {loading && (
          <Flex justify="center" align="center" h="40vh">
            <Spinner size="xl" color="blue.400" thickness="3px" />
          </Flex>
        )}
        {!loading && (<>
        {/* Time filter */}
        <Flex gap={2} mb={6} flexWrap="wrap">
          {TIME_FILTERS.map((tf) => (
            <Button
              key={tf.key}
              size="sm"
              onClick={() => { setFilter(tf.key); setPage(0) }}
              variant={filter === tf.key ? 'solid' : 'ghost'}
              bg={filter === tf.key ? 'blue.500' : 'transparent'}
              color={filter === tf.key ? 'white' : 'whiteAlpha.600'}
              _hover={{ bg: filter === tf.key ? 'blue.400' : 'whiteAlpha.100' }}
              borderRadius="full"
              fontWeight="600"
              border="1px solid"
              borderColor={filter === tf.key ? 'blue.500' : 'whiteAlpha.100'}
            >
              {tf.label}
            </Button>
          ))}
          <Box ml="auto">
            <Text color="whiteAlpha.500" fontSize="xs" alignSelf="center">
              {filtered.length} entries · Engagement rate:{' '}
              <Text as="span" color="blue.400" fontWeight="700">{engagementRate}%</Text>
            </Text>
          </Box>
        </Flex>

        {/* Summary cards */}
        <Grid templateColumns={{ base: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }} gap={4} mb={6}>
          <SummaryCard label="Impressions" value={totals.impressions} icon="👁" color="#60a5fa" />
          <SummaryCard label="Views" value={totals.views} icon="▶" color="#34d399" />
          <SummaryCard label="Likes" value={totals.likes} icon="♥" color="#f472b6" />
          <SummaryCard label="Comments" value={totals.comments} icon="💬" color="#fb923c" />
          <SummaryCard label="Shares" value={totals.shares} icon="↗" color="#a78bfa" />
          <SummaryCard label="Followers +" value={totals.followersGained} icon="👤" color="#facc15" />
        </Grid>

        {/* Charts row */}
        <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={4} mb={6}>
          <TrendChart data={chartData} />
          <PlatformBarChart data={platformBarData} />
        </Grid>

        {/* Platform cards */}
        <Text color="white" fontWeight="700" fontSize="md" mb={3}>
          Platform Breakdown
        </Text>
        <Grid templateColumns={{ base: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }} gap={4} mb={8}>
          {platformSummaries.map((s) => (
            <PlatformCard key={s.platform} summary={s} />
          ))}
        </Grid>

        {/* Log table */}
        <Box bg="rgba(255,255,255,0.05)" backdropFilter="blur(16px)" borderRadius="xl" border="1px solid" borderColor="rgba(255,255,255,0.1)" overflow="hidden">
          <Flex justify="space-between" align="center" px={5} py={4} borderBottom="1px solid" borderColor="whiteAlpha.100">
            <Box>
              <Text color="white" fontWeight="700" fontSize="md">Entry Log</Text>
              <Text color="whiteAlpha.500" fontSize="xs">{filtered.length} entries in selected period</Text>
            </Box>
          </Flex>

          <Box overflowX="auto">
            <Table variant="unstyled" size="sm">
              <Thead>
                <Tr>
                  {['Date', 'Platform', 'Impressions', 'Views', 'Likes', 'Comments', 'Shares', 'Saves', 'Followers+', 'Notes', ''].map(
                    (h) => (
                      <Th
                        key={h}
                        color="whiteAlpha.400"
                        fontSize="9px"
                        fontWeight="700"
                        letterSpacing="wider"
                        textTransform="uppercase"
                        py={3}
                        px={4}
                        borderBottom="1px solid"
                        borderColor="whiteAlpha.100"
                      >
                        {h}
                      </Th>
                    ),
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {pageEntries.length === 0 ? (
                  <Tr>
                    <Td colSpan={11} textAlign="center" py={12} color="whiteAlpha.400" fontSize="sm">
                      No entries yet. Click &quot;+ Add Entry&quot; to get started.
                    </Td>
                  </Tr>
                ) : (
                  pageEntries.map((entry) => {
                    const meta = PLATFORMS[entry.platform]
                    return (
                      <Tr
                        key={entry.id}
                        _hover={{ bg: 'whiteAlpha.50' }}
                        borderBottom="1px solid"
                        borderColor="whiteAlpha.50"
                      >
                        <Td px={4} py={3} color="whiteAlpha.700" fontSize="xs" whiteSpace="nowrap">
                          {entry.date}
                          {entry.date === todayISO() && (
                            <Badge ml={2} colorScheme="blue" fontSize="8px" borderRadius="full">today</Badge>
                          )}
                        </Td>
                        <Td px={4} py={3}>
                          <Flex align="center" gap={2}>
                            <Box
                              w="20px"
                              h="20px"
                              borderRadius="sm"
                              bg={`${meta.color}22`}
                              border="1px solid"
                              borderColor={`${meta.color}44`}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontSize="9px"
                              flexShrink={0}
                            >
                              {meta.icon}
                            </Box>
                            <Text color="white" fontSize="xs" fontWeight="600">{meta.label}</Text>
                          </Flex>
                        </Td>
                        {([
                          entry.impressions,
                          entry.views,
                          entry.likes,
                          entry.comments,
                          entry.shares,
                          entry.saves,
                          entry.followersGained,
                        ] as number[]).map((val, i) => (
                          <Td key={i} px={4} py={3} color="white" fontSize="xs" fontWeight="600" isNumeric>
                            {val.toLocaleString()}
                          </Td>
                        ))}
                        <Td px={4} py={3} color="whiteAlpha.500" fontSize="xs" maxW="140px">
                          <Text noOfLines={1}>{entry.notes || '—'}</Text>
                        </Td>
                        <Td px={4} py={3}>
                          <Flex gap={1}>
                            <Button
                              size="xs"
                              variant="ghost"
                              color="whiteAlpha.500"
                              _hover={{ color: 'blue.400', bg: 'blue.900' }}
                              onClick={() => handleEdit(entry)}
                              borderRadius="md"
                            >
                              Edit
                            </Button>
                            <Button
                              size="xs"
                              variant="ghost"
                              color="whiteAlpha.300"
                              _hover={{ color: 'red.400', bg: 'red.900' }}
                              onClick={() => handleDelete(entry.id)}
                              borderRadius="md"
                            >
                              ×
                            </Button>
                          </Flex>
                        </Td>
                      </Tr>
                    )
                  })
                )}
              </Tbody>
            </Table>
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Flex justify="space-between" align="center" px={5} py={3} borderTop="1px solid" borderColor="whiteAlpha.100">
              <Text color="whiteAlpha.500" fontSize="xs">
                Page {page + 1} of {totalPages} · {filtered.length} total entries
              </Text>
              <Flex gap={2}>
                <Button
                  size="xs"
                  variant="ghost"
                  color="whiteAlpha.600"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  isDisabled={page === 0}
                  borderRadius="md"
                >
                  ← Prev
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  color="whiteAlpha.600"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  isDisabled={page >= totalPages - 1}
                  borderRadius="md"
                >
                  Next →
                </Button>
              </Flex>
            </Flex>
          )}
        </Box>
        </>)}
      </Box>

      <ManualEntryModal
        isOpen={isOpen}
        onClose={handleModalClose}
        onSaved={reload}
        editEntry={editEntry}
      />

      <ConnectAccountsModal
        isOpen={connectDisclosure.isOpen}
        onClose={connectDisclosure.onClose}
        onChanged={reload}
      />
    </Box>
  )
}
