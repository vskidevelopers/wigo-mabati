'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link as LinkIcon,
    Undo,
    Redo,
} from 'lucide-react'

interface TiptapEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
    editable?: boolean
}

export default function TiptapEditor({
    content,
    onChange,
    placeholder = 'Start typing...',
    editable = true
}: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: content,
        editable: editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
            },
        },
    })

    useEffect(() => {
        if (editor && editor.getHTML() !== content) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    if (!editor) {
        return null
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) {
            return
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            {editable && (
                <>
                    <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            data-active={editor.isActive('bold') ? 'is-active' : undefined}
                        >
                            <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            data-active={editor.isActive('italic') ? 'is-active' : undefined}
                        >
                            <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            data-active={editor.isActive('underline') ? 'is-active' : undefined}
                        >
                            <UnderlineIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            data-active={editor.isActive('strike') ? 'is-active' : undefined}
                        >
                            <Strikethrough className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            data-active={editor.isActive('code') ? 'is-active' : undefined}
                        >
                            <Code className="h-4 w-4" />
                        </Button>

                        <Separator orientation="vertical" className="h-6 mx-1" />

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            data-active={editor.isActive('bulletList') ? 'is-active' : undefined}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            data-active={editor.isActive('orderedList') ? 'is-active' : undefined}
                        >
                            <ListOrdered className="h-4 w-4" />
                        </Button>

                        <Separator orientation="vertical" className="h-6 mx-1" />

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            data-active={editor.isActive({ textAlign: 'left' }) ? 'is-active' : undefined}
                        >
                            <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            data-active={editor.isActive({ textAlign: 'center' }) ? 'is-active' : undefined}
                        >
                            <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            data-active={editor.isActive({ textAlign: 'right' }) ? 'is-active' : undefined}
                        >
                            <AlignRight className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                            data-active={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : undefined}
                        >
                            <AlignJustify className="h-4 w-4" />
                        </Button>

                        <Separator orientation="vertical" className="h-6 mx-1" />

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={setLink}
                            data-active={editor.isActive('link') ? 'is-active' : undefined}
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>

                        <Separator orientation="vertical" className="h-6 mx-1" />

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                        >
                            <Undo className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                        >
                            <Redo className="h-4 w-4" />
                        </Button>
                    </div>
                </>
            )}
            <EditorContent editor={editor} />
            <style jsx global>{`
                .ProseMirror {
                    min-height: 200px;
                    padding: 1rem;
                }
                .ProseMirror:focus {
                    outline: none;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
            `}</style>
        </div>
    )
}