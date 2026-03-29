'use client'

import { useState } from 'react'

import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react'

import { createEntry, updateEntry } from '../../lib/tracker-api'
import { todayISO } from '../../lib/tracker-storage'
import type { DailyEntry, Platform } from '../../types/tracker'
import { PLATFORMS } from '../../types/tracker'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
  editEntry?: DailyEntry | null
}

const EMPTY_FORM = {
  date: todayISO(),
  platform: 'instagram' as Platform,
  impressions: 0,
  views: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  saves: 0,
  followersGained: 0,
  notes: '',
}

export function ManualEntryModal({ isOpen, onClose, onSaved, editEntry }: Props) {
  const [form, setForm] = useState(editEntry ? {
    date: editEntry.date,
    platform: editEntry.platform,
    impressions: editEntry.impressions,
    views: editEntry.views,
    likes: editEntry.likes,
    comments: editEntry.comments,
    shares: editEntry.shares,
    saves: editEntry.saves,
    followersGained: editEntry.followersGained,
    notes: editEntry.notes,
  } : { ...EMPTY_FORM })
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const platforms = Object.entries(PLATFORMS) as [Platform, (typeof PLATFORMS)[Platform]][]

  function setNum(field: string, val: string) {
    const n = parseInt(val, 10)
    setForm((f) => ({ ...f, [field]: isNaN(n) ? 0 : n }))
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      if (editEntry) {
        await updateEntry(editEntry.id, form)
      } else {
        await createEntry(form)
      }
      toast({
        title: editEntry ? 'Entry updated' : 'Entry saved',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      })
      onSaved()
      onClose()
      if (!editEntry) setForm({ ...EMPTY_FORM, date: todayISO() })
    } finally {
      setLoading(false)
    }
  }

  const selectedPlatform = PLATFORMS[form.platform]

  const numFields: { field: keyof typeof EMPTY_FORM; label: string }[] = [
    { field: 'impressions', label: 'Impressions' },
    { field: 'views', label: 'Views' },
    { field: 'likes', label: 'Likes' },
    { field: 'comments', label: 'Comments' },
    { field: 'shares', label: 'Shares' },
    { field: 'saves', label: 'Saves' },
    { field: 'followersGained', label: 'Followers Gained' },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(12px)" bg="rgba(2,8,22,0.7)" />
      <ModalContent bg="rgba(8,20,50,0.88)" backdropFilter="blur(24px)" border="1px solid" borderColor="rgba(255,255,255,0.12)" borderRadius="2xl" style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.5)' }}>
        <ModalHeader pb={2}>
          <Flex align="center" gap={3}>
            <Box
              w="36px"
              h="36px"
              borderRadius="lg"
              bg={`${selectedPlatform.color}22`}
              border="1px solid"
              borderColor={`${selectedPlatform.color}44`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="md"
              flexShrink={0}
            >
              {selectedPlatform.icon}
            </Box>
            <Box>
              <Text color="white" fontWeight="700" fontSize="lg">
                {editEntry ? 'Edit Entry' : 'Add Daily Entry'}
              </Text>
              <Text color="whiteAlpha.500" fontSize="xs">
                {editEntry ? `Editing ${editEntry.date}` : 'Log today\'s performance metrics'}
              </Text>
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="whiteAlpha.600" />

        <ModalBody pt={2}>
          <Grid templateColumns="1fr 1fr" gap={4} mb={4}>
            <FormControl>
              <FormLabel color="whiteAlpha.600" fontSize="xs" fontWeight="600" letterSpacing="wider" textTransform="uppercase">
                Date
              </FormLabel>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                bg="rgba(255,255,255,0.07)"
                border="1px solid"
                borderColor="rgba(255,255,255,0.15)"
                color="white"
                _hover={{ borderColor: 'rgba(255,255,255,0.3)' }}
                _focus={{ borderColor: 'rgba(100,180,255,0.7)', boxShadow: '0 0 0 1px rgba(100,180,255,0.3)' }}
                borderRadius="lg"
                size="sm"
              />
            </FormControl>

            <FormControl>
              <FormLabel color="whiteAlpha.600" fontSize="xs" fontWeight="600" letterSpacing="wider" textTransform="uppercase">
                Platform
              </FormLabel>
              <Select
                value={form.platform}
                onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value as Platform }))}
                bg="rgba(255,255,255,0.07)"
                border="1px solid"
                borderColor="rgba(255,255,255,0.15)"
                color="white"
                _hover={{ borderColor: 'rgba(255,255,255,0.3)' }}
                _focus={{ borderColor: 'rgba(100,180,255,0.7)', boxShadow: '0 0 0 1px rgba(100,180,255,0.3)' }}
                borderRadius="lg"
                size="sm"
              >
                {platforms.map(([key, meta]) => (
                  <option key={key} value={key} style={{ background: '#060e28' }}>
                    {meta.label}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid templateColumns="1fr 1fr" gap={3} mb={4}>
            {numFields.map(({ field, label }) => (
              <FormControl key={field}>
                <FormLabel color="whiteAlpha.600" fontSize="xs" fontWeight="600" letterSpacing="wider" textTransform="uppercase">
                  {label}
                </FormLabel>
                <NumberInput
                  min={0}
                  value={form[field] as number}
                  onChange={(val) => setNum(field, val)}
                  size="sm"
                >
                  <NumberInputField
                    bg="rgba(255,255,255,0.07)"
                    border="1px solid"
                    borderColor="rgba(255,255,255,0.15)"
                    color="white"
                    _hover={{ borderColor: 'rgba(255,255,255,0.3)' }}
                    _focus={{ borderColor: 'rgba(100,180,255,0.7)', boxShadow: '0 0 0 1px rgba(100,180,255,0.3)' }}
                    borderRadius="lg"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper color="whiteAlpha.500" borderColor="whiteAlpha.200" />
                    <NumberDecrementStepper color="whiteAlpha.500" borderColor="whiteAlpha.200" />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            ))}
          </Grid>

          <FormControl>
            <FormLabel color="whiteAlpha.600" fontSize="xs" fontWeight="600" letterSpacing="wider" textTransform="uppercase">
              Notes (optional)
            </FormLabel>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="e.g. Reel went viral, posted at 6pm..."
              bg="rgba(255,255,255,0.07)"
              border="1px solid"
              borderColor="rgba(255,255,255,0.15)"
              color="white"
              _placeholder={{ color: 'rgba(255,255,255,0.3)' }}
              _hover={{ borderColor: 'rgba(255,255,255,0.3)' }}
              _focus={{ borderColor: 'rgba(100,180,255,0.7)', boxShadow: '0 0 0 1px rgba(100,180,255,0.3)' }}
              borderRadius="lg"
              size="sm"
              rows={2}
              resize="none"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button
            variant="ghost"
            color="whiteAlpha.600"
            _hover={{ bg: 'whiteAlpha.100' }}
            onClick={onClose}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            bg="blue.500"
            color="white"
            _hover={{ bg: 'blue.400' }}
            onClick={handleSubmit}
            isLoading={loading}
            size="sm"
            borderRadius="lg"
            px={6}
          >
            {editEntry ? 'Update Entry' : 'Save Entry'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
