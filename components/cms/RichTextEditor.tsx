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
                class: 'prose prose-invert max-w-none min-h-[400px] outline-none p-6 text-slate-300',
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
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            {/* Toolbar */}
            <div className="bg-slate-900 border-b border-slate-800 p-2 flex flex-wrap gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn("h-8 w-8", editor.isActive('bold') && "bg-slate-800 text-orange-400")}
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn("h-8 w-8", editor.isActive('italic') && "bg-slate-800 text-orange-400")}
                >
                    <Italic className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={cn("h-8 w-8", editor.isActive('underline') && "bg-slate-800 text-orange-400")}
                >
                    <UnderlineIcon className="w-4 h-4" />
                </Button>

                <div className="w-px h-4 bg-slate-800 mx-1 my-auto" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={cn("h-8 w-8", editor.isActive('heading', { level: 1 }) && "bg-slate-800 text-orange-400")}
                >
                    <Heading1 className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn("h-8 w-8", editor.isActive('heading', { level: 2 }) && "bg-slate-800 text-orange-400")}
                >
                    <Heading2 className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn("h-8 w-8", editor.isActive('blockquote') && "bg-slate-800 text-orange-400")}
                >
                    <Quote className="w-4 h-4" />
                </Button>

                <div className="w-px h-4 bg-slate-800 mx-1 my-auto" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn("h-8 w-8", editor.isActive('bulletList') && "bg-slate-800 text-orange-400")}
                >
                    <List className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn("h-8 w-8", editor.isActive('orderedList') && "bg-slate-800 text-orange-400")}
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>

                <div className="w-px h-4 bg-slate-800 mx-1 my-auto" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={setLink}
                    className={cn("h-8 w-8", editor.isActive('link') && "bg-slate-800 text-orange-400")}
                >
                    <LinkIcon className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={addImage}
                    className="h-8 w-8 text-slate-400 hover:text-white"
                >
                    <ImageIcon className="w-4 h-4" />
                </Button>
            </div>

            {/* Editor Area */}
            <div className="bg-slate-950">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
