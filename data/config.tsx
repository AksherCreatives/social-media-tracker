import { Button } from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa'
import { FiCheck } from 'react-icons/fi'

import { Logo } from './logo'

type NextSeoProps = {
  title?: string
  description?: string
}

const siteConfig = {
  logo: Logo,
  seo: {
    title: 'Aksher Creatives',
    description:
      'Building profitable personal brands through short-form content',
  } as NextSeoProps,
  termsUrl: '#',
  privacyUrl: '#',
  header: {
    links: [
      {
        id: 'how-it-works',
        label: 'How It Works',
        href: '/#how-it-works',
      },
      {
        id: 'testimonials',
        label: 'Testimonials',
        href: '/#testimonials',
      },
      {
        id: 'why-us',
        label: 'About Us',
        href: '/#why-us',
      },
      {
        id: 'faq',
        label: 'FAQ',
        href: '/#faq',
      },
    ] as Array<{
      id?: string
      label: string
      href?: string
    }>,
  },
  footer: {
    copyright: (
      <>
        Copyright to{' '}
        <Link href="https://twitter.com/AksherCreatives">Aksher Creatives</Link>
      </>
    ),
    links: [
      {
        href: 'mailto:hello@akshercreatives.com',
        label: 'Contact',
      },
      {
        href: 'https://twitter.com/akshercreatives',
        label: <FaTwitter size="14" />,
      },
      {
        href: 'https://www.instagram.com/akshercreatives/',
        label: <FaInstagram size="14" />,
      },
    ],
  },
  signup: {
    title: 'Transform your expertise into engaging content',
    features: [
      {
        icon: FiCheck,
        title: 'Personal Brand Growth',
        description:
          'Build a strong, authentic personal brand that resonates with your audience.',
      },
      {
        icon: FiCheck,
        title: 'Short-Form Content Strategy',
        description:
          'Create compelling video content optimized for today&apos;s fast-paced social platforms.',
      },
      {
        icon: FiCheck,
        title: 'Organic Lead Generation',
        description:
          'Convert viewers into qualified leads through strategic content positioning.',
      },
      {
        icon: FiCheck,
        title: 'Authority Building',
        description:
          'Establish yourself as the go-to expert in your niche through consistent, valuable content.',
      },
    ],
  },
}

export default siteConfig
