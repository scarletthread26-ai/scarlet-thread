"use client";

import React, { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Image as ImageIcon,
  Quote,
  Minus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
}

export function RichTextEditor({ value, onChange, disabled = false }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-purple-650 dark:text-purple-400 underline cursor-pointer",
        },
      }),
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl max-w-full my-5 shadow-md border border-slate-200 dark:border-slate-800 mx-auto block",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-slate-300 dark:border-slate-800 w-full my-5 text-sm",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 font-bold text-left",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-slate-300 dark:border-slate-800 px-3 py-2.5",
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

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value to allow uploading same file again
    e.target.value = "";

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Uploading inline image to Cloudinary...");
    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image. Please try again.");
      }

      const data = await response.json();
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
        toast.success("Image added to content!", { id: toastId });
      } else {
        throw new Error("Invalid server response.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Upload failed.", { id: toastId });
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
      {/* Hidden file input for image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-250 dark:border-slate-850">
        
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-850 cursor-pointer ${
            editor.isActive("heading", { level: 1 }) ? "bg-slate-200 dark:bg-slate-800 text-purple-650 font-bold" : "text-slate-550"
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-850 cursor-pointer ${
            editor.isActive("heading", { level: 2 }) ? "bg-slate-200 dark:bg-slate-800 text-purple-655 font-bold" : "text-slate-550"
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-850 cursor-pointer ${
            editor.isActive("heading", { level: 3 }) ? "bg-slate-200 dark:bg-slate-800 text-purple-655 font-bold" : "text-slate-550"
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-850 cursor-pointer ${
            editor.isActive("heading", { level: 4 }) ? "bg-slate-200 dark:bg-slate-800 text-purple-655 font-bold" : "text-slate-550"
          }`}
          title="Heading 4"
        >
          <Heading4 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Text styling */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-850 cursor-pointer ${
            editor.isActive("bold") ? "bg-slate-200 dark:bg-slate-800 text-purple-650 font-bold" : "text-slate-550"
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-850 cursor-pointer ${
            editor.isActive("italic") ? "bg-slate-200 dark:bg-slate-800 text-purple-650 font-bold" : "text-slate-550"
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-850 cursor-pointer ${
            editor.isActive("underline") ? "bg-slate-200 dark:bg-slate-800 text-purple-650 font-bold" : "text-slate-550"
          }`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Text Alignments */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-855 cursor-pointer ${
            editor.isActive({ textAlign: "left" }) ? "bg-slate-200 dark:bg-slate-800 text-purple-650" : "text-slate-550"
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-855 cursor-pointer ${
            editor.isActive({ textAlign: "center" }) ? "bg-slate-200 dark:bg-slate-800 text-purple-650" : "text-slate-555"
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-855 cursor-pointer ${
            editor.isActive({ textAlign: "right" }) ? "bg-slate-200 dark:bg-slate-800 text-purple-650" : "text-slate-555"
          }`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-855 cursor-pointer ${
            editor.isActive({ textAlign: "justify" }) ? "bg-slate-200 dark:bg-slate-800 text-purple-650" : "text-slate-555"
          }`}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Lists & formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-850 cursor-pointer ${
            editor.isActive("bulletList") ? "bg-slate-200 dark:bg-slate-800 text-purple-650" : "text-slate-550"
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-850 cursor-pointer ${
            editor.isActive("orderedList") ? "bg-slate-200 dark:bg-slate-800 text-purple-650" : "text-slate-550"
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-850 cursor-pointer ${
            editor.isActive("blockquote") ? "bg-slate-200 dark:bg-slate-800 text-purple-655" : "text-slate-550"
          }`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          disabled={disabled}
          className="p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-550 cursor-pointer"
          title="Divider Line"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Media & Links */}
        <button
          type="button"
          onClick={addLink}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-850 cursor-pointer ${
            editor.isActive("link") ? "bg-slate-200 dark:bg-slate-800 text-purple-650" : "text-slate-550"
          }`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={removeLink}
          disabled={disabled || !editor.isActive("link")}
          className="p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-855 text-slate-550 disabled:opacity-40 cursor-pointer"
          title="Remove Link"
        >
          <Unlink className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={triggerImageUpload}
          disabled={disabled}
          className="p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-855 text-slate-550 cursor-pointer"
          title="Upload Inline Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={insertTable}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-855 cursor-pointer ${
            editor.isActive("table") ? "bg-slate-200 dark:bg-slate-800 text-purple-650" : "text-slate-550"
          }`}
          title="Insert Table (3x3)"
        >
          <TableIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteSelection().run()}
          disabled={disabled}
          className="p-1.5 rounded-lg transition hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 hover:text-rose-700 cursor-pointer"
          title="Delete selected item (image, table, or text)"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Undo/Redo */}
        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1 ml-auto" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
          className="p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-855 text-slate-550 disabled:opacity-40 cursor-pointer"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
          className="p-1.5 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-855 text-slate-555 disabled:opacity-40 cursor-pointer"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-850 min-h-[350px] max-w-none text-slate-850 dark:text-slate-200 focus:outline-hidden">
        <style>{`
          .ProseMirror {
            outline: none;
            min-height: 350px;
          }
          .ProseMirror h1 {
            font-size: 1.875rem !important;
            font-weight: 800 !important;
            margin-top: 1.5rem !important;
            margin-bottom: 0.75rem !important;
            color: #1e293b !important;
            display: block !important;
          }
          .dark .ProseMirror h1 {
            color: #f1f5f9 !important;
          }
          .ProseMirror h2 {
            font-size: 1.5rem !important;
            font-weight: 700 !important;
            margin-top: 1.25rem !important;
            margin-bottom: 0.6rem !important;
            color: #334155 !important;
            display: block !important;
          }
          .dark .ProseMirror h2 {
            color: #e2e8f0 !important;
          }
          .ProseMirror h3 {
            font-size: 1.25rem !important;
            font-weight: 600 !important;
            margin-top: 1rem !important;
            margin-bottom: 0.5rem !important;
            color: #475569 !important;
            display: block !important;
          }
          .dark .ProseMirror h3 {
            color: #cbd5e1 !important;
          }
          .ProseMirror h4 {
            font-size: 1.125rem !important;
            font-weight: 600 !important;
            margin-top: 0.75rem !important;
            margin-bottom: 0.5rem !important;
            display: block !important;
          }
          .ProseMirror p {
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
            line-height: 1.6 !important;
            display: block !important;
          }
          .ProseMirror ul {
            list-style-type: disc !important;
            padding-left: 1.5rem !important;
            margin-top: 0.75rem !important;
            margin-bottom: 0.75rem !important;
            display: block !important;
          }
          .ProseMirror ol {
            list-style-type: decimal !important;
            padding-left: 1.5rem !important;
            margin-top: 0.75rem !important;
            margin-bottom: 0.75rem !important;
            display: block !important;
          }
          .ProseMirror li {
            margin-top: 0.25rem !important;
            margin-bottom: 0.25rem !important;
            display: list-item !important;
          }
          .ProseMirror blockquote {
            border-left: 4px solid #8b5cf6 !important;
            padding-left: 1rem !important;
            font-style: italic !important;
            color: #64748b !important;
            margin: 1rem 0 !important;
          }
          .ProseMirror table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin: 1rem 0 !important;
          }
          .ProseMirror th, .ProseMirror td {
            border: 1px solid #cbd5e1 !important;
            padding: 0.5rem !important;
          }
          .ProseMirror th {
            background-color: #f8fafc !important;
            font-weight: bold !important;
          }
          .dark .ProseMirror th {
            background-color: #0f172a !important;
            border-color: #334155 !important;
          }
          .dark .ProseMirror td {
            border-color: #334155 !important;
          }
          .ProseMirror hr {
            border: 0 !important;
            border-top: 1px solid #cbd5e1 !important;
            margin: 1.5rem 0 !important;
          }
          .dark .ProseMirror hr {
            border-color: #334155 !important;
          }
        `}</style>
        <EditorContent editor={editor} className="focus:outline-hidden" />
      </div>

      {/* Quick Help Tip Footer */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 text-[11px] text-slate-500 flex items-center justify-between select-none">
        <span>💡 <b>Tip:</b> Click on any title heading or point list buttons to format text.</span>
        <span>Delete images/tables by selecting them and clicking the <span className="text-rose-600 font-semibold">Delete</span> trash icon.</span>
      </div>
    </div>
  );
}
