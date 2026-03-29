'use client'

import {
  Box,
  ButtonGroup,
  Container,
  Flex,
  Grid,
  HStack,
  Heading,
  Icon,
  IconButton,
  Stack,
  Tag,
  Text,
  VStack,
  Wrap,
  useClipboard,
  useColorMode,
} from '@chakra-ui/react'
import { Br, Link } from '@saas-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Metadata, NextPage } from 'next'
import Image from 'next/image'
import {
  FiArrowRight,
  FiBox,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiCode,
  FiCopy,
  FiEye,
  FiFlag,
  FiGrid,
  FiLock,
  FiPlay,
  FiSearch,
  FiSliders,
  FiSmile,
  FiTerminal,
  FiThumbsUp,
  FiToggleLeft,
  FiTrendingUp,
  FiUpload,
  FiUserPlus,
} from 'react-icons/fi'

import * as React from 'react'
import { useEffect } from 'react'

import { ButtonLink } from '#components/button-link/button-link'
import { Faq } from '#components/faq'
import { Features } from '#components/features'
import { BackgroundGradient } from '#components/gradients/background-gradient'
import { Hero } from '#components/hero'
import {
  Highlights,
  HighlightsItem,
  HighlightsTestimonialItem,
} from '#components/highlights'
import { ChakraLogo, NextjsLogo } from '#components/logos'
import { FallInPlace } from '#components/motion/fall-in-place'
import { Pricing } from '#components/pricing/pricing'
import { SectionTitle } from '#components/section'
import { Testimonial, Testimonials } from '#components/testimonials'
import { Em } from '#components/typography'
import { WhyWorkWithUs } from '#components/why-work-with-us'
import faq from '#data/faq'
import pricing from '#data/pricing'
import testimonials from '#data/testimonials'

// export const meta: Metadata = {
//   title: 'Aksher Creatives Landingspage',
//   description: 'Free SaaS landingspage starter kit',
// }

const Home: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  useEffect(() => {
    if (colorMode === 'light') {
      toggleColorMode()
    }
  }, [colorMode, toggleColorMode])
  return (
    <div>
      <Box>
        <HeroSection />
        <LogoMarquee />
        <VideoShowcaseSection />
        <LongVideoSection />
        <FeaturesSection />
        <TestimonialsSection />
        <WhyWorkWithUsSection />
        <FaqSection />
        <BookCallSection />
      </Box>
    </div>
  )
}

const CountingNumber: React.FC<{ value: number; duration?: number }> = ({
  value,
  duration = 2,
}) => {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / (duration * 1000)

      if (progress < 1) {
        setCount(Math.min(Math.floor(value * progress), value))
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, duration])

  return <>{count.toLocaleString()}</>
}

const HeroSection: React.FC = () => {
  return (
    <Box position="relative" overflow="hidden">
      <BackgroundGradient height="100%" zIndex="-1" />
      <Container
        maxW="container.2xl"
        pt={{ base: 40, lg: 60 }}
        pb={{ base: 10, md: 40 }}
      >
        <Stack
          direction="column"
          alignItems="center"
          textAlign="center"
          spacing={8}
          width="100%"
        >
          <Hero
            id="home"
            px="0"
            width="100%"
            title={
              <FallInPlace>
                <Text
                  fontSize={{ base: '4xl', lg: '7xl' }}
                  fontWeight="bold"
                  lineHeight="1.2"
                  width="100%"
                  maxW="1400px"
                >
                   YOUR{' '}
                  <Text as="span" color="primary.400" display="inline">
                    AUDIENCE
                  </Text>{' '}
                  IS OUT THERE 
                  <br />
                  WAITING FOR YOU. YOU JUST AREN'T INFRONT OF THEM.
                  <br />
                </Text>
              </FallInPlace>
            }
            description={
              <FallInPlace delay={0.4}>
                <Text fontSize="2xl" color="gray.600" maxW="4xl" mx="auto">
                  Everyone has problems and are looking for solutions, chances are the solution you are selling isn't reaching the people with that suffering. 
                  Let's change that. So you are able to connect and help as many people as you want.                
                </Text>
              </FallInPlace>
            }
          >
            <FallInPlace delay={0.8}>
              <VStack spacing={{ base: 8, md: 12 }}>
                {/* Add Book a Call button */}
                <ButtonLink
                  href="https://calendly.com/vishwmitra-akshercreatives/aksher-creatives-discovery-call" // Replace with your actual email
                  size="lg"
                  // formTarget="blank"
                  colorScheme="primary"
                  px={8}
                  py={6}
                  fontSize="xl"
                  rounded="full"
                >
                  BOOK CALL
                </ButtonLink>

                {/* First row - 3 items */}
                <HStack
                  spacing={{ base: 8, md: 12, lg: 16 }}
                  justify="center"
                  direction={{ base: 'column', md: 'row' }}
                  align="center"
                >
                  <VStack spacing={3}>
                    <Text
                      fontSize={{ base: '3xl', md: '4xl' }}
                      fontWeight="bold"
                      bgGradient="linear(to-r, primary.400, primary.600)"
                      bgClip="text"
                    >
                      <CountingNumber value={4} duration={1} />+
                    </Text>
                    <Text
                      fontSize={{ base: 'md', md: 'lg' }}
                      textAlign="center"
                      color="gray.500"
                      _dark={{ color: 'gray.400' }}
                      fontWeight="medium"
                    >
                      Years of Video Editing
                    </Text>
                  </VStack>
                  <VStack spacing={3}>
                    <Text
                      fontSize={{ base: '3xl', md: '4xl' }}
                      fontWeight="bold"
                      bgGradient="linear(to-r, primary.400, primary.600)"
                      bgClip="text"
                    >
                      <CountingNumber value={1} duration={1} />+
                    </Text>
                    <Text
                      fontSize={{ base: 'md', md: 'lg' }}
                      textAlign="center"
                      color="gray.500"
                      _dark={{ color: 'gray.400' }}
                      fontWeight="medium"
                    >
                      Years of Building Personal Brands
                    </Text>
                  </VStack>

                  <VStack spacing={3}>
                    <Text
                      fontSize={{ base: '3xl', md: '4xl' }}
                      fontWeight="bold"
                      bgGradient="linear(to-r, primary.400, primary.600)"
                      bgClip="text"
                    >
                      <CountingNumber value={3000} />+
                    </Text>
                    <Text
                      fontSize={{ base: 'md', md: 'lg' }}
                      textAlign="center"
                      color="gray.500"
                      _dark={{ color: 'gray.400' }}
                      fontWeight="medium"
                    >
                      Short Form Created
                    </Text>
                  </VStack>
                  <VStack spacing={3}>
                    <Text
                      fontSize={{ base: '3xl', md: '4xl' }}
                      fontWeight="bold"
                      bgGradient="linear(to-r, primary.400, primary.600)"
                      bgClip="text"
                    >
                      <CountingNumber value={200} />+
                    </Text>
                    <Text
                      fontSize={{ base: 'md', md: 'lg' }}
                      textAlign="center"
                      color="gray.500"
                      _dark={{ color: 'gray.400' }}
                      fontWeight="medium"
                    >
                      Long Form Created
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </FallInPlace>
          </Hero>
        </Stack>
      </Container>
    </Box>
  )
}

const LogoMarquee: React.FC = () => {
  const logoImages = [
    '1fwUIF6gn1RSfgNf1V1uUaSFvCuDyQePJ',
    '1Ki9KpU0j6az2hIBUwALifjkCisGz9fhv',
    '1RXubgOkkZDgcfC9ezb7negkUI4Zt8uOl',
    '1g8AQKJItPjTo-cX8EZ8TtKKzpdFkSbXk',
    '1iY7D9f72i3VfG93EvC8lkRSPE59kk3ZI',
    '1kZ2gwq5KNZe8dbX5yMwQNGrkdy_uUfn-',
    '1GWxJQ8VT8hOgy52jybGdFzZ_F2HItnmN',

    '1fwUIF6gn1RSfgNf1V1uUaSFvCuDyQePJ',
    '1Ki9KpU0j6az2hIBUwALifjkCisGz9fhv',
    '1RXubgOkkZDgcfC9ezb7negkUI4Zt8uOl',
    '1g8AQKJItPjTo-cX8EZ8TtKKzpdFkSbXk',
    '1iY7D9f72i3VfG93EvC8lkRSPE59kk3ZI',
    '1kZ2gwq5KNZe8dbX5yMwQNGrkdy_uUfn-',
    '1GWxJQ8VT8hOgy52jybGdFzZ_F2HItnmN',
  ]

  return (
    <Box py={{ base: 8, md: 16 }}>
      <Container maxW="container.2xl">
        <Text
          textAlign="center"
          fontSize={{ base: '2xl', md: '4xl' }}
          fontWeight="bold"
          mb={{ base: 10, md: 20 }}
        >
          Trusted by Leading Entrepreneurs & Personal Brands
        </Text>

        <Box
          css={{
            '@keyframes scroll': {
              '0%': { transform: 'translateX(0)' },
              '100%': { transform: 'translateX(-50%)' },
            },
          }}
          position="relative"
          overflow="hidden"
          whiteSpace="nowrap"
          mx={{ base: -4, md: 0 }}
          px={{ base: 4, md: 0 }}
        >
          <Flex
            animation="scroll 20s linear infinite"
            display="inline-flex"
            alignItems="center"
            height="120px"
          >
            {logoImages.map((id, index) => (
              <Image
                key={index}
                src={`https://drive.google.com/uc?export=view&id=${id}`}
                alt={`Partner logo ${index + 1}`}
                width={250}
                height={100}
                style={{
                  height: '120px',
                  minWidth: '120px',
                  minHeight: '120px',
                  width: 'auto',
                  objectFit: 'contain',
                  margin: '0 32px',
                }}
              />
            ))}
          </Flex>
          {/* Duplicate set for continuous scroll
          <Flex
            animation="scroll 20s linear infinite"
            display="inline-flex"
            position="absolute"
            left="100%"
            top={0}
            alignItems="center"
            height="120px"
          >
            {logoImages.map((id, index) => (
              <Image
                key={index}
                src={`https://drive.google.com/uc?export=view&id=${id}`}
                alt={`Partner logow ${index + 1}`}
                width={250}
                height={100}
                style={{
                  height: '120px',
                  width: 'auto',
                  objectFit: 'contain',
                  margin: '0 32px',
                }}
              />
            ))}
          </Flex> */}
        </Box>
      </Container>
    </Box>
  )
}

// const VideoCard: React.FC<{
//   videoUrl: string
//   index: number
// }> = ({ videoUrl, index }) => {
//   return (
//     <motion.div
//       initial={{
//         opacity: 0,
//         scale: 0.8,
//         y: 50,
//         rotateX: 45,
//       }}
//       whileInView={{
//         opacity: 1,
//         scale: 1,
//         y: 0,
//         rotateX: 0,
//       }}
//       transition={{
//         duration: 0.7,
//         delay: index * 0.2,
//         ease: [0.215, 0.61, 0.355, 1],
//       }}
//       whileHover={{
//         scale: 1.05,
//         transition: { duration: 0.2 },
//       }}
//     >
//       <Box
//         bg="gray.900"
//         rounded={{ base: 'xl', md: '2xl' }}
//         overflow="hidden"
//         position="relative"
//         aspectRatio={9 / 12}
//         maxH={{ base: '400px', md: '500px' }}
//         _hover={{
//           boxShadow: '0 0 20px rgba(138, 75, 175, 0.6)',
//           transform: 'translateY(-4px)',
//           transition: 'all 0.2s ease-in-out',
//         }}
//         transition="all 0.2s ease-in-out"
//       >
//         <iframe
//           src={`https://fast.wistia.net/embed/iframe/${videoUrl}`}
//           width="100%"
//           height="100%"
//           style={{
//             border: 'none',
//             objectFit: 'cover',
//           }}
//           allow="autoplay; fullscreen"
//           allowFullScreen
//         />
//       </Box>
//     </motion.div>
//   )
// }
const VideoCard: React.FC<{
  videoUrl: string
  index: number
}> = ({ videoUrl, index }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.8,
        y: 50,
        rotateX: 45,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
      }}
      transition={{
        duration: 0.7,
        delay: index * 0.2,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
    >
      <Box
        bg="gray.900"
        rounded={{ base: 'xl', md: '2xl' }}
        overflow="hidden"
        position="relative"
        pt="177.78%" // 👈 vertical aspect ratio (9:16)
        maxH={{ base: '400px', md: '500px' }}
        _hover={{
          boxShadow: '0 0 20px rgba(138, 75, 175, 0.6)',
          transform: 'translateY(-4px)',
          transition: 'all 0.2s ease-in-out',
        }}
        transition="all 0.2s ease-in-out"
      >
        <iframe
          src={`https://fast.wistia.net/embed/iframe/${videoUrl}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            objectFit: 'cover',
            display: 'block',
          }}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </Box>
    </motion.div>
  )
}

const VideoShowcaseSection: React.FC = () => {
  const videos = [
    'vfsrhdxvpj', //added this extra
    // 'pprrqv5f4z',
    'epbd20zl8v',
    // 'p9k97clzfh',
    // 'i97fev5uqv',
    // 'o66cnacixg',
    'oa2tj5o5jr',
    'zt9ljrhzwp',
    '0nl6tf32a7',
  ]

  const [currentIndex, setCurrentIndex] = React.useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 3 >= videos.length ? 0 : prev + 3))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - 3 < 0 ? Math.max(0, videos.length - 3) : prev - 3,
    )
  }

  const visibleVideos = videos.slice(currentIndex, currentIndex + 3)

  return (
    <Box
      py={{ base: 20, md: 32 }}
      bg="gray.50"
      _dark={{ bg: 'gray.800', color: 'gray.100' }}
    >
      <Container maxW="container.2xl">
        <VStack spacing={{ base: 8, md: 16 }} align="center">
          {/* Introduction */}
          <VStack
            spacing={{ base: 4, md: 8 }}
            textAlign="center"
            maxW="container.xl"
          >
            <Text
              textAlign="center"
              fontSize={{ base: 'xl', md: '2xl' }}
              fontWeight="bold"
              mb={{ base: 10}}
            >
              Trusted by Leading Entrepreneurs & Personal Brands <br/>
              From content planning to packaging to uploading. <br/>
              Making sure that your content reaches the audience you want
            </Text>

            <Tag
              size="lg"
              colorScheme="primary"
              rounded="full"
              px={6}
              py={2}
              fontSize={{ base: 'sm', md: 'md' }}
            >
              OUR RESULT SPEAK...
            </Tag>          
          </VStack>

          {/* Updated Video Grid with Navigation */}
          <Box position="relative" w="full" px={{ base: 4, md: 8 }}>
            <Flex justify="center" align="center" position="relative">
              <IconButton
                icon={<FiArrowRight transform="rotate(180)" />}
                aria-label="Previous videos"
                onClick={prevSlide}
                position="absolute"
                left="-4"
                top="50%"
                transform="translateY(-50%)"
                zIndex={2}
                colorScheme="primary"
                variant="ghost"
                size="lg"
                isRound
                _hover={{ bg: 'primary.100' }}
                _dark={{ _hover: { bg: 'primary.900' } }}
              />

              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                gap={{ base: 4, lg: 8 }}
                w="full"
                maxW="container.xl"
              >
                {visibleVideos.map((video, index) => (
                  <VideoCard
                    key={currentIndex + index}
                    videoUrl={video}
                    index={index}
                  />
                ))}
              </Grid>

              <IconButton
                icon={<FiArrowRight />}
                aria-label="Next videos"
                onClick={nextSlide}
                position="absolute"
                right="-4"
                top="50%"
                transform="translateY(-50%)"
                zIndex={2}
                colorScheme="primary"
                variant="ghost"
                size="lg"
                isRound
                _hover={{ bg: 'primary.100' }}
                _dark={{ _hover: { bg: 'primary.900' } }}
              />
            </Flex>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

// const LandscapeVideoCard: React.FC<{
//   videoUrl: string
//   index: number
// }> = ({ videoUrl, index }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{
//         opacity: 1,
//         y: 0,
//         transition: {
//           duration: 0.5,
//           delay: index * 0.1,
//           ease: 'easeOut',
//         },
//       }}
//       viewport={{ once: true }}
//       whileHover={{
//         y: -8,
//         transition: { duration: 0.2 },
//       }}
//     >
//       <Box
//         bg="gray.900"
//         rounded="2xl"
//         overflow="hidden"
//         position="relative"
//         aspectRatio={16 / 9}
//         _hover={{
//           boxShadow: '0 0 20px rgba(138, 75, 175, 0.3)',
//         }}
//       >
//         <iframe
//           src={`https://fast.wistia.net/embed/iframe/${videoUrl}`}
//           width="100%"
//           height="100%"
//           style={{
//             border: 'none',
//             objectFit: 'cover',
//           }}
//           allow="autoplay; fullscreen"
//           allowFullScreen
//         />
//       </Box>
//     </motion.div>
//   )
// }
// const LandscapeVideoCard: React.FC<{
//   videoUrl: string
//   index: number
// }> = ({ videoUrl, index }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{
//         opacity: 1,
//         y: 0,
//         transition: {
//           duration: 0.5,
//           delay: index * 0.1,
//           ease: 'easeOut',
//         },
//       }}
//       viewport={{ once: true }}
//       whileHover={{
//         y: -8,
//         transition: { duration: 0.2 },
//       }}
//     >
//       <Box
//         bg="gray.900"
//         rounded="2xl"
//         overflow="hidden"
//         position="relative"
//         aspectRatio={16 / 9}
//         _hover={{
//           boxShadow: '0 0 20px rgba(138, 75, 175, 0.3)',
//         }}
//       >
//         <iframe
//           src={`https://fast.wistia.net/embed/iframe/${videoUrl}`}
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             border: 'none',
//             objectFit: 'cover',
//           }}
//           allow="autoplay; fullscreen"
//           allowFullScreen
//         />
//       </Box>
//     </motion.div>
//   )
// }

const LandscapeVideoCard: React.FC<{
  videoUrl: string
  index: number
}> = ({ videoUrl, index }) => {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay: index * 0.1,
          ease: 'easeOut',
        },
      }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 },
      }}
      style={{ width: '100%' }}
    >
      <Box
        bg="gray.900"
        rounded="2xl"
        overflow="hidden"
        position="relative"
        aspectRatio={16 / 9}
        width="100%"
        cursor="pointer"
        onClick={togglePlay}
        _hover={{
          boxShadow: '0 0 20px rgba(138, 75, 175, 0.3)',
        }}
      >
        {true ? (
          <iframe
            src={`https://fast.wistia.net/embed/iframe/${videoUrl}`}
            width="100%"
            height="100%"
            style={{
              border: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              playsInline
              loop
            />
            {!isPlaying && (
              <Box
                position="absolute"
                top={4}
                right={4}
                bg="white"
                color="black"
                px={2}
                py={1}
                rounded="full"
                fontSize="sm"
                fontWeight="medium"
                transition="all 0.2s"
                _hover={{
                  transform: 'scale(1.1)',
                  bg: 'primary.500',
                  color: 'white',
                }}
              >
                <Icon as={FiPlay} mr={1} />
                Watch
              </Box>
            )}
          </>
        )}
      </Box>
    </motion.div>
  )
}

// Update the LongVideoSection to use the new component with proper video URLs
// const LongVideoSection: React.FC = () => {
//   const videos = [
//     { videoUrl: '/static/videos/long/video1.mp4' },
//     { videoUrl: '/static/videos/long/video2.mp4' },
//     { videoUrl: '/static/videos/long/video3.mp4' },
//   ]

//   return (
//     <Box
//       py={{ base: 20, md: 32 }}
//       bg="white"
//       _dark={{ bg: 'gray.800', color: 'gray.100' }}
//     >
//       <Container maxW="container.md">
//         <VStack spacing={{ base: 12, md: 16 }}>
//           <motion.div
//             initial={{ opacity: 0, y: -30, scale: 0.9 }}
//             whileInView={{
//               opacity: 1,
//               y: 0,
//               scale: 1,
//               transition: { duration: 0.8 },
//             }}
//             viewport={{ margin: '-100px' }}
//           >
//             <VStack spacing={4} align="center">
//               <Tag
//                 size="lg"
//                 colorScheme="primary"
//                 rounded="full"
//                 px={6}
//                 py={2}
//                 fontSize={{ base: 'sm', md: 'md' }}
//               >
//                 Featured Content
//               </Tag>
//               <SectionTitle
//                 title="Watch Our Long-Form Content"
//                 align="center"
//               />
//             </VStack>
//           </motion.div>

//           <VStack spacing={8} width="100%">
//             {videos.map((video, index) => (
//               <LandscapeVideoCard
//                 key={index}
//                 videoUrl={video.videoUrl}
//                 index={index}
//               />
//             ))}
//           </VStack>
//         </VStack>
//       </Container>
//     </Box>
//   )
// }
const LongVideoSection: React.FC = () => {
  // const videos = ['891n7usvg3', 'p9k97clzfh'] //updated the second video
  const videos = [
    'wau2ln4m9r',
    '6tic6yih9l',
    '5dt195bf54',
    'rf4e7m326m',
    '5jj74gc5c1',
    'c8zlv1dsw4',
  ]

  const [currentIndex, setCurrentIndex] = React.useState(0)

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length)
  }

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length)
  }

  return (
    <Box
      py={{ base: 20, md: 32 }}
      bg="white"
      _dark={{ bg: 'gray.800', color: 'gray.100' }}
    >
      <Container maxW="container.md">
        <VStack spacing={{ base: 12}}>
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.8 },
            }}
            viewport={{ margin: '-100px' }}
          >
          </motion.div>

          <Box position="relative" width="100%" marginTop="-200px">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <LandscapeVideoCard
                  videoUrl={videos[currentIndex]}
                  index={currentIndex}
                />
              </motion.div>
            </AnimatePresence>

            <ButtonGroup
              variant="ghost"
              spacing={4}
              position="absolute"
              left="50%"
              transform="translateX(-50%)"
              bottom="-16"
            >
              <IconButton
                aria-label="Previous video"
                icon={<FiChevronLeft />}
                onClick={prevVideo}
                isRound
                size="lg"
                colorScheme="primary"
              />
              <IconButton
                aria-label="Next video"
                icon={<FiChevronRight />}
                onClick={nextVideo}
                isRound
                size="lg"
                colorScheme="primary"
              />
            </ButtonGroup>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

const FeaturesSection = () => {
  return (
    <Features
      id="how-it-works"
      title={
        <VStack spacing={4} align="center">
          <Tag
            size="lg"
            colorScheme="primary"
            rounded="full"
            px={6}
            py={2}
            fontSize={{ base: 'sm', md: 'md' }}
          >
            Process
          </Tag>
          <Heading
            lineHeight="shorter"
            fontSize={{ base: '2xl', sm: '3xl', md: '5xl' }}
            textAlign="center"
            maxW="container.lg"
          >
            Our simple 5 step process <br />
            will take care of everything
          </Heading>
        </VStack>
      }
      align="center"
      spacing={8}
      features={[
        {
          number: '01',
          title: 'Research',
          icon: FiBox,
          description:
            'We will research your brand, your audience, and your competitors to create a content strategy that is tailored to your needs',
          output: 'Output: Raw content files and brief',
          variant: 'card',
          iconSize: 12,
        },
        {
          number: '02',
          title: 'Idea and Scripting',
          icon: FiSliders,
          description:
            'Our creative team will craft a unique style, thoughtfully aligned with your brand&apos;s theme and vision',
          output: 'Output: Professionally edited content',
          variant: 'card',
          iconSize: 12,
        },
        {
          number: '03',
          title: 'Editing and Thumbnail Designing',
          icon: FiTrendingUp,
          description:
            'We will edit your content and design a thumbnail that is both engaging and visually appealing',
          output: 'Output: Professionally edited content and thumbnail',
          variant: 'card',
          iconSize: 12,
        },
        {
          number: '04',
          title: 'Reviewing',
          icon: FiEye,
          description:
            'We will review the content and make sure it is up to your standards',
          output: 'Output: Final content',
          variant: 'card',
          iconSize: 12,
        },
        {
          number: '05',
          title: 'Uploading and SEO',
          icon: FiUpload,
          description:
            'We will upload your content and schedule it to be posted on the appropriate platforms',
          output: 'Output: Final content',
          variant: 'card',
          iconSize: 12,
        },
      ]}
    />
  )
}

const TestimonialsSection = () => {
  return (
    <Testimonials
      id="testimonials"
      title="Hear from the entrepreneurs who invested in the transformation"
      innerWidth="container.xl"
    >
      {testimonials.items.map((testimonial, i) => (
        <Testimonial key={i} {...testimonial} index={i} />
      ))}
    </Testimonials>
  )
}

const FaqSection = () => {
  return <Faq id="faq" {...faq} />
}

const WhyWorkWithUsSection = () => {
  return (
    <Features
      id="why-us"
      title={
        <VStack spacing={4} align="center">
          <Tag
            size="lg"
            colorScheme="primary"
            rounded="full"
            px={6}
            py={2}
            fontSize={{ base: 'sm', md: 'md' }}
          >
            Why work with us
          </Tag>
          <Heading
            lineHeight="shorter"
            fontSize={{ base: '2xl', sm: '3xl', md: '5xl' }}
            textAlign="center"
            maxW="container.lg"
          >
            Give us your problems and
            <br />
            we'll take care of it for you
          </Heading>
        </VStack>
      }
      align="center"
      spacing={8}
      features={[
        {
          number: '01',
          title: 'Authority',
          icon: FiThumbsUp,
          description:
            'Become the authority in your niche and outperform your competitors',
          output:
            'Expert Positioning • Industry Leadership • Thought Leadership Content',
          variant: 'card',
          iconSize: 12,
        },
        {
          number: '02',
          title: 'Consistent Leads & Sales',
          icon: FiTrendingUp,
          description:
            'Generate predictable revenue through strategic content that converts',
          output: 'Lead Generation • Sales Funnel • Revenue Growth',
          variant: 'card',
          iconSize: 12,
        },
        {
          number: '03',
          title: '24/7 Support',
          icon: FiUserPlus,
          description:
            'Round-the-clock assistance to ensure your content needs are met',
          output: 'Instant Response • Dedicated Team • Continuous Support',
          variant: 'card',
          iconSize: 12,
        },
        {
          number: '04',
          title: 'Urgent Delivery',
          icon: FiFlag,
          description:
            'Deadline-matched urgent videos delivered at no extra cost',
          output: 'Fast Turnaround • Priority Service • No Rush Fees',
          variant: 'card',
          iconSize: 12,
        },
        {
          number: '05',
          title: 'Premium Quality',
          icon: FiGrid,
          description:
            'Best-in-class content that resonates with your brand and attracts your ICP',
          output:
            'Brand Alignment • Target Audience Focus • Professional Production',
          variant: 'card',
          iconSize: 12,
        },
      ]}
    />
  )
}

const BookCallSection: React.FC = () => {
  return (
    <Box
      bg="white"
      color="black"
      py={{ base: 20, md: 32 }}
      position="relative"
      overflow="hidden"
      _dark={{
        bg: 'gray.900',
        color: 'gray.100',
      }}
    >
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="100%"
        height="100%"
        bg="linear-gradient(135deg, rgba(4, 106, 154, 0.08) 0%, rgba(4, 106, 154, 0.03) 100%)"
        opacity="0.9"
        zIndex="0"
        filter="blur(80px)"
        borderRadius="full"
      />

      <Container maxW="container.xl" position="relative" zIndex="1">
        <VStack spacing={8} textAlign="center">
          <SectionTitle
            title={
              <>
                Ready to make your Youtube <br />a sales machine?
              </>
            }
            align="center"
            color="black"
            fontSize={{ base: '2xl', md: '4xl' }}
            _dark={{ color: 'white' }}
          />

          <Text
            color="gray.400"
            fontSize={{ base: 'lg', md: 'xl' }}
            maxW="3xl"
            mx="auto"
            px={4}
          >
            Schedule a consultation call to develop a personalised system that
            works for you, create a strategic game plan to skyrocket your
            content, and establish yourself as a leading authority in your niche
          </Text>

          <ButtonLink
            href="https://calendly.com/vishwmitra-akshercreatives/aksher-creatives-discovery-call"
            size="lg"
            colorScheme="primary"
            px={8}
            py={6}
            fontSize="xl"
            rounded="full"
            mt={8}
          >
            Book a call
          </ButtonLink>
        </VStack>
      </Container>
    </Box>
  )
}

export default Home
