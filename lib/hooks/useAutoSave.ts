'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseAutoSaveOptions {
    delay?: number
    onSave: (data: any) => Promise<void>
    data: any
    enabled?: boolean
}

export function useAutoSave({
    delay = 5000,
    onSave,
    data,
    enabled = true
}: UseAutoSaveOptions) {
    const [isSaving, setIsSaving] = useState(false)
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const dataRef = useRef(data)
    const initialDataRef = useRef(JSON.stringify(data))

    // Update data ref when data changes
    useEffect(() => {
        const currentDataString = JSON.stringify(data)
        const hasChanges = currentDataString !== initialDataRef.current

        dataRef.current = data
        setHasUnsavedChanges(hasChanges)

        if (!enabled || !hasChanges) return

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        // Set new timeout for auto-save
        timeoutRef.current = setTimeout(async () => {
            await saveData()
        }, delay)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [data, delay, enabled])

    const saveData = useCallback(async () => {
        if (isSaving) return

        setIsSaving(true)
        try {
            await onSave(dataRef.current)
            setLastSavedAt(new Date())
            setHasUnsavedChanges(false)
            initialDataRef.current = JSON.stringify(dataRef.current)
        } catch (error) {
            console.error('Auto-save failed:', error)
        } finally {
            setIsSaving(false)
        }
    }, [onSave, isSaving])

    const saveNow = useCallback(async () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        await saveData()
    }, [saveData])

    const getStatusText = useCallback(() => {
        if (isSaving) return 'Salvando...'
        if (!hasUnsavedChanges && lastSavedAt) {
            const diff = Date.now() - lastSavedAt.getTime()
            if (diff < 60000) return 'Salvo agora'
            const minutes = Math.floor(diff / 60000)
            return `Salvo há ${minutes} min`
        }
        if (hasUnsavedChanges) return 'Alterações não salvas'
        return 'Rascunho'
    }, [isSaving, hasUnsavedChanges, lastSavedAt])

    return {
        isSaving,
        lastSavedAt,
        hasUnsavedChanges,
        saveNow,
        statusText: getStatusText()
    }
}
