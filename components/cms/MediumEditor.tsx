'use client'

import React, { useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'


import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Link as LinkIcon,
    Heading1,
    Heading2,
    Quote,
    ImageIcon,
    Minus,
    List,
    ListOrdered,
    Undo,
    Redo,
    Type
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadMedia } from '@/lib/actions/cms-media'

interface MediumEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

export function MediumEditor({ content, onChange, placeholder = 'Comece a escrever sua história...' }: MediumEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3]
                }
            }),
            Underline,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full mx-auto my-6'
                }
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-orange-400 underline hover:text-orange-300 transition-colors'
                }
            }),
            Placeholder.configure({
                placeholder,
            }),
            CharacterCount,
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-lg max-w-none min-h-[300px] outline-none px-4 py-6 md:px-0 text-slate-200 prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-blockquote:border-orange-500 prose-blockquote:text-slate-400',
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer?.files.length) {
                    const files = Array.from(event.dataTransfer.files)
                    const images = files.filter(file => file.type.startsWith('image/'))

                    if (images.length > 0) {
                        event.preventDefault()
                        images.forEach(image => handleImageUpload(image))
                        return true
                    }
                }
                return false
            },
            handlePaste: (view, event, slice) => {
                const items = event.clipboardData?.items
                if (items) {
                    for (const item of Array.from(items)) {
                        if (item.type.startsWith('image/')) {
                            event.preventDefault()
                            const file = item.getAsFile()
                            if (file) handleImageUpload(file)
                            return true
                        }
                    }
                }
                return false
            }
        },
    })

    const handleImageUpload = useCallback(async (file: File) => {
        if (!editor) return

        // Insert placeholder
        const placeholderId = `uploading-${Date.now()}`
        editor.chain().focus().setImage({
            src: '/placeholder.jpg',
            alt: 'Carregando...',
        }).run()

        try {
            const formData = new FormData()
            formData.append('file', file)
            const result = await uploadMedia(formData)

            // Replace placeholder with actual image
            editor.chain().focus().setImage({
                src: result.url,
                alt: file.name
            }).run()
        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error)
            alert('Erro ao fazer upload da imagem. Tente novamente.')
        }
    }, [editor])

    const triggerImageUpload = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleImageUpload(file)
            e.target.value = ''
        }
    }, [handleImageUpload])

    const setLink = useCallback(() => {
        if (!editor) return

        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL do link:', previousUrl)

        if (url === null) return

        if (url === '') {
            editor.chain().focus().unsetLink().run()
            return
        }

        editor.chain().focus().setLink({ href: url }).run()
    }, [editor])

    if (!editor) return null

    const characterCount = editor.storage.characterCount.characters()
    const wordCount = editor.storage.characterCount.words()

    return (
        <div className="relative">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Bubble Menu - appears on text selection */}
            <BubbleMenu
                editor={editor}
                className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl flex items-center gap-0.5 p-1 overflow-hidden"
            >
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Negrito"
                >
                    <Bold className="w-4 h-4" />
                </BubbleButton>
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Itálico"
                >
                    <Italic className="w-4 h-4" />
                </BubbleButton>
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Sublinhado"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </BubbleButton>

                <div className="w-px h-5 bg-slate-700 mx-1" />

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="Título 1"
                >
                    <Heading1 className="w-4 h-4" />
                </BubbleButton>
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Título 2"
                >
                    <Heading2 className="w-4 h-4" />
                </BubbleButton>

                <div className="w-px h-5 bg-slate-700 mx-1" />

                <BubbleButton
                    onClick={setLink}
                    isActive={editor.isActive('link')}
                    title="Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </BubbleButton>
            </BubbleMenu>

            {/* Floating Menu - appears on empty lines */}
            <FloatingMenu
                editor={editor}
                className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl flex items-center gap-0.5 p-1"
            >
                <FloatingButton
                    onClick={triggerImageUpload}
                    title="Adicionar imagem"
                >
                    <ImageIcon className="w-4 h-4" />
                </FloatingButton>
                <FloatingButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    title="Citação"
                >
                    <Quote className="w-4 h-4" />
                </FloatingButton>
                <FloatingButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Separador"
                >
                    <Minus className="w-4 h-4" />
                </FloatingButton>
                <FloatingButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Lista"
                >
                    <List className="w-4 h-4" />
                </FloatingButton>
                <FloatingButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Lista numerada"
                >
                    <ListOrdered className="w-4 h-4" />
                </FloatingButton>
            </FloatingMenu>

            {/* Editor Content */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                <EditorContent editor={editor} />

                {/* Character/Word count */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800 text-xs text-slate-500">
                    <span>{wordCount} palavras</span>
                    <span>{characterCount} caracteres</span>
                </div>
            </div>

            {/* Mobile Bottom Toolbar */}
            <MobileToolbar editor={editor} onImageUpload={triggerImageUpload} />
        </div>
    )
}

// Bubble Menu Button Component
function BubbleButton({
    onClick,
    isActive,
    children,
    title
}: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={cn(
                "p-2 rounded-md transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center",
                isActive
                    ? "bg-orange-500 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
            )}
        >
            {children}
        </button>
    )
}

// Floating Menu Button Component
function FloatingButton({
    onClick,
    children,
    title
}: {
    onClick: () => void
    children: React.ReactNode
    title: string
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className="p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
        >
            {children}
        </button>
    )
}

// Mobile Toolbar Component
function MobileToolbar({
    editor,
    onImageUpload
}: {
    editor: any
    onImageUpload: () => void
}) {
    if (!editor) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 md:hidden safe-area-pb">
            <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto scrollbar-hide">
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                >
                    <Bold className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                >
                    <Italic className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                >
                    <UnderlineIcon className="w-5 h-5" />
                </MobileToolbarButton>

                <div className="w-px h-6 bg-slate-700 mx-1 flex-shrink-0" />

                <MobileToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                >
                    <Heading1 className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                >
                    <Heading2 className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    isActive={editor.isActive('paragraph')}
                >
                    <Type className="w-5 h-5" />
                </MobileToolbarButton>

                <div className="w-px h-6 bg-slate-700 mx-1 flex-shrink-0" />

                <MobileToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                >
                    <List className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                >
                    <Quote className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton onClick={onImageUpload}>
                    <ImageIcon className="w-5 h-5" />
                </MobileToolbarButton>

                <div className="w-px h-6 bg-slate-700 mx-1 flex-shrink-0" />

                <MobileToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="w-5 h-5" />
                </MobileToolbarButton>
            </div>
        </div>
    )
}

// Mobile Toolbar Button Component
function MobileToolbarButton({
    onClick,
    isActive,
    disabled,
    children
}: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "p-3 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0",
                isActive
                    ? "bg-orange-500 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                disabled && "opacity-30 cursor-not-allowed"
            )}
        >
            {children}
        </button>
    )
}
