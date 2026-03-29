import {
  Box,
  BoxProps,
  Container,
  Flex,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react'
import { useScroll } from 'framer-motion'
import Image from 'next/image'

import * as React from 'react'

import Navigation from './navigation'

export interface HeaderProps extends Omit<BoxProps, 'children'> {}

export const Header = (props: HeaderProps) => {
  const ref = React.useRef<HTMLHeadingElement>(null)
  const [y, setY] = React.useState(0)
  const { height = 0 } = ref.current?.getBoundingClientRect() ?? {}

  const { scrollY } = useScroll()
  React.useEffect(() => {
    return scrollY.on('change', () => setY(scrollY.get()))
  }, [scrollY])

  const bg = useColorModeValue('whiteAlpha.700', 'rgba(29, 32, 37, 0.7)')

  return (
    <Box
      ref={ref}
      as="header" 
      position="fixed"
      width="100%"
      top="20px"
      zIndex="sticky"
      {...props}
    >
      <Container maxW="container.xl" px="8">
        <Flex
          width="fit-content"
          align="center"
          mx="auto"
          bg={bg}
          backdropFilter="blur(5px)"
          boxShadow="lg"
          borderRadius="full"
          py="3"
          px="6"
          borderWidth="1px"
          borderColor="whiteAlpha.100"
        >
          <Image
            src="/static/images/logos/logo.png"
            alt="Logo"
            width={32}
            height={32}
            style={{ marginRight: '1rem' }}
          />
          <Navigation />
        </Flex>
      </Container>
    </Box>
  )
}
