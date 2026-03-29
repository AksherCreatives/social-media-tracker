import {
  Box,
  Container,
  Heading,
  Icon,
  Image,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { Section, SectionProps } from 'components/section'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'

import * as React from 'react'

const MotionBox = motion(Box)

interface Benefit {
  id: string
  title: string
  description: string
  icon: React.ElementType
  features: string[]
}

interface WhyWorkWithUsProps extends Omit<SectionProps, 'title' | 'children'> {
  title: React.ReactNode
  benefits: Benefit[]
  children?: React.ReactNode
}

const BenefitCard = ({
  title,
  description,
  icon,
  features,
  index,
}: Benefit & { index: number }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring animations for smoother movement
  const rotateX = useSpring(useTransform(y, [-100, 100], [30, -30]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(x, [-100, 100], [-30, 30]), {
    stiffness: 300,
    damping: 30,
  })

  function handleMouse(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.7,
          delay: index * 0.2,
          ease: [0.215, 0.61, 0.355, 1],
        },
      }}
      viewport={{ margin: '-100px' }}
      style={{
        perspective: 2000,
        transformStyle: 'preserve-3d',
      }}
    >
      <MotionBox
        onPointerMove={handleMouse}
        onPointerLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        bg="white"
        borderRadius="2xl"
        p={8}
        border="1px solid"
        borderColor="gray.200"
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        _hover={{
          borderColor: 'primary.500',
          boxShadow: '0 20px 40px rgba(138, 75, 175, 0.3)',
        }}
        _dark={{
          bg: 'gray.800',
          borderColor: 'gray.700',
          _hover: {
            borderColor: 'primary.400',
            boxShadow: '0 20px 40px rgba(138, 75, 175, 0.2)',
          },
        }}
      >
        <MotionBox
          style={{
            transform: 'translateZ(50px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <VStack spacing={6} align="start" h="full">
            <MotionBox
              bg="gray.100"
              _dark={{ bg: 'gray.700' }}
              p={4}
              borderRadius="xl"
              w="full"
              overflow="hidden"
              display="flex"
              alignItems="center"
              justifyContent="center"
              style={{
                transform: 'translateZ(20px)',
              }}
            >
              <Icon
                as={icon}
                w="80px"
                h="80px"
                color="primary.500"
                _dark={{ color: 'primary.400' }}
              />
            </MotionBox>

            <VStack
              align="start"
              spacing={4}
              flex="1"
              style={{
                transform: 'translateZ(30px)',
              }}
            >
              <Heading
                size="md"
                color="gray.800"
                _dark={{ color: 'gray.100' }}
                fontWeight="bold"
              >
                {title}
              </Heading>
              <Text
                color="gray.500"
                _dark={{ color: 'gray.400' }}
                fontSize="md"
              >
                {description}
              </Text>
            </VStack>

            <List
              spacing={3}
              w="full"
              style={{
                transform: 'translateZ(40px)',
              }}
            >
              {features.map((feature, i) => (
                <ListItem
                  key={i}
                  color="gray.600"
                  _dark={{ color: 'gray.300' }}
                  display="flex"
                  alignItems="center"
                >
                  <ListIcon
                    as={FiCheck}
                    color="primary.500"
                    _dark={{ color: 'primary.400' }}
                    mr={2}
                  />
                  {feature}
                </ListItem>
              ))}
            </List>
          </VStack>
        </MotionBox>
      </MotionBox>
    </MotionBox>
  )
}

export const WhyWorkWithUs: React.FC<WhyWorkWithUsProps> = (props) => {
  const { title, benefits, ...rest } = props

  return (
    <Section
      py={{ base: 20, md: 32 }}
      bg="white"
      _dark={{ bg: 'secondary.500' }}
      {...rest}
    >
      <Container maxW="container.xl">
        <VStack spacing={{ base: 12, md: 16 }}>
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                delay: 0.2,
              },
            }}
            viewport={{ once: true }}
          >
            {title}
          </MotionBox>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={8}
            w="full"
            px={{ base: 4, md: 0 }}
          >
            {benefits.map((benefit, index) => (
              <BenefitCard key={benefit.id} {...benefit} index={index} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Section>
  )
}
