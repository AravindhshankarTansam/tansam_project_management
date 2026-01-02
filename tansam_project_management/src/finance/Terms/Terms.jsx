import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import ToggleSwitch from './ToggleSwitch';
import './Terms.css';

const Terms = () => {
  const editorRef = useRef(null);
  const initialContent = "<p>Enter description here...</p>";

  const [isActive, setIsActive] = useState(false); // toggle state
  const [content, setContent] = useState(''); // Tracks editor content
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  const handleEditorChange = (newContent) => setContent(newContent);

  useEffect(() => {
    const hasText = content.replace(/<[^>]+>/g, '').trim().length > 0;
    setIsSaveEnabled(hasText && (isActive !== null));
  }, [content, isActive]);

  const handleSave = () => {
    if (editorRef.current && isSaveEnabled) {
      console.log('Content:', editorRef.current.getContent());
      console.log('Status:', isActive ? 'Active' : 'In-Active');
      alert('Content and status saved! Check console.');
    }
  };

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
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar:
            'undo redo | formatselect | ' +
            'bold italic underline | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | link image',
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
        <button onClick={handleCancel} style={{ padding: '8px 16px', borderRadius: '5px' }}>Cancel</button>
      </div>

      {/* Toggle Switch */}
      <div style={{ marginTop: '20px' }}>
        <ToggleSwitch isOn={isActive} onToggle={() => setIsActive(!isActive)} />
      </div>
    </div>
  );
};

export default Terms;
