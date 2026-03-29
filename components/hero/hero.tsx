import { Container, Flex, FlexProps, Text, VStack } from '@chakra-ui/react'

interface HeroProps extends Omit<FlexProps, 'title'> {
  title: string | React.ReactNode
  description?: string | React.ReactNode
}

export const Hero = ({ title, description, children, ...rest }: HeroProps) => {
  return (
    <Flex py="" alignItems="center" width="100%" {...rest}>
      <Container maxW="container.2xl" width="100%">
        <VStack spacing={[4, null, 8]} alignItems="center" width="100%">
          <Text as="h1" textStyle="h1" textAlign="center" width="100%">
            {title}
          </Text>
          {description && (
            <Text
              as="div"
              textStyle="subtitle"
              textAlign="center"
              color="gray.500"
              _dark={{ color: 'gray.400' }}
              width="100%"
            >
              {description}
            </Text>
          )}
          {children}
        </VStack>
      </Container>
    </Flex>
  )
}
