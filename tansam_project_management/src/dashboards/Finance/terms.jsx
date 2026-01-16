import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from 'react-router-dom';
import ToggleSwitch from './toggleSwitch';
import "../../layouts/CSS/terms.css";
import { addTerms } from "../../services/quotation/terms.api";

const Terms = () => {
  const editorRef = useRef(null);
  const initialContent = "<p>Enter description here...</p>";
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(false); // toggle state
  const [content, setContent] = useState(initialContent); // Tracks editor content
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  // Update content state on editor change
  const handleEditorChange = (newContent) => setContent(newContent);

  // Enable Save button only if content has text and toggle has been set
  useEffect(() => {
    const hasText = content.replace(/<[^>]+>/g, '').trim().length > 0;
    setIsSaveEnabled(hasText && isActive !== null);
  }, [content, isActive]);

  // Save content to localStorage and navigate
const handleSave = async () => {
  if (!editorRef.current) return;

  const savedContent = editorRef.current.getContent({ format: 'html' });

  if (!savedContent || savedContent === '<p>Enter description here...</p>') {
    alert("Please enter some content first!");
    return;
  }

  try {
    await addTerms({
      content: savedContent,
      status: isActive ? "Active" : "In-Active",
    });
    alert("Terms saved successfully!");
  } catch (err) {
    alert("Save failed: " + err.message);
  }
};


  // Reset editor content and toggle
  const handleCancel = () => {
    if (editorRef.current) {
      editorRef.current.setContent(initialContent);
      setContent(initialContent);
      setIsActive(false);
      alert('Content reset to initial value.');
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Enter Description</h2>
      
      <Editor
        apiKey='gdoyqtp9jm9j8qwtbigjgmhk2kpvrufyklno8ms7ug62qw3t'
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={initialContent}
        onEditorChange={handleEditorChange}
        init={{
          height: 300,
          menubar: false,
          plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste help wordcount',
          toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | link image',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />

      {/* Save/Cancel Buttons */}
      <div style={{ marginTop: '10px' }}>
        <button
          onClick={handleSave}
          disabled={!isSaveEnabled}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            borderRadius: '5px',
            backgroundColor: isSaveEnabled ? 'blue' : 'lightgray',
            color: isSaveEnabled ? 'white' : 'black',
            cursor: isSaveEnabled ? 'pointer' : 'not-allowed',
            border: 'none'
          }}
        >
          Save
        </button>

        <button
          onClick={handleCancel}
          style={{
            padding: '8px 16px',
            borderRadius: '5px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>

      {/* Toggle Switch */}
      <div style={{ marginTop: '20px' }}>
        <ToggleSwitch
          isOn={isActive}
          onToggle={() => setIsActive(!isActive)}
        />
      </div>
    </div>
  );
};

export default Terms;