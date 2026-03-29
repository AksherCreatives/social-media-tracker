'use client'

import {
  Box,
  Flex,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react'

import { formatNumber } from '../../lib/tracker-storage'

interface SummaryCardProps {
  label: string
  value: number
  prevValue?: number
  icon: string
  color: string
}

export function SummaryCard({ label, value, prevValue, icon, color }: SummaryCardProps) {
  const pct =
    prevValue != null && prevValue > 0
      ? Math.round(((value - prevValue) / prevValue) * 100)
      : null

  return (
    <Box
      bg="rgba(255,255,255,0.07)"
      backdropFilter="blur(16px)"
      borderRadius="xl"
      border="1px solid"
      borderColor="rgba(255,255,255,0.12)"
      p={5}
      position="relative"
      overflow="hidden"
      _hover={{ borderColor: 'rgba(255,255,255,0.28)', transform: 'translateY(-2px)', bg: 'rgba(255,255,255,0.1)' }}
      transition="all 0.2s"
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
    >
      {/* Glow blob */}
      <Box
        position="absolute"
        top="-20px"
        right="-20px"
        w="80px"
        h="80px"
        borderRadius="full"
        bg={color}
        opacity={0.12}
        filter="blur(20px)"
        pointerEvents="none"
      />

      <Flex justify="space-between" align="flex-start">
        <Stat>
          <StatLabel color="whiteAlpha.600" fontSize="xs" fontWeight="500" letterSpacing="wider" textTransform="uppercase">
            {label}
          </StatLabel>
          <StatNumber
            fontSize="2xl"
            fontWeight="700"
            color="white"
            mt={1}
            letterSpacing="-0.5px"
          >
            {formatNumber(value)}
          </StatNumber>
          {pct !== null && (
            <StatHelpText mb={0} mt={1}>
              <StatArrow type={pct >= 0 ? 'increase' : 'decrease'} />
              <Text as="span" fontSize="xs" color={pct >= 0 ? 'green.400' : 'red.400'}>
                {Math.abs(pct)}% vs prev period
              </Text>
            </StatHelpText>
          )}
        </Stat>

        <Box
          w="38px"
          h="38px"
          borderRadius="lg"
          bg={`${color}22`}
          border="1px solid"
          borderColor={`${color}44`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="lg"
          flexShrink={0}
        >
          {icon}
        </Box>
      </Flex>
    </Box>
  )
}
