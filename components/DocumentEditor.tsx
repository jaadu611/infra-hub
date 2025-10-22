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

interface DocumentEditorProps {
  projectId: string;
}

export default function DocumentEditor({ projectId }: DocumentEditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data } = useSession();
  const router = useRouter();

  const markdownContent = `### ${
    title || "Document Title"
  } (This won't be seen in the document)\n\n---\n\n${
    description || "Document description..."
  }`;

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

    textarea.value = before + insertText + after;
    textarea.focus();

    const cursorPos =
      before.length +
      (md.includes("{text}") ? md.indexOf("{text}") : md.length);
    textarea.setSelectionRange(cursorPos, cursorPos + selectedText.length);

    setDescription(textarea.value);
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error(
        "⚠️ Please enter both a title and description before saving."
      );
      return;
    }

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

      if (!response.ok) {
        throw new Error(`Failed to save document (status: ${response.status})`);
      }

      const res = await response.json();

      if (res.success) {
        toast.success("Document saved successfully!");
        router.push(`/projects/${projectId}`);
      } else {
        throw new Error(res.message || "Failed to save document");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("❌ Failed to save document. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: inputs + toolbar */}
      <div className="space-y-4 p-4 h-[654px] rounded-lg shadow-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
            Document Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title..."
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Toolbar Row */}
        <div className="flex items-center gap-2 justify-between">
          <div className="flex gap-2">
            <MarkdownToolbar insertMarkdown={insertMarkdown} />
            <ColorTextDropdown insertMarkdown={insertMarkdown} />
          </div>

          <button
            onClick={handleSave}
            disabled={!title.trim() || !description.trim()}
            className={`px-4 py-2 rounded-lg font-medium shadow transition-colors ${
              title.trim() && description.trim()
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            💾 Save
          </button>
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            ref={textareaRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter document description..."
            rows={12}
            className="w-full h-[435px] overflow-auto resize-none p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Right: Markdown Preview */}
      <div className="p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-[654px] w-[600px] break-words overflow-auto">
        <MarkdownRenderer content={markdownContent} />
      </div>
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
        <button className="px-3 py-1 rounded bg-gradient-to-br from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-colors shadow-sm">
          Insert Markdown
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md p-2 overflow-auto max-h-[520px]">
        {/* Headings */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Headings</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md p-1">
            {["H1", "H2", "H3", "H4", "H5", "H6"].map((h, idx) => (
              <DropdownMenuItem
                key={h}
                onSelect={() =>
                  insertMarkdown(
                    `${"#".repeat(idx + 1)} {text}`,
                    `Heading ${idx + 1}`
                  )
                }
              >
                {h}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Text Styles */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Text Styles</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md p-1">
            {[
              ["Bold", "**{text}**", "Bold Text"],
              ["Italic", "*{text}*", "Italic Text"],
              ["Strikethrough", "~~{text}~~", "Strikethrough"],
              ["Inline Code", "`{text}`", "Code"],
            ].map(([label, md, placeholder]) => (
              <DropdownMenuItem
                key={label}
                onSelect={() => insertMarkdown(md, placeholder)}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Blocks */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Blocks</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md p-1">
            {[
              ["Code Block", "```\n{text}\n```", "Code Block"],
              ["Blockquote", "> {text}", "Quote"],
              ["Horizontal Rule", "\n---\n", ""],
            ].map(([label, md, placeholder]) => (
              <DropdownMenuItem
                key={label}
                onSelect={() => insertMarkdown(md, placeholder)}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Lists */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Lists</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md p-1">
            {[
              ["List", "- {text}", "List Item"],
              ["Numbered List", "1. {text}", "Item 1"],
              ["Task List (Unchecked)", "- [ ] {text}", "Task Item"],
              ["Task List (Checked)", "- [x] {text}", "Task Item"],
            ].map(([label, md, placeholder]) => (
              <DropdownMenuItem
                key={label}
                onSelect={() => insertMarkdown(md, placeholder)}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Links & Tables */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Links & Tables</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md p-1">
            {[
              ["Link", "[{text}](url)", "Link Text"],
              [
                "Table",
                "| Header 1 | Header 2 |\n| --- | --- |\n| {text} | {text} |",
                "Cell",
              ],
            ].map(([label, md, placeholder]) => (
              <DropdownMenuItem
                key={label}
                onSelect={() => insertMarkdown(md, placeholder)}
              >
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
  const colors: { label: string; color: string }[] = [
    { label: "Red", color: "red" },
    { label: "Green", color: "green" },
    { label: "Blue", color: "blue" },
    { label: "Orange", color: "orange" },
    { label: "Purple", color: "purple" },
    { label: "Other", color: " //use any color name/hexcode" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="px-3 py-1 rounded bg-gradient-to-br from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-colors shadow-sm">
          Colored Text
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md p-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Colors</DropdownMenuLabel>
          {colors.map(({ label, color }) => (
            <DropdownMenuItem
              key={label}
              onSelect={() =>
                insertMarkdown(
                  `<span style="color:${color}">{text}</span>`,
                  `Colored Text`
                )
              }
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
