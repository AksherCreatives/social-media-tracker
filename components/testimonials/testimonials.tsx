import {
  Box,
  Container,
  HStack,
  IconButton,
  Tag,
  VStack,
} from '@chakra-ui/react'
import {
  Section,
  SectionProps,
  SectionTitle,
  SectionTitleProps,
} from 'components/section'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import * as React from 'react'

const MotionBox = motion(Box)

export interface TestimonialsProps
  extends Omit<SectionProps, 'title'>,
    Pick<SectionTitleProps, 'title' | 'description'> {
  children: React.ReactNode
}

export const Testimonials: React.FC<TestimonialsProps> = (props) => {
  const { children, title, ...rest } = props
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [direction, setDirection] = React.useState(0)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    const childrenArray = React.Children.toArray(children)
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection
      if (nextIndex < 0) nextIndex = childrenArray.length - 1
      if (nextIndex >= childrenArray.length) nextIndex = 0
      return nextIndex
    })
  }

  const childrenArray = React.Children.toArray(children)

  return (
    <Section
      py={{ base: 20, md: 32 }}
      bg="white"
      _light={{
        bg: 'gray.50',
        color: 'gray.800',
      }}
      _dark={{
        bg: 'gray.800',
        borderColor: 'gray.700',
      }}
      {...rest}
    >
      <Container maxW="container.md">
        <VStack spacing={{ base: 12, md: 16 }}>
          <MotionBox
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.8 },
            }}
            viewport={{ margin: '-100px' }}
          >
            <VStack spacing={4} align="center">
              <Tag
                size="lg"
                colorScheme="primary"
                rounded="full"
                px={6}
                py={2}
                fontSize={{ base: 'sm', md: 'md' }}
              >
                Testimonials
              </Tag>
              <SectionTitle title={title} description={''} align="center" />
            </VStack>
          </MotionBox>

          <Box
            position="relative"
            width="100%"
            height="400px"
            overflow="hidden"
          >
            <AnimatePresence initial={false} custom={direction}>
              <MotionBox
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x)
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1)
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1)
                  }
                }}
                position="absolute"
                width="100%"
              >
                {childrenArray[currentIndex]}
              </MotionBox>
            </AnimatePresence>

            <HStack
              position="absolute"
              bottom="4"
              left="50%"
              transform="translateX(-50%)"
              spacing={4}
            >
              <IconButton
                aria-label="Previous testimonial"
                icon={<FiChevronLeft size={38} />}
                onClick={() => paginate(-1)}
                variant="ghost"
                colorScheme="primary"
                isRound
              />
              <IconButton
                aria-label="Next testimonial"
                icon={<FiChevronRight size={38} />}
                onClick={() => paginate(1)}
                variant="ghost"
                colorScheme="primary"
                isRound
              />
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Section>
  )
}
