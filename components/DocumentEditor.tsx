"use client";

import React, { useState, useRef } from "react";
import MarkdownRenderer from "@/components/MarkdownClient";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Save,
  FileText,
  Eye,
  Code,
  Type,
  List,
  LinkIcon,
  Table,
  Image,
  Palette,
  Loader2,
  CheckCircle,
  AlertCircle,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  Quote,
  ListOrdered,
  CheckSquare,
  Minus,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";

interface DocumentEditorProps {
  projectId: string;
}

export default function DocumentEditor({ projectId }: DocumentEditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data } = useSession();
  const router = useRouter();

  const markdownContent = `### ${
    title || "Document Title"
  } (This won't be seen in the document)\n\n---\n\n${
    description || "Document description..."
  }`;

  const updateCounts = (text: string) => {
    setCharCount(text.length);
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  };

  const insertMarkdown = (md: string, placeholder = "") => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || placeholder;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    const insertText = md.includes("{text}")
      ? md.replace("{text}", selectedText)
      : md + selectedText;

    const newValue = before + insertText + after;
    textarea.value = newValue;
    textarea.focus();

    const cursorPos =
      before.length +
      (md.includes("{text}") ? md.indexOf("{text}") : md.length);
    textarea.setSelectionRange(cursorPos, cursorPos + selectedText.length);

    setDescription(newValue);
    updateCounts(newValue);
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Please enter both title and description</span>
        </div>
      );
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/new-document/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: title.trim(),
          content: description.trim(),
          ownerEmail: data?.user?.email,
        }),
      });

      const res = await response.json();

      if (!response.ok || !res.success) {
        throw new Error(res.message || "Failed to save document");
      }

      toast.success(
        <div className="flex items-center gap-2">
          <span>Document saved successfully!</span>
        </div>
      );

      router.push(`/document/${res.document._id}`);
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Failed to save document. Please try again.</span>
        </div>
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Link href={`/projects/${projectId}`}>
        <Button
          variant="outline"
          size="sm"
          className="group mb-6 hover:border-blue-400 dark:hover:border-blue-600 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Project
        </Button>
      </Link>
      <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-md opacity-30 animate-pulse" />
            <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Create New Document
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Write in Markdown, preview in real-time
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!title.trim() || !description.trim() || isSaving}
          className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 ${
            title.trim() && description.trim() && !isSaving
              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-xl hover:scale-105"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Save Document</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: Editor */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 pointer-events-none rounded-2xl" />

            {/* Title Input */}
            <div className="relative mb-6">
              <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700 dark:text-gray-300">
                <Type className="w-4 h-4" />
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an awesome title..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
              />
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 flex-wrap">
                <MarkdownToolbar insertMarkdown={insertMarkdown} />
                <ColorTextDropdown insertMarkdown={insertMarkdown} />
                <QuickActionsToolbar insertMarkdown={insertMarkdown} />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  {wordCount} words
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                >
                  {charCount} chars
                </Badge>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="relative">
              <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700 dark:text-gray-300">
                <Code className="w-4 h-4" />
                Markdown Content
              </label>
              <textarea
                ref={textareaRef}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  updateCounts(e.target.value);
                }}
                placeholder={`Start writing your document in Markdown...\nTip: Use the toolbar above for quick formatting!`}
                rows={20}
                className="w-full h-[500px] overflow-auto resize-none px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 font-mono text-sm custom-scrollbar"
              />
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 h-[calc(100vh-250px)] sticky top-6 w-full max-w-full">
            {/* Preview Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white truncate">
                  Live Preview
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  See how your document looks
                </p>
              </div>
            </div>

            {/* Preview Content */}
            <div className="h-[calc(100%-100px)] overflow-auto pr-4 custom-scrollbar break-words whitespace-pre-wrap w-full max-w-full">
              {title || description ? (
                <div className="prose dark:prose-invert max-w-none">
                  <MarkdownRenderer content={markdownContent} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mb-4">
                    <Eye className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Preview Empty
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                    Start typing in the editor to see your document preview here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}

function MarkdownToolbar({
  insertMarkdown,
}: {
  insertMarkdown: (md: string, placeholder?: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
          <Code className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          Markdown
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2 max-h-[520px] overflow-auto custom-scrollbar">
        {/* Headings */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Heading1 className="w-4 h-4" />
            Headings
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-1">
            {[
              { label: "H1", icon: Heading1 },
              { label: "H2", icon: Heading2 },
              { label: "H3", icon: Heading3 },
              { label: "H4", icon: Type },
              { label: "H5", icon: Type },
              { label: "H6", icon: Type },
            ].map((h, idx) => {
              const Icon = h.icon;
              return (
                <DropdownMenuItem
                  key={h.label}
                  onSelect={() =>
                    insertMarkdown(
                      `${"#".repeat(idx + 1)} {text}`,
                      `Heading ${idx + 1}`
                    )
                  }
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {h.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Text Styles */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            Text Styles
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-1">
            {[
              {
                label: "Bold",
                md: "**{text}**",
                placeholder: "Bold Text",
                icon: Bold,
              },
              {
                label: "Italic",
                md: "*{text}*",
                placeholder: "Italic Text",
                icon: Italic,
              },
              {
                label: "Strikethrough",
                md: "~~{text}~~",
                placeholder: "Strikethrough",
                icon: Strikethrough,
              },
              {
                label: "Inline Code",
                md: "`{text}`",
                placeholder: "Code",
                icon: Code,
              },
            ].map(({ label, md, placeholder, icon: Icon }) => (
              <DropdownMenuItem
                key={label}
                onSelect={() => insertMarkdown(md, placeholder)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Blocks */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Blocks
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-1">
            {[
              {
                label: "Code Block",
                md: "```\n{text}\n```",
                placeholder: "Code Block",
                icon: Code,
              },
              {
                label: "Blockquote",
                md: "> {text}",
                placeholder: "Quote",
                icon: Quote,
              },
              {
                label: "Horizontal Rule",
                md: "\n---\n",
                placeholder: "",
                icon: Minus,
              },
            ].map(({ label, md, placeholder, icon: Icon }) => (
              <DropdownMenuItem
                key={label}
                onSelect={() => insertMarkdown(md, placeholder)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Lists */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Lists
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-1">
            {[
              {
                label: "Bullet List",
                md: "- {text}",
                placeholder: "List Item",
                icon: List,
              },
              {
                label: "Numbered List",
                md: "1. {text}",
                placeholder: "Item 1",
                icon: ListOrdered,
              },
              {
                label: "Task (Unchecked)",
                md: "- [ ] {text}",
                placeholder: "Task",
                icon: CheckSquare,
              },
              {
                label: "Task (Checked)",
                md: "- [x] {text}",
                placeholder: "Task",
                icon: CheckCircle,
              },
            ].map(({ label, md, placeholder, icon: Icon }) => (
              <DropdownMenuItem
                key={label}
                onSelect={() => insertMarkdown(md, placeholder)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Links & Tables */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Links & Tables
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-1">
            {[
              {
                label: "Link",
                md: "[{text}](url)",
                placeholder: "Link Text",
                icon: LinkIcon,
              },
              {
                label: "Image",
                md: "![alt]({text})",
                placeholder: "image-url",
                icon: Image,
              },
              {
                label: "Table",
                md: "| Header 1 | Header 2 |\n| --- | --- |\n| {text} | {text} |",
                placeholder: "Cell",
                icon: Table,
              },
            ].map(({ label, md, placeholder, icon: Icon }) => (
              <DropdownMenuItem
                key={label}
                onSelect={() => insertMarkdown(md, placeholder)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ColorTextDropdown({
  insertMarkdown,
}: {
  insertMarkdown: (md: string, placeholder?: string) => void;
}) {
  const colors: { label: string; color: string; gradient: string }[] = [
    { label: "Red", color: "red", gradient: "from-red-500 to-red-600" },
    { label: "Green", color: "green", gradient: "from-green-500 to-green-600" },
    { label: "Blue", color: "blue", gradient: "from-blue-500 to-blue-600" },
    {
      label: "Orange",
      color: "orange",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      label: "Purple",
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
    },
    { label: "Pink", color: "pink", gradient: "from-pink-500 to-pink-600" },
    {
      label: "Yellow",
      color: "yellow",
      gradient: "from-yellow-500 to-yellow-600",
    },
    { label: "Custom", color: "custom", gradient: "from-gray-500 to-gray-600" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:from-pink-700 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
          <Palette className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          Colors
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Palette className="w-4 h-4" />
            Text Colors
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {colors.map(({ label, color, gradient }) => (
            <DropdownMenuItem
              key={label}
              onSelect={() =>
                insertMarkdown(
                  `<span style="color:${
                    color === "custom" ? "your-color" : color
                  }">{text}</span>`,
                  `Colored Text`
                )
              }
              className="flex items-center gap-3 rounded-lg"
            >
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-br ${gradient} shadow-md`}
              />
              <span>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function QuickActionsToolbar({
  insertMarkdown,
}: {
  insertMarkdown: (md: string, placeholder?: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
          <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          Quick Actions
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Sparkles className="w-4 h-4" />
            Quick Insert
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {[
            {
              label: "Bold",
              md: "**{text}**",
              icon: Bold,
              placeholder: "bold",
            },
            {
              label: "Italic",
              md: "*{text}*",
              icon: Italic,
              placeholder: "italic",
            },
            { label: "Code", md: "`{text}`", icon: Code, placeholder: "code" },
            {
              label: "Link",
              md: "[{text}](url)",
              icon: LinkIcon,
              placeholder: "link",
            },
            { label: "List", md: "- {text}", icon: List, placeholder: "item" },
          ].map(({ label, md, icon: Icon, placeholder }) => (
            <DropdownMenuItem
              key={label}
              onSelect={() => insertMarkdown(md, placeholder)}
              className="flex items-center gap-2 rounded-lg"
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
