"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
}

export function RichTextEditor({ value, onChange, disabled = false }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-purple-600 underline cursor-pointer",
        },
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Synchronize initial content loads
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter link URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-250 dark:border-slate-850">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${
            editor.isActive("bold") ? "bg-slate-200 dark:bg-slate-800 text-purple-650" : "text-slate-550"
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${
            editor.isActive("italic") ? "bg-slate-200 dark:bg-slate-800 text-purple-655" : "text-slate-550"
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${
            editor.isActive("heading", { level: 1 }) ? "bg-slate-200 dark:bg-slate-800 text-purple-655" : "text-slate-550"
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${
            editor.isActive("heading", { level: 2 }) ? "bg-slate-200 dark:bg-slate-800 text-purple-655" : "text-slate-550"
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${
            editor.isActive("bulletList") ? "bg-slate-200 dark:bg-slate-800 text-purple-655" : "text-slate-550"
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${
            editor.isActive("orderedList") ? "bg-slate-200 dark:bg-slate-800 text-purple-655" : "text-slate-550"
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={addLink}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${
            editor.isActive("link") ? "bg-slate-200 dark:bg-slate-800 text-purple-655" : "text-slate-550"
          }`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={removeLink}
          disabled={disabled || !editor.isActive("link")}
          className="p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-550 disabled:opacity-40 cursor-pointer"
          title="Remove Link"
        >
          <Unlink className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1 ml-auto" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
          className="p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-550 disabled:opacity-40 cursor-pointer"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
          className="p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-550 disabled:opacity-40 cursor-pointer"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 min-h-[300px] prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 focus-within:outline-none">
        <EditorContent editor={editor} className="focus:outline-none" />
      </div>
    </div>
  );
}
