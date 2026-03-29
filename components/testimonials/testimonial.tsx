import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { HTMLMotionProps, motion } from 'framer-motion'
import { FaTwitter } from 'react-icons/fa'

// Define the combined type for MotionCard props
type MotionCardProps = Omit<CardProps, keyof HTMLMotionProps<'div'>> &
  HTMLMotionProps<'div'> & {
    children: React.ReactNode
  }

// Create the motion component with proper typing
const MotionCard = motion(Card) as React.FC<MotionCardProps>

export interface TestimonialProps
  extends Omit<CardProps, keyof HTMLMotionProps<'div'>> {
  name: string
  description: React.ReactNode
  avatar: string
  href?: string
  children?: React.ReactNode
  index?: number
}

export const Testimonial = ({
  name,
  description,
  avatar,
  href,
  children,
  index = 0,
  ...rest
}: TestimonialProps) => {
  return (
    <MotionCard
      position="relative"
      bg="white"
      _dark={{ bg: 'gray.900' }}
      borderRadius="2xl"
      p={6}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay: index * 0.1,
          ease: 'easeOut',
        } as any,
      }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
        transition: {
          duration: 0.2,
        } as any,
      }}
      _hover={{
        boxShadow: '0 0 20px rgba(138, 75, 175, 0.3)',
      }}
      {...rest}
    >
      <CardHeader display="flex" flexDirection="row" alignItems="center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{
            scale: 1,
            transition: {
              delay: 0.2 + index * 0.1,
              duration: 0.4,
              type: 'spring',
              stiffness: 200,
            },
          }}
          viewport={{ once: true }}
        >
          <Avatar
            name={name}
            src={avatar}
            size="md"
            bg="primary.500"
            _dark={{ bg: 'primary.400' }}
          />
        </motion.div>
        <Stack spacing="1" ms="4">
          <Heading size="sm" color="gray.800" _dark={{ color: 'gray.100' }}>
            {name}
          </Heading>
          <Text color="gray.500" _dark={{ color: 'gray.400' }} size="sm">
            {description}
          </Text>
        </Stack>
        {href && (
          <Box position="absolute" top="4" right="4">
            <Link
              href={href}
              color="primary.500"
              _hover={{ color: 'primary.600' }}
              _dark={{
                color: 'primary.400',
                _hover: { color: 'primary.300' },
              }}
            >
              <FaTwitter />
            </Link>
          </Box>
        )}
      </CardHeader>
      <CardBody>
        <Text
          color="gray.600"
          _dark={{ color: 'gray.300' }}
          fontSize={{ base: 'md', md: 'lg' }}
          lineHeight="tall"
        >
          {children}
        </Text>
      </CardBody>
    </MotionCard>
  )
}
