import { useState, useEffect } from "react";
import tnlogo from "../../assets/tansam/tnlogo.png";
import tansamoldlogo from "../../assets/tansam/tansamoldlogo.png";
import siemens from "../../assets/tansam/siemens.png";
import tidco from "../../assets/tansam/tidcologo.png";
import "../../layouts/CSS/GenerateQuotation.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { getActiveTerms } from "../../services/quotation/terms.api";
import { saveGeneratedQuotation, getGeneratedQuotationByQuotationId } from "../../services/quotation/generatedQuotation.api";
import QuotationPDF from "./QuotationPdf.jsx";

// ✅ EditableQuotationTable Component (UNCHANGED)
export const EditableQuotationTable = ({ quotation, setQuotation }) => {
  const handleRowChange = (index, field, value) => {
    const updatedItems = [...quotation.items];
    updatedItems[index][field] = value;

    const qty = parseFloat(updatedItems[index].qty) || 0;
    const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
    updatedItems[index].total = (qty * unitPrice).toFixed(2);

    setQuotation({ ...quotation, items: updatedItems });
  };

  const addRow = () => {
    const newRow = { description: "", qty: "", unitPrice: "", total: "0.00" };
    setQuotation({ ...quotation, items: [...quotation.items, newRow] });
  };

  const removeRow = (index) => {
    const updatedItems = [...quotation.items];
    updatedItems.splice(index, 1);
    setQuotation({ ...quotation, items: updatedItems });
  };

  const totalServiceValue = quotation.items
    .reduce((acc, item) => acc + parseFloat(item.total || 0), 0)
    .toFixed(2);

  return (
    <div style={{ marginBottom: "30px" }}>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "10px",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #000", padding: "8px" }}>
                Sl. No
              </th>
              <th style={{ border: "1px solid #000", padding: "8px" }}>
                Product Description
              </th>
              <th style={{ border: "1px solid #000", padding: "8px" }}>
                Qty Per Students
              </th>
              <th style={{ border: "1px solid #000", padding: "8px" }}>
                Unit Price + TAX
              </th>
              <th style={{ border: "1px solid #000", padding: "8px" }}>
                Total Price in INR
              </th>
              <th style={{ border: "1px solid #000", padding: "8px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {quotation.items.map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {index + 1}
                </td>
                <td style={{ border: "1px solid #000", padding: "8px" }}>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleRowChange(index, "description", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "4px",
                      boxSizing: "border-box",
                    }}
                  />
                </td>
                <td style={{ border: "1px solid #000", padding: "8px" }}>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      handleRowChange(index, "qty", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "4px",
                      boxSizing: "border-box",
                    }}
                  />
                </td>
                <td style={{ border: "1px solid #000", padding: "8px" }}>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleRowChange(index, "unitPrice", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "4px",
                      boxSizing: "border-box",
                    }}
                  />
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "right",
                    wordBreak: "break-word",
                  }}
                >
                  {item.total}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => removeRow(index)}
                    style={{ padding: "4px 8px", fontSize: "12px" }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={addRow}
        style={{ marginBottom: "10px", padding: "8px 16px" }}
      >
        Add Row
      </button>
      <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "16px" }}>
        Total Service Value with Tax: ₹ {totalServiceValue}
      </div>
    </div>
  );
};

// ✅ FIXED FinanceDocument WITH Loading/Error States + ALL PROPS
const FinanceDocument = ({
  quotation,
  setQuotation,
  refNo,
  setRefNo,
  date,
  setDate,
  showPreview,
  setShowPreview,
  savedQuotation,
  handleSaveQuotation,
  // ✅ ADDED MISSING PROPS
  showTermsModal,
  setShowTermsModal,
  termsLoading,
  termsError,
  termsContent,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        margin: 0,
        backgroundColor: "#f0f0f0",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "800px",
          maxWidth: "95%",
          margin: "0 auto",
        }}
      >
        {/* Header - UNCHANGED */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <div>
            <img src={tnlogo} alt="Left Logo" style={{ maxHeight: "60px" }} />
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <img
              src={tansamoldlogo}
              alt="Center Logo 1"
              style={{ maxHeight: "60px" }}
            />
            <img
              src={siemens}
              alt="Center Logo 2"
              style={{ maxHeight: "60px" }}
            />
          </div>
          <div>
            <img src={tidco} alt="Right Logo" style={{ maxHeight: "60px" }} />
          </div>
        </div>

        <h2 style={{ textAlign: "center" }}>
          Tamil Nadu Smart and Advanced Manufacturing Centre
        </h2>
        <p style={{ textAlign: "center" }}>
          (A Government of Tamil Nadu Enterprise wholly owned by TIDCO)
        </p>
        <h1 style={{ textAlign: "center" }}>Quotation</h1>

        {/* Ref No & Date - UNCHANGED */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          <div>
            <strong>Ref No:</strong>{" "}
            <input
              type="text"
              value={refNo}
              onChange={(e) => setRefNo(e.target.value)}
              style={{
                fontSize: "14px",
                border: "1px solid #ccc",
                padding: "4px",
              }}
            />
          </div>
          <div>
            <strong>Date:</strong>{" "}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                fontSize: "14px",
                border: "1px solid #ccc",
                padding: "4px",
              }}
            />
          </div>
        </div>

        {/* Client Info - UNCHANGED */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "12px" }}>
            <strong>TO </strong>
            <textarea
              rows={3} // Default shows 3 lines
              value={quotation.clientName || ""}
              onChange={(e) =>
                setQuotation({ ...quotation, clientName: e.target.value })
              }
              placeholder="Enter Client Name/institution details  and Address "
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "15px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                resize: "vertical", // Allow vertical resize only
                minHeight: "70px",
                lineHeight: "1.4",
              }}
            />
          </label>
          <label style={{ display: "block", marginBottom: "12px" }}>
            <strong>Kind Attn (Name & Designation):</strong>
            <textarea
              rows={2}
              value={quotation.kindAttn || ""}
              onChange={(e) =>
                setQuotation({ ...quotation, kindAttn: e.target.value })
              }
              placeholder="e.g., "
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "15px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                resize: "vertical",
                minHeight: "50px",
                lineHeight: "1.4",
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>
            <strong>Subject:</strong>
            <textarea
              rows={2}
              value={quotation.subject || ""}
              onChange={(e) =>
                setQuotation({ ...quotation, subject: e.target.value })
              }
              placeholder="e.g., Quote offer for Industrial Visit 2.5 hours at TANSAM Centre"
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "15px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                resize: "vertical",
                minHeight: "50px",
                lineHeight: "1.4",
              }}
            />
          </label>
        </div>

        {/* Editable Table - UNCHANGED */}
        <EditableQuotationTable
          quotation={quotation}
          setQuotation={setQuotation}
        />

        {/* ✅ FIXED TERMS & CONDITIONS WITH LOADING/ERROR */}
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ textDecoration: "underline", marginBottom: "10px" }}>
            Terms & Conditions
          </h3>
          <p style={{ fontSize: "14px", marginBottom: "6px" }}>
            Applicable Terms & Conditions are available at:
          </p>
          {/* ✅ LOADING STATE */}
          {termsLoading && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#e3f2fd",
                borderRadius: "4px",
                textAlign: "center",
                color: "#1976d2",
              }}
            >
              🔄 Loading Terms & Conditions...
            </div>
          )}
          {/* ✅ ERROR STATE */}
          {termsError && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#ffebee",
                borderRadius: "4px",
                color: "#d32f2f",
                borderLeft: "4px solid #d32f2f",
              }}
            >
              ❌ Failed to load terms: {termsError}
              <br />
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: "5px",
                  padding: "4px 8px",
                  background: "#d32f2f",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          )}
          {/* ✅ BUTTON - NOW WORKS */}
          <button
            onClick={() => setShowTermsModal(true)}
            style={{
              fontSize: "14px",
              color: "#1F4E79",
              fontWeight: "bold",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            View Terms & Conditions
          </button>
        </div>

        {/* Signature & Seal - UNCHANGED */}
        <h3 style={{ marginTop: "40px" }}>Yours Truly,</h3>
        <div
          style={{
            border: "1px solid #000",
            marginTop: "50px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <p>
            <strong>Signature & Seal of Finance Manager</strong>
          </p>
          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <div style={{ flex: 1 }}>
              <p>Upload Signature</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setQuotation({ ...quotation, signature: e.target.files[0] })
                }
              />
            </div>
            <div style={{ flex: 1 }}>
              <p>Upload Seal</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setQuotation({ ...quotation, seal: e.target.files[0] })
                }
              />
            </div>
          </div>
          <div style={{ marginTop: "25px" }}>
            <p>
              <strong>Name:</strong>
            </p>
            <input
              type="text"
              value={quotation.financeManagerName || ""}
              onChange={(e) =>
                setQuotation({
                  ...quotation,
                  financeManagerName: e.target.value,
                })
              }
              style={{
                width: "60%",
                padding: "8px",
                fontSize: "16px",
                textAlign: "center",
                border: "1px solid #ccc",
                margin: "0 auto",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* Footer - FIXED LINKS */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#1F4E79",
            color: "#fff",
            fontSize: "13px",
            marginTop: "40px",
            borderTop: "2px solid #1F4E79",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "10px",
              borderRight: "1px solid #ffffff50",
              textAlign: "center",
            }}
          >
            Tel: +91 44 69255700
          </div>
          <div
            style={{
              flex: 1,
              padding: "10px",
              borderRight: "1px solid #ffffff50",
              textAlign: "center",
            }}
          >
            E-Mail: info@tansam.org
          </div>
          <div
            style={{
              flex: 1,
              padding: "10px",
              borderRight: "1px solid #ffffff50",
              textAlign: "center",
            }}
          >
            URL: www.tansam.org
          </div>
          <div style={{ flex: 2, padding: "10px", textAlign: "center" }}>
            C-Wing North, 603, TIDEL Park
            <br />
            No.4, Rajiv Gandhi Salai,
            <br />
            Taramani, Chennai - 600113
          </div>
        </div>

        {/* GST / CIN strip */}
        <div
          style={{
            backgroundColor: "#163A5F",
            color: "#fff",
            fontSize: "12px",
            textAlign: "center",
            padding: "6px",
          }}
        >
          GSTIN:- 33AAJCT2401Q1Z7 | CIN : U91990TN2022NPL150529
        </div>

        {/* Action Buttons - NOW WORKS */}
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <PDFDownloadLink
            document={
              <QuotationPDF
                refNo={refNo}
                date={date}
                clientName={quotation.clientName}
                kindAttn={quotation.kindAttn}
                subject={quotation.subject}
                items={quotation.items}
                terms={quotation.terms}
                termsContent={termsContent}
                financeManagerName={quotation.financeManagerName}
                designation="Manager - Operations"
                signatureUrl={
                  quotation.signature
                    ? URL.createObjectURL(quotation.signature)
                    : null
                }
                sealUrl={
                  quotation.seal ? URL.createObjectURL(quotation.seal) : null
                }
              />
            }
            fileName={`${refNo || "TANSAM-Quotation"}.pdf`}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#1F4E79",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
          </PDFDownloadLink>
          <button
            onClick={handleSaveQuotation}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#1F4E79",
              color: "#fff",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Save Quotation
          </button>
        </div>

        {/* ✅ FIXED TERMS MODAL - NOW FULLY FUNCTIONAL */}
        {showTermsModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={() => setShowTermsModal(false)}
          >
            <div
              style={{
                background: "#fff",
                padding: "30px",
                width: "90%",
                maxWidth: "900px",
                maxHeight: "80%",
                overflowY: "auto",
                borderRadius: "8px",
                position: "relative",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2 style={{ margin: 0, color: "#1F4E79" }}>
                  Terms & Conditions
                </h2>
                <button
                  onClick={() => setShowTermsModal(false)}
                  style={{
                    background: "#1F4E79",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Close
                </button>
              </div>
              {termsLoading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <div style={{ fontSize: "18px", color: "#1976d2" }}>
                    🔄 Loading Terms...
                  </div>
                </div>
              ) : termsError ? (
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#ffebee",
                    borderRadius: "8px",
                    color: "#d32f2f",
                    textAlign: "center",
                  }}
                >
                  ❌ {termsError}
                </div>
              ) : (
                <div
                  style={{
                    border: "1px solid #ddd",
                    padding: "20px",
                    minHeight: "200px",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    backgroundColor: "#f9f9f9",
                  }}
                  dangerouslySetInnerHTML={{ __html: termsContent }}
                />
              )}
            </div>
          </div>
        )}

        {/* Preview Modal - UNCHANGED */}
        {showPreview && (savedQuotation || quotation) && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "20px",
                width: "80%",
                height: "90%",
                overflow: "auto",
              }}
            >
              <h2>Quotation Preview</h2>
              <p>
                <strong>Client:</strong>{" "}
                {(savedQuotation || quotation).clientName}
              </p>
              <p>
                <strong>Ref No:</strong> {refNo}
              </p>
              <p>
                <strong>Date:</strong> {date}
              </p>

              <h3>Items</h3>
              {quotation.items?.map((item, idx) => (
                <p key={idx}>
                  {idx + 1}. {item.description} — ₹{item.total}
                </p>
              ))}

              <h3>Terms & Conditions</h3>
              {quotation.terms?.map((t, i) => (
                <p key={i}>
                  {i + 1}. <b>{t.title}</b>: {t.value}
                </p>
              ))}

              <div style={{ textAlign: "right" }}>
                <button
                  onClick={() => setShowPreview(false)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#1F4E79",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ MAIN COMPONENT WITH ALL STATES & FIXED PROPS
export default function GenerateQuotation({ quotation: initialQuotation, onSaved }) {


  
  const isEditMode = !!initialQuotation?.id && initialQuotation?.items?.length > 0;
const [quotation, setQuotation] = useState(() => ({
    id: initialQuotation?.id || null,
    subject: initialQuotation?.subject || "",
    clientName: initialQuotation?.clientName || "",
    kindAttn: initialQuotation?.kindAttn || "",
    items: initialQuotation?.items || [{ description: "", qty: "", unitPrice: "", total: "0.00" }],
    terms: initialQuotation?.terms || [],
    termsContent: initialQuotation?.termsContent || "",
    financeManagerName: initialQuotation?.financeManagerName || "",
    signature: null,           // new file upload
    seal: null,                // new file upload
    existingSignature: initialQuotation?.existingSignature || null,  // preview path
    existingSeal: initialQuotation?.existingSeal || null,            // preview path
  }));
useEffect(() => {
    console.log("GenerateQuotation mounted with quotation.id =", quotation.id);
  }, []);
 
  // ✅ ALL REQUIRED STATES
const [refNo, setRefNo] = useState(initialQuotation?.refNo || `TN/SA/${new Date().getFullYear()}/001`);
  const [date, setDate] = useState(initialQuotation?.date || new Date().toISOString().split("T")[0]);
  const [showPreview, setShowPreview] = useState(false);
  const [savedQuotation, setSavedQuotation] = useState(null);

  // ✅ TERMS STATES WITH LOADING/ERROR
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsContent, setTermsContent] = useState("<p>Loading terms...</p>");
  const [termsLoading, setTermsLoading] = useState(true);
  const [termsError, setTermsError] = useState(null);
useEffect(() => {
  if (!quotation.id) return;

  const loadGeneratedQuotation = async () => {
    try {
      const generated = await getGeneratedQuotationByQuotationId(quotation.id);

      if (!generated) return;

      setRefNo(generated.refNo || refNo);
      setDate(generated.date || date);

      setQuotation(prev => ({
        ...prev,
        clientName: generated.clientName || "",
        kindAttn: generated.kindAttn || "",
        subject: generated.subject || "",
        financeManagerName: generated.financeManagerName || "",
        items: JSON.parse(generated.items || "[]"),
        terms: JSON.parse(generated.terms || "[]"),
        termsContent: generated.termsContent || "",

        // previews from backend
        existingSignature: generated.signature || null,
        existingSeal: generated.seal || null,

        // reset new uploads
        signature: null,
        seal: null,
      }));
    } catch (err) {
      console.error("Failed to load generated quotation", err);
    }
  };

  loadGeneratedQuotation();
}, [quotation.id]);

  // ✅ FIXED TERMS FETCHING WITH LOADING/ERROR
useEffect(() => {
    const fetchTerms = async () => {
      try {
        setTermsLoading(true);
        const terms = await getActiveTerms();
        const htmlContent = terms?.content || "<p>No active terms available</p>";
        setTermsContent(htmlContent);
        setQuotation(prev => ({ ...prev, termsContent: htmlContent }));
      } catch (err) {
        setTermsError(err.message);
      } finally {
        setTermsLoading(false);
      }
    };
    fetchTerms();
  }, []);

  // ✅ FIXED handleSaveQuotation
  const handleSaveQuotation = async () => {
    try {
      if (!quotation.id) {
        alert("Error: No quotation ID found. Cannot save generated version.");
        console.error("Missing id in quotation state:", quotation);
        return;
      }

      console.log("Sending quotation_id =", quotation.id);
      const dataToSend = new FormData();
dataToSend.append("quotation_id", quotation.id);

      dataToSend.append("refNo", refNo);
      dataToSend.append("date", date);
      dataToSend.append("clientName", quotation.clientName);
      dataToSend.append("kindAttn", quotation.kindAttn || "");
      dataToSend.append("subject", quotation.subject);
      dataToSend.append(
        "financeManagerName",
        quotation.financeManagerName || "",
      );

      dataToSend.append("items", JSON.stringify(quotation.items));
      dataToSend.append("terms", JSON.stringify(quotation.terms));
      dataToSend.append("termsContent", quotation.termsContent);
      if (quotation.signature)
        dataToSend.append("signature", quotation.signature);
      if (quotation.seal) dataToSend.append("seal", quotation.seal);

      const saved = await saveGeneratedQuotation(dataToSend);
      setSavedQuotation(saved);
      setShowPreview(true);
      alert("Quotation saved successfully!");
      onSaved && onSaved();
    } catch (err) {
      console.error("Save quotation error:", err);
      alert("Failed to save quotation. Try again.");
    }
  };

  // ✅ PASS ALL REQUIRED PROPS
  return (
    <FinanceDocument
    isEditMode={isEditMode}
      quotation={quotation}
      setQuotation={setQuotation}
      refNo={refNo}
      setRefNo={setRefNo}
      date={date}
      setDate={setDate}
      showPreview={showPreview}
      setShowPreview={setShowPreview}
      savedQuotation={savedQuotation}
      handleSaveQuotation={handleSaveQuotation}
      showTermsModal={showTermsModal}
      setShowTermsModal={setShowTermsModal}
      termsLoading={termsLoading}
      termsError={termsError}
      termsContent={termsContent}
    />
  );
}
