import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "../../layouts/CSS/terms.css";
import ToggleSwitch from "./toggleSwitch";
import {
  addTerms,
  getTerms,
  updateTerms,
  deleteTerms,
} from "../../services/quotation/terms.api";

const Terms = () => {
  const editorRef = useRef(null);
  const initialContent = "<p>Enter description here...</p>";

  const [termsList, setTermsList] = useState([]);
  const [currentTerm, setCurrentTerm] = useState(null);
  const [content, setContent] = useState(initialContent);
  const [isActive, setIsActive] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  // Fetch terms from backend
  const fetchTerms = async () => {
    try {
      const data = await getTerms(); // fetch all terms
      setTermsList(data);
    } catch (err) {
      alert("Failed to fetch terms: " + err.message);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  useEffect(() => {
    const hasText = content.replace(/<[^>]+>/g, "").trim().length > 0;
    setIsSaveEnabled(hasText);
  }, [content]);

  const handleEditorChange = (newContent) => setContent(newContent);

  const handleSave = async () => {
    const savedContent = editorRef.current.getContent({ format: "html" });
    if (!savedContent || savedContent === initialContent) {
      alert("Please enter some content first!");
      return;
    }

    try {
      if (currentTerm) {
        await updateTerms(currentTerm.id, {
          content: savedContent,
          status: isActive ? "Active" : "In-Active",
        });
        alert("Term updated successfully!");
      } else {
        await addTerms({
          content: savedContent,
          status: isActive ? "Active" : "In-Active",
        });
        alert("Term added successfully!");
      }
      fetchTerms();
      handleCancel();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  const handleCancel = () => {
    setCurrentTerm(null);
    setContent(initialContent);
    setIsActive(false);
  };

  const handleEdit = (term) => {
    setCurrentTerm(term);
    setContent(term.content);
    setIsActive(term.status === "Active");
    if (editorRef.current) {
      editorRef.current.setContent(term.content);
    }
  };

  const handleDelete = async (termId) => {
    if (window.confirm("Are you sure you want to delete this term?")) {
      try {
        await deleteTerms(termId);
        alert("Term deleted successfully!");
        fetchTerms();
        if (currentTerm?.id === termId) handleCancel();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      {/* Editor Card */}
      <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <h2>{currentTerm ? "Edit Term" : "Add Term"}</h2>
        <Editor
          apiKey="gdoyqtp9jm9j8qwtbigjgmhk2kpvrufyklno8ms7ug62qw3t"
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue={content}
          onEditorChange={handleEditorChange}
          init={{
            height: 250,
            menubar: false,
            plugins:
              "advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste help wordcount",
            toolbar:
              "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | link image",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />

        <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <ToggleSwitch isOn={isActive} onToggle={() => setIsActive(!isActive)} />
          <div>
            <button
              onClick={handleSave}
              disabled={!isSaveEnabled}
              style={{
                marginRight: "10px",
                padding: "8px 16px",
                borderRadius: "5px",
                backgroundColor: isSaveEnabled ? "#007bff" : "#ccc",
                color: "#fff",
                cursor: isSaveEnabled ? "pointer" : "not-allowed",
                border: "none",
              }}
            >
              {currentTerm ? "Update" : "Save"}
            </button>
            <button
              onClick={handleCancel}
              style={{
                padding: "8px 16px",
                borderRadius: "5px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Terms List */}
      <h3 style={{ marginTop: "30px", marginBottom: "15px" }}>Existing Terms</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {termsList.length === 0 ? (
          <p>No terms available.</p>
        ) : (
          termsList.map((term) => (
            <div
              key={term.id}
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                width: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ marginBottom: "10px", minHeight: "80px" }}>
                {term.content.replace(/<[^>]+>/g, "").slice(0, 150)}...
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "8px",
                    backgroundColor: term.status === "Active" ? "#d4edda" : "#f8d7da",
                    color: term.status === "Active" ? "#155724" : "#721c24",
                    fontSize: "12px",
                  }}
                >
                  {term.status}
                </span>
                <div>
                  <button
                    onClick={() => handleEdit(term)}
                    style={{
                      marginRight: "8px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(term.id)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "12px",
                      cursor: "pointer",
                      color: "red",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Terms;
