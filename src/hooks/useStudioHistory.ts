'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const MAX_HISTORY = 80
const DEBOUNCE_MS = 450

type HistorySnapshot<T> = {
  past: T[]
  present: T
  future: T[]
}

export type HistoryMode = 'debounced' | 'immediate' | 'skip'

function clone<T>(value: T): T {
  return structuredClone(value)
}

export function useStudioHistory<T>(initial: T | null) {
  const [snapshot, setSnapshot] = useState<HistorySnapshot<T> | null>(
    initial !== null ? { past: [], present: initial, future: [] } : null,
  )

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const debounceBaselineRef = useRef<T | null>(null)
  const snapshotRef = useRef(snapshot)
  snapshotRef.current = snapshot

  const flushDebounced = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
    const baseline = debounceBaselineRef.current
    debounceBaselineRef.current = null
    if (!baseline || !snapshotRef.current) return

    setSnapshot((prev) => {
      if (!prev) return prev
      return {
        past: [...prev.past, clone(baseline)].slice(-MAX_HISTORY),
        present: prev.present,
        future: [],
      }
    })
  }, [])

  const mutate = useCallback(
    (updater: (prev: T) => T, mode: HistoryMode = 'debounced') => {
      setSnapshot((prev) => {
        if (!prev) return prev
        const next = updater(prev.present)

        if (mode === 'skip') {
          return { ...prev, present: next }
        }

        if (mode === 'immediate') {
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
            debounceTimerRef.current = null
          }
          debounceBaselineRef.current = null
          return {
            past: [...prev.past, clone(prev.present)].slice(-MAX_HISTORY),
            present: next,
            future: [],
          }
        }

        if (!debounceBaselineRef.current) {
          debounceBaselineRef.current = clone(prev.present)
        }
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = setTimeout(flushDebounced, DEBOUNCE_MS)

        return { ...prev, present: next, future: [] }
      })
    },
    [flushDebounced],
  )

  const replace = useCallback(
    (next: T, mode: HistoryMode = 'immediate') => {
      if (mode === 'skip') {
        setSnapshot((prev) => (prev ? { ...prev, present: next } : { past: [], present: next, future: [] }))
        return
      }

      if (mode === 'immediate') {
        flushDebounced()
        setSnapshot((prev) => {
          if (!prev) return { past: [], present: next, future: [] }
          return {
            past: [...prev.past, clone(prev.present)].slice(-MAX_HISTORY),
            present: next,
            future: [],
          }
        })
        return
      }

      // debounced — batch rapid edits into one undo step
      setSnapshot((prev) => {
        if (!prev) return { past: [], present: next, future: [] }
        if (!debounceBaselineRef.current) {
          debounceBaselineRef.current = clone(prev.present)
        }
        return { ...prev, present: next, future: [] }
      })

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(flushDebounced, DEBOUNCE_MS)
    },
    [flushDebounced],
  )

  const undo = useCallback(() => {
    flushDebounced()
    setSnapshot((prev) => {
      if (!prev || prev.past.length === 0) return prev
      const previous = prev.past[prev.past.length - 1]
      return {
        past: prev.past.slice(0, -1),
        present: clone(previous),
        future: [clone(prev.present), ...prev.future].slice(0, MAX_HISTORY),
      }
    })
  }, [flushDebounced])

  const redo = useCallback(() => {
    flushDebounced()
    setSnapshot((prev) => {
      if (!prev || prev.future.length === 0) return prev
      const next = prev.future[0]
      return {
        past: [...prev.past, clone(prev.present)].slice(-MAX_HISTORY),
        present: clone(next),
        future: prev.future.slice(1),
      }
    })
  }, [flushDebounced])

  const resetHistory = useCallback(
    (next: T) => {
      flushDebounced()
      setSnapshot({ past: [], present: clone(next), future: [] })
    },
    [flushDebounced],
  )

  useEffect(
    () => () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    },
    [],
  )

  const canUndo = (snapshot?.past.length ?? 0) > 0
  const canRedo = (snapshot?.future.length ?? 0) > 0
  const present = snapshot?.present ?? null

  return {
    present,
    replace,
    mutate,
    undo,
    redo,
    resetHistory,
    flushDebounced,
    canUndo,
    canRedo,
  }
}
