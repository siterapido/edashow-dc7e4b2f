'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  Mic,
  MicOff,
  Upload,
  Play,
  Pause,
  Loader2,
  FileAudio,
  X,
  Check,
  AlertCircle,
  Clock,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  checkTranscriptionService,
  transcribeAudioFile,
  type ProcessedTranscription
} from '@/lib/actions/ai-audio'

interface AudioTranscriberProps {
  onTranscriptionComplete: (result: ProcessedTranscription) => void
  onClose: () => void
}

type Step = 'upload' | 'recording' | 'processing' | 'review'

export function AudioTranscriber({
  onTranscriptionComplete,
  onClose
}: AudioTranscriberProps) {
  const [step, setStep] = useState<Step>('upload')
  const [isServiceAvailable, setIsServiceAvailable] = useState<boolean | null>(null)
  const [supportedFormats, setSupportedFormats] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // Audio file state
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Transcription state
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionResult, setTranscriptionResult] = useState<ProcessedTranscription | null>(null)

  // Check service availability on mount
  useEffect(() => {
    checkTranscriptionService().then(result => {
      setIsServiceAvailable(result.available)
      setSupportedFormats(result.supportedFormats)
    })
  }, [])

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  // Handle file upload
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const maxSize = 25 * 1024 * 1024 // 25MB
    if (file.size > maxSize) {
      setError(`Arquivo muito grande. Máximo permitido: 25MB`)
      return
    }

    setError(null)
    setAudioFile(file)

    // Create audio URL for preview
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    const url = URL.createObjectURL(file)
    setAudioUrl(url)
  }, [audioUrl])

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' })
        setAudioFile(file)
        setAudioChunks(chunks)

        // Create audio URL
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl)
        }
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start(1000) // Collect data every second
      setMediaRecorder(recorder)
      setIsRecording(true)
      setStep('recording')
      setRecordingTime(0)

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(t => t + 1)
      }, 1000)

      setError(null)
    } catch (err) {
      console.error('Recording error:', err)
      setError('Não foi possível acessar o microfone. Verifique as permissões do navegador.')
    }
  }, [audioUrl])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
    setIsRecording(false)
    setStep('upload')

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
      recordingIntervalRef.current = null
    }
  }, [mediaRecorder])

  // Toggle audio playback
  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  // Handle audio end
  const handleAudioEnd = useCallback(() => {
    setIsPlaying(false)
  }, [])

  // Clear audio
  const clearAudio = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioFile(null)
    setAudioUrl(null)
    setAudioChunks([])
    setRecordingTime(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [audioUrl])

  // Transcribe audio
  const handleTranscribe = useCallback(async () => {
    if (!audioFile) return

    setIsTranscribing(true)
    setStep('processing')
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioFile)

      const result = await transcribeAudioFile(formData)
      setTranscriptionResult(result)
      setStep('review')
    } catch (err) {
      console.error('Transcription error:', err)
      setError(err instanceof Error ? err.message : 'Erro ao transcrever áudio')
      setStep('upload')
    } finally {
      setIsTranscribing(false)
    }
  }, [audioFile])

  // Use transcription
  const handleUseTranscription = useCallback(() => {
    if (transcriptionResult) {
      onTranscriptionComplete(transcriptionResult)
      onClose()
    }
  }, [transcriptionResult, onTranscriptionComplete, onClose])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isServiceAvailable === null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl p-8 flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          <span>Verificando serviço...</span>
        </div>
      </div>
    )
  }

  if (!isServiceAvailable) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Serviço Indisponível</h2>
          <p className="text-gray-600 mb-4">
            A transcrição de áudio requer a configuração da API do OpenAI.
            Adicione OPENAI_API_KEY ao arquivo .env para habilitar esta funcionalidade.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mic className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Transcrição de Áudio</h2>
              <p className="text-sm text-gray-500">
                {step === 'upload' && 'Grave ou envie um áudio para transcrever'}
                {step === 'recording' && 'Gravando...'}
                {step === 'processing' && 'Transcrevendo áudio...'}
                {step === 'review' && 'Revise a transcrição'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Upload/Record Step */}
          {(step === 'upload' || step === 'recording') && (
            <div className="space-y-6">
              {/* Recording */}
              {step === 'recording' ? (
                <div className="flex flex-col items-center py-8">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                      <Mic className="w-12 h-12 text-red-500" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                      {formatTime(recordingTime)}
                    </div>
                  </div>
                  <button
                    onClick={stopRecording}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <MicOff className="w-5 h-5" />
                    Parar Gravação
                  </button>
                </div>
              ) : (
                <>
                  {/* Audio Preview */}
                  {audioFile && audioUrl ? (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={togglePlayback}
                          className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center hover:bg-purple-600 transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{audioFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        <button
                          onClick={clearAudio}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <audio
                        ref={audioRef}
                        src={audioUrl}
                        onEnded={handleAudioEnd}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <>
                      {/* Upload Area */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-purple-300 hover:bg-purple-50/50 transition-all"
                      >
                        <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="font-medium text-gray-700 mb-1">Arraste um arquivo ou clique para enviar</p>
                        <p className="text-sm text-gray-500">
                          Formatos: {supportedFormats.join(', ')} | Máximo: 25MB
                        </p>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*,.mp3,.wav,.m4a,.webm"
                        onChange={handleFileSelect}
                        className="hidden"
                      />

                      {/* Divider */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1 border-t border-gray-200" />
                        <span className="text-sm text-gray-400">ou</span>
                        <div className="flex-1 border-t border-gray-200" />
                      </div>

                      {/* Record Button */}
                      <button
                        onClick={startRecording}
                        className="w-full py-4 border-2 border-purple-200 rounded-xl text-purple-600 font-medium hover:bg-purple-50 hover:border-purple-300 transition-all flex items-center justify-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Mic className="w-5 h-5" />
                        </div>
                        <span>Gravar Áudio</span>
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="flex flex-col items-center py-12">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Transcrevendo áudio...</h3>
              <p className="text-gray-500 text-center">
                Isso pode levar alguns segundos dependendo do tamanho do arquivo.
              </p>
            </div>
          )}

          {/* Review Step */}
          {step === 'review' && transcriptionResult && (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título Sugerido</label>
                <input
                  type="text"
                  value={transcriptionResult.title}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resumo</label>
                <textarea
                  value={transcriptionResult.excerpt}
                  readOnly
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 resize-none"
                />
              </div>

              {/* Content Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
                <div
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 max-h-48 overflow-y-auto prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: transcriptionResult.content }}
                />
              </div>

              {/* Duration */}
              {transcriptionResult.duration && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Duração do áudio: {formatTime(Math.round(transcriptionResult.duration))}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <button
            onClick={step === 'review' ? () => setStep('upload') : onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {step === 'review' ? 'Voltar' : 'Cancelar'}
          </button>

          {step === 'upload' && audioFile && (
            <button
              onClick={handleTranscribe}
              disabled={isTranscribing}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isTranscribing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileAudio className="w-4 h-4" />
              )}
              Transcrever
            </button>
          )}

          {step === 'review' && (
            <button
              onClick={handleUseTranscription}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Usar Transcrição
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AudioTranscriber
