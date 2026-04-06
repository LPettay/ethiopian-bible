import { useState, useCallback } from 'react'
import type { ReaderSettings } from '../types/bible'
import { loadSettings, saveSettings } from '../lib/storage'

export function useSettings(): [ReaderSettings, (patch: Partial<ReaderSettings>) => void] {
  const [settings, setSettings] = useState<ReaderSettings>(loadSettings)

  const updateSetting = useCallback((patch: Partial<ReaderSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch }
      saveSettings(next)
      return next
    })
  }, [])

  return [settings, updateSetting]
}
