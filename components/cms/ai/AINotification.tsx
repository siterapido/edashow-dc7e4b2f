'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Sparkles,
  Check,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type NotificationType = 'loading' | 'success' | 'error' | 'info'

interface AINotificationProps {
  show: boolean
  type: NotificationType
  message: string
  onClose?: () => void
  autoClose?: boolean
  autoCloseDelay?: number
}

export function AINotification({
  show,
  type,
  message,
  onClose,
  autoClose = true,
  autoCloseDelay = 3000
}: AINotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    if (show) {
      setIsVisible(true)

      if (autoClose && type !== 'loading') {
        const timer = setTimeout(() => {
          setIsVisible(false)
          onClose?.()
        }, autoCloseDelay)

        return () => clearTimeout(timer)
      }
    } else {
      setIsVisible(false)
    }
  }, [show, type, autoClose, autoCloseDelay, onClose])

  if (!isMounted || !isVisible) return null

  const icons = {
    loading: <Loader2 className="w-4 h-4 animate-spin" />,
    success: <Check className="w-4 h-4" />,
    error: <AlertCircle className="w-4 h-4" />,
    info: <Sparkles className="w-4 h-4" />
  }

  const colors = {
    loading: 'bg-purple-500 text-white',
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  }

  const content = (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]",
        "flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl",
        "transform transition-all duration-300 ease-out",
        colors[type],
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      {type !== 'loading' && onClose && (
        <button
          onClick={() => {
            setIsVisible(false)
            onClose()
          }}
          className="ml-2 p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )

  return createPortal(content, document.body)
}

// Hook for managing AI notifications
export function useAINotification() {
  const [notification, setNotification] = useState<{
    show: boolean
    type: NotificationType
    message: string
  }>({
    show: false,
    type: 'info',
    message: ''
  })

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ show: true, type, message })
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }))
  }

  const showLoading = (message: string = 'Processando com IA...') => {
    showNotification('loading', message)
  }

  const showSuccess = (message: string = 'Operacao concluida!') => {
    showNotification('success', message)
  }

  const showError = (message: string = 'Erro na operacao') => {
    showNotification('error', message)
  }

  return {
    notification,
    showNotification,
    hideNotification,
    showLoading,
    showSuccess,
    showError,
    NotificationComponent: () => (
      <AINotification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={hideNotification}
      />
    )
  }
}

export default AINotification
