'use client'

import { useState } from 'react'

import { Box, Button, ButtonGroup, Flex, Text } from '@chakra-ui/react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatNumber } from '../../lib/tracker-storage'
import type { ChartDataPoint, Platform } from '../../types/tracker'
import { PLATFORMS } from '../../types/tracker'

// ─── Trend Line Chart ─────────────────────────────────────────────────────────

interface TrendChartProps {
  data: ChartDataPoint[]
}

const TREND_LINES = [
  { key: 'impressions', color: '#60a5fa', label: 'Impressions' },
  { key: 'views', color: '#34d399', label: 'Views' },
  { key: 'likes', color: '#f472b6', label: 'Likes' },
  { key: 'comments', color: '#fb923c', label: 'Comments' },
]

function formatXAxis(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <Box
      bg="rgba(10,25,60,0.85)"
      backdropFilter="blur(12px)"
      border="1px solid"
      borderColor="rgba(255,255,255,0.15)"
      borderRadius="lg"
      p={3}
      minW="160px"
    >
      <Text color="whiteAlpha.600" fontSize="xs" mb={2}>
        {formatXAxis(label)}
      </Text>
      {payload.map((entry: any) => (
        <Flex key={entry.dataKey} justify="space-between" gap={4} mb={1}>
          <Text fontSize="xs" color={entry.color}>
            {entry.name}
          </Text>
          <Text fontSize="xs" color="white" fontWeight="600">
            {formatNumber(entry.value)}
          </Text>
        </Flex>
      ))}
    </Box>
  )
}

export function TrendChart({ data }: TrendChartProps) {
  const [active, setActive] = useState<string[]>(['impressions', 'views'])

  function toggle(key: string) {
    setActive((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )
  }

  return (
    <Box bg="rgba(255,255,255,0.06)" backdropFilter="blur(16px)" borderRadius="xl" border="1px solid" borderColor="rgba(255,255,255,0.11)" p={5} style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Text color="white" fontWeight="700" fontSize="md">
            Performance Over Time
          </Text>
          <Text color="whiteAlpha.500" fontSize="xs" mt={0.5}>
            Daily aggregated across all platforms
          </Text>
        </Box>
        <Flex gap={2} flexWrap="wrap">
          {TREND_LINES.map((l) => (
            <Button
              key={l.key}
              size="xs"
              onClick={() => toggle(l.key)}
              variant={active.includes(l.key) ? 'solid' : 'ghost'}
              bg={active.includes(l.key) ? `${l.color}22` : 'transparent'}
              color={active.includes(l.key) ? l.color : 'whiteAlpha.400'}
              border="1px solid"
              borderColor={active.includes(l.key) ? `${l.color}55` : 'whiteAlpha.100'}
              _hover={{ borderColor: `${l.color}55`, color: l.color }}
              borderRadius="full"
              px={3}
            >
              {l.label}
            </Button>
          ))}
        </Flex>
      </Flex>

      {data.length === 0 ? (
        <Flex h="220px" align="center" justify="center">
          <Text color="whiteAlpha.400" fontSize="sm">
            No data for this period
          </Text>
        </Flex>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={formatNumber}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} />
            {TREND_LINES.filter((l) => active.includes(l.key)).map((l) => (
              <Line
                key={l.key}
                type="monotone"
                dataKey={l.key}
                name={l.label}
                stroke={l.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  )
}

// ─── Platform Bar Chart ───────────────────────────────────────────────────────

interface PlatformChartProps {
  data: { platform: string; impressions: number; views: number; likes: number; comments: number }[]
}

const PlatformTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const meta = PLATFORMS[label as Platform]
  return (
    <Box
      bg="rgba(10,25,60,0.85)"
      backdropFilter="blur(12px)"
      border="1px solid"
      borderColor="rgba(255,255,255,0.15)"
      borderRadius="lg"
      p={3}
      minW="160px"
    >
      <Text color="white" fontSize="xs" fontWeight="700" mb={2}>
        {meta?.label ?? label}
      </Text>
      {payload.map((entry: any) => (
        <Flex key={entry.dataKey} justify="space-between" gap={4} mb={1}>
          <Text fontSize="xs" color={entry.fill}>
            {entry.name}
          </Text>
          <Text fontSize="xs" color="white" fontWeight="600">
            {formatNumber(entry.value)}
          </Text>
        </Flex>
      ))}
    </Box>
  )
}

export function PlatformBarChart({ data }: PlatformChartProps) {
  const [metric, setMetric] = useState<'impressions' | 'views' | 'likes' | 'comments'>(
    'impressions',
  )

  const metricColor: Record<string, string> = {
    impressions: '#60a5fa',
    views: '#34d399',
    likes: '#f472b6',
    comments: '#fb923c',
  }

  const enriched = data.map((d) => ({
    ...d,
    fill: PLATFORMS[d.platform as Platform]?.color ?? '#888',
    label: PLATFORMS[d.platform as Platform]?.label ?? d.platform,
  }))

  return (
    <Box bg="rgba(255,255,255,0.06)" backdropFilter="blur(16px)" borderRadius="xl" border="1px solid" borderColor="rgba(255,255,255,0.11)" p={5} style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Text color="white" fontWeight="700" fontSize="md">
            Platform Breakdown
          </Text>
          <Text color="whiteAlpha.500" fontSize="xs" mt={0.5}>
            Compare across all channels
          </Text>
        </Box>
        <ButtonGroup size="xs" isAttached variant="outline">
          {(['impressions', 'views', 'likes', 'comments'] as const).map((m) => (
            <Button
              key={m}
              onClick={() => setMetric(m)}
              bg={metric === m ? `${metricColor[m]}22` : 'transparent'}
              color={metric === m ? metricColor[m] : 'whiteAlpha.500'}
              borderColor={metric === m ? `${metricColor[m]}55` : 'whiteAlpha.100'}
              _hover={{ color: metricColor[m], borderColor: `${metricColor[m]}55` }}
              textTransform="capitalize"
            >
              {m}
            </Button>
          ))}
        </ButtonGroup>
      </Flex>

      {data.length === 0 ? (
        <Flex h="220px" align="center" justify="center">
          <Text color="whiteAlpha.400" fontSize="sm">
            No data for this period
          </Text>
        </Flex>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={enriched} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatNumber}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip content={<PlatformTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar
              dataKey={metric}
              name={metric.charAt(0).toUpperCase() + metric.slice(1)}
              radius={[6, 6, 0, 0]}
              maxBarSize={52}
            >
              {enriched.map((entry) => (
                <rect key={entry.platform} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  )
}
