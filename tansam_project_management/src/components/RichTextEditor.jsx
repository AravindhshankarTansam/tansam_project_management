import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <div className="rte-wrapper">
      <div className="rte-toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>

        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>

        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          •
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1.
        </button>

        {/* <button onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          ❝
        </button> */}
        {/* <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          {"</>"}
        </button> */}

        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          ―
        </button>

        <button onClick={() => editor.chain().focus().undo().run()}>
          ↺
        </button>
        <button onClick={() => editor.chain().focus().redo().run()}>
          ↻
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
