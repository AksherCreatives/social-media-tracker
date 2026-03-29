import {
  Box,
  Circle,
  Container,
  Flex,
  Grid,
  Heading,
  Icon,
  ResponsiveValue,
  SimpleGrid,
  Stack,
  SystemProps,
  Tag,
  Text,
  ThemingProps,
  VStack,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { Section, SectionTitle, SectionTitleProps } from 'components/section'
import { motion, useScroll, useTransform } from 'framer-motion'

import * as React from 'react'

// Create motion components
const MotionVStack = motion(VStack)
const MotionCircle = motion(Circle)
const MotionBox = motion(Box)

const Revealer = ({ children }: any) => {
  return children
}

export interface FeaturesProps
  extends Omit<SectionTitleProps, 'title' | 'variant'>,
    ThemingProps<'Features'> {
  title?: React.ReactNode
  description?: React.ReactNode
  features: Array<FeatureProps>
  columns?: ResponsiveValue<number>
  spacing?: string | number
  aside?: React.ReactChild
  reveal?: React.FC<any>
  iconSize?: SystemProps['boxSize']
  innerWidth?: SystemProps['maxW']
  navigationButtons?: React.ReactNode
}

export interface FeatureProps {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: any
  iconPosition?: 'left' | 'top'
  iconSize?: SystemProps['boxSize']
  ip?: 'left' | 'top'
  variant?: string
  delay?: number
  index?: number
  number?: string
  output?: string
}

export const Feature: React.FC<FeatureProps> = (props) => {
  const {
    title,
    description,
    icon,
    iconSize = 12,
    index = 0,
    number,
    output,
  } = props

  return (
    <Grid
      templateColumns={{ base: '1fr', md: '1fr 1fr' }}
      gap={8}
      p={8}
      bg="white"
      _dark={{ bg: 'gray.900' }}
      rounded="2xl"
      height={{ base: 'auto', md: '400px' }}
      alignItems="center"
    >
      <Box
        bg="black"
        _dark={{ bg: 'gray.800' }}
        rounded="xl"
        p={8}
        position="relative"
        height="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text
          position="absolute"
          top={4}
          right={4}
          fontSize="6xl"
          fontWeight="bold"
          opacity={0.2}
          color="primary.400"
        >
          {number}
        </Text>
        <Circle size={24} bg="primary.400" color="white" opacity={0.9}>
          <Icon as={icon} boxSize={iconSize} />
        </Circle>
      </Box>

      <VStack spacing={6} align="flex-start" justify="center" p={4}>
        <Heading
          as="h3"
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="bold"
          color="gray.800"
          _dark={{ color: 'white' }}
        >
          {title}
        </Heading>
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          color="gray.600"
          _dark={{ color: 'gray.300' }}
          lineHeight="tall"
        >
          {description}
        </Text>
        <Tag
          size="lg"
          colorScheme="primary"
          rounded="full"
          px={6}
          py={2}
          bg="primary.50"
          color="primary.600"
          _dark={{
            bg: 'primary.900',
            color: 'primary.200',
          }}
        >
          {output}
        </Tag>
      </VStack>
    </Grid>
  )
}

export const Features: React.FC<FeaturesProps> = (props) => {
  const {
    title,
    description,
    features,
    spacing = 8,
    iconSize = 8,
    ...rest
  } = props

  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const handleWheel = (e: WheelEvent) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = container.offsetWidth
      const currentScroll = container.scrollLeft
      const maxScroll = container.scrollWidth - container.clientWidth

      // Check if we're at the edges
      const isAtStart = currentScroll === 0
      const isAtEnd = Math.abs(currentScroll - maxScroll) < 1

      // Allow normal scroll if:
      // 1. Scrolling up at the first card
      // 2. Scrolling down at the last card
      if ((isAtStart && e.deltaY < 0) || (isAtEnd && e.deltaY > 0)) {
        return // Let the default scroll behavior happen
      }

      // Otherwise, handle horizontal scrolling
      e.preventDefault()

      if (e.deltaY > 0) {
        // Scroll right to next card
        const nextScroll =
          Math.ceil((currentScroll + 1) / cardWidth) * cardWidth
        container.scrollTo({ left: nextScroll, behavior: 'smooth' })
      } else {
        // Scroll left to previous card
        const prevScroll =
          Math.floor((currentScroll - 1) / cardWidth) * cardWidth
        container.scrollTo({ left: prevScroll, behavior: 'smooth' })
      }
    }
  }

  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false })
      return () => {
        scrollContainer.removeEventListener('wheel', handleWheel)
      }
    }
  }, [])

  return (
    <Box py={{ base: 20, md: 32 }} bg="white" _dark={{ bg: 'secondary.500' }}>
      <Container maxW="container.xl">
        <VStack spacing={{ base: 12, md: 16 }}>
          {(title || description) && (
            <Box>
              <SectionTitle
                title={title}
                description={description}
                align="center"
              />
            </Box>
          )}
          <Box
            ref={scrollContainerRef}
            w="full"
            overflowX="auto"
            position="relative"
            css={{
              scrollSnapType: 'x mandatory',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              '-ms-overflow-style': 'none',
              scrollbarWidth: 'none',
            }}
          >
            <Flex w="full" position="relative">
              {features.map((feature, i) => (
                <Box
                  key={i}
                  flex="0 0 100%"
                  scrollSnapAlign="start"
                  minW="100%"
                  px={2}
                >
                  <Feature {...feature} iconSize={iconSize} index={i} />
                </Box>
              ))}
            </Flex>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
