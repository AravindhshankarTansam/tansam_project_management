import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  /* Prevent form submit + focus loss */
  const preventSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="rte-wrapper">
      {/* TOOLBAR */}
      <div className="rte-toolbar">
        <button
          type="button"
          onMouseDown={preventSubmit}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <b>B</b>
        </button>

        <button
          type="button"
          onMouseDown={preventSubmit}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i>I</i>
        </button>

        <button
          type="button"
          onMouseDown={preventSubmit}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <s>S</s>
        </button>

        <button
          type="button"
          onMouseDown={preventSubmit}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>

        <button
          type="button"
          onMouseDown={preventSubmit}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>

        <button
          type="button"
          onMouseDown={preventSubmit}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </button>

        <button
          type="button"
          onMouseDown={preventSubmit}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </button>

        <button
          type="button"
          onMouseDown={preventSubmit}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </button>

        <button
          type="button"
          onMouseDown={preventSubmit}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          ―
        </button>

        <button
          type="button"
          onMouseDown={preventSubmit}
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↺
        </button>

        <button
          type="button"
          onMouseDown={preventSubmit}
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↻
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent editor={editor} />
    </div>
  );
}
