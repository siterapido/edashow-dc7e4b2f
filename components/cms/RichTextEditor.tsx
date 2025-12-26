'use client'

import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    ImageIcon,
    Link as LinkIcon,
    Heading1,
    Heading2,
    Quote
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: 'Comece a escrever seu conteúdo...',
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose max-w-none min-h-[400px] outline-none p-6 text-gray-700',
            },
        },
    })

    if (!editor) return null

    const addImage = () => {
        const url = window.prompt('URL da imagem:')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const setLink = () => {
        const url = window.prompt('URL do link:')
        if (url) {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-100 p-2 flex flex-wrap gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn("h-8 w-8", editor.isActive('bold') && "bg-gray-200 text-orange-600")}
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn("h-8 w-8", editor.isActive('italic') && "bg-gray-200 text-orange-600")}
                >
                    <Italic className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={cn("h-8 w-8", editor.isActive('underline') && "bg-gray-200 text-orange-600")}
                >
                    <UnderlineIcon className="w-4 h-4" />
                </Button>

                <div className="w-px h-4 bg-gray-200 mx-1 my-auto" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={cn("h-8 w-8", editor.isActive('heading', { level: 1 }) && "bg-gray-200 text-orange-600")}
                >
                    <Heading1 className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn("h-8 w-8", editor.isActive('heading', { level: 2 }) && "bg-gray-200 text-orange-600")}
                >
                    <Heading2 className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn("h-8 w-8", editor.isActive('blockquote') && "bg-gray-200 text-orange-600")}
                >
                    <Quote className="w-4 h-4" />
                </Button>

                <div className="w-px h-4 bg-gray-200 mx-1 my-auto" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn("h-8 w-8", editor.isActive('bulletList') && "bg-gray-200 text-orange-600")}
                >
                    <List className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn("h-8 w-8", editor.isActive('orderedList') && "bg-gray-200 text-orange-600")}
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>

                <div className="w-px h-4 bg-gray-200 mx-1 my-auto" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={setLink}
                    className={cn("h-8 w-8", editor.isActive('link') && "bg-gray-200 text-orange-600")}
                >
                    <LinkIcon className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={addImage}
                    className="h-8 w-8 text-gray-500 hover:text-gray-900"
                >
                    <ImageIcon className="w-4 h-4" />
                </Button>
            </div>

            {/* Editor Area */}
            <div className="bg-white">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
