import { useState } from "react";
import "../GenerateQuotation/GenerateQuotation.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { generateQuotationDocx } from "../../utlis/generateQuotation";




// Editable Table Component
const EditableQuotationTable = ({ quotation, setQuotation }) => {
  const handleRowChange = (index, field, value) => {
    const updatedItems = [...quotation.items];
    updatedItems[index][field] = value;

    // Recalculate total price for the row
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
  
  {/* ✅ ADD THIS WRAPPER */}
  <div style={{ width: "100%", overflowX: "auto" }}>
    
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "10px",
        tableLayout: "fixed" // ✅ IMPORTANT
      }}
    >
      <thead>
        <tr>
          <th style={{ border: "1px solid #000", padding: "8px" }}>Sl. No</th>
          <th style={{ border: "1px solid #000", padding: "8px" }}>Product Description</th>
          <th style={{ border: "1px solid #000", padding: "8px" }}>Qty Per Students</th>
          <th style={{ border: "1px solid #000", padding: "8px" }}>Unit Price + TAX</th>
          <th style={{ border: "1px solid #000", padding: "8px" }}>Total Price in INR</th>
          <th style={{ border: "1px solid #000", padding: "8px" }}>Action</th>
        </tr>
      </thead>

      <tbody>
        {quotation.items.map((item, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>
              {index + 1}
            </td>

            <td style={{ border: "1px solid #000", padding: "8px" }}>
              <input
                type="text"
                value={item.description}
                onChange={(e) =>
                  handleRowChange(index, "description", e.target.value)
                }
                style={{ width: "100%", padding: "4px", boxSizing: "border-box" }}
              />
            </td>

            <td style={{ border: "1px solid #000", padding: "8px" }}>
              <input
                type="number"
                value={item.qty}
                onChange={(e) =>
                  handleRowChange(index, "qty", e.target.value)
                }
                style={{ width: "100%", padding: "4px", boxSizing: "border-box" }}
              />
            </td>

            <td style={{ border: "1px solid #000", padding: "8px" }}>
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) =>
                  handleRowChange(index, "unitPrice", e.target.value)
                }
                style={{ width: "100%", padding: "4px", boxSizing: "border-box" }}
              />
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "8px",
                textAlign: "right",
                wordBreak: "break-word"
              }}
            >
              {item.total}
            </td>

            <td style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>
              <button onClick={() => removeRow(index)}>Remove</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

  </div>

      <button onClick={addRow} style={{ marginBottom: "10px" }}>Add Row</button>

      <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "16px" }}>
        Total Service Value with Tax: ₹ {totalServiceValue}
      </div>
    </div>
  );
};

// Main Finance Document Component
const FinanceDocument = ({ quotation, setQuotation, refNo, setRefNo, date, setDate, showPreview, setShowPreview, savedQuotation, generatePDF }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100%", boxSizing: "border-box", margin: 0, backgroundColor: "#f0f0f0" }}>
      <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "800px", maxWidth: "95%", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div><img src="/logo1.png" alt="Left Logo" style={{ maxHeight: "60px" }} /></div>
          <div style={{ display: "flex", gap: "20px" }}>
            <img src="/logo.png" alt="Center Logo 1" style={{ maxHeight: "60px" }} />
            <img src="/logo11.png" alt="Center Logo 2" style={{ maxHeight: "60px" }} />
          </div>
          <div><img src="/logo2.png" alt="Right Logo" style={{ maxHeight: "60px" }} /></div>
        </div>

        <h2 style={{ textAlign: "center" }}>Tamil Nadu Smart and Advanced Manufacturing Centre</h2>
        <p style={{ textAlign: "center" }}>(A Government of Tamil Nadu Enterprise wholly owned by TIDCO)</p>
        <h1 style={{ textAlign: "center" }}>Quotation</h1>

        {/* Ref No & Date */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", marginBottom: "20px", fontSize: "14px" }}>
          <div><strong>Ref No:</strong> <input type="text" value={refNo} onChange={(e) => setRefNo(e.target.value)} style={{ fontSize: "14px" }} /></div>
          <div><strong>Date:</strong> <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ fontSize: "14px" }} /></div>
        </div>

        {/* Client Info */}
<div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
  <label style={{ flex: 1 }}>
    <strong>TO:</strong>
    <input
      type="text"
      value={quotation.clientName}
      onChange={(e) =>
        setQuotation({ ...quotation, clientName: e.target.value })
      }
      style={{ width: "100%", padding: "8px", fontSize: "16px" }}
    />
  </label>

  <label style={{ flex: 1 }}>
    <strong>Kind Attn:</strong>
    <input
      type="text"
      value={quotation.kindAttn || ""} // use a separate state property
      onChange={(e) =>
        setQuotation({ ...quotation, kindAttn: e.target.value })
      }
      style={{ width: "100%", padding: "8px", fontSize: "16px" }}
    />
  </label>
</div>

<div style={{ marginBottom: "15px" }}>
  <label style={{ width: "100%" }}>
    <strong>Subject:</strong>
    <input
      type="text"
      value={quotation.subject}
      onChange={(e) =>
        setQuotation({ ...quotation, subject: e.target.value })
      }
      style={{ width: "100%", padding: "8px", margin: "5px 0 15px 0", fontSize: "16px" }}
    />
  </label>
</div>


        {/* Editable Table */}
        <EditableQuotationTable quotation={quotation} setQuotation={setQuotation} />
 {/* Terms & Conditions */}
<div style={{ marginTop: "30px" }}>
  <h3 style={{ textDecoration: "underline", marginBottom: "10px" }}>
    Terms & Conditions
  </h3>

  <p style={{ fontSize: "14px", marginBottom: "6px" }}>
    Applicable Terms & Conditions are available at:
  </p>

  <a
    href="/TermsAndConditions"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      fontSize: "14px",
      color: "#1F4E79",
      fontWeight: "bold",
      textDecoration: "underline",
    }}
  >
    View Terms & Conditions
  </a>
</div>


 {/* Signature & Seal */}
<h3>Yours Truly,</h3>
<div
  style={{
    border: "1px solid #000",
    marginTop: "50px",
    padding: "20px",
    textAlign: "center",
  }}
>
  <p><strong>Signature & Seal of Finance Manager</strong></p>

  <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
    {/* Signature Upload */}
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

    {/* Seal Upload */}
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

  {/* Name */}
  <div style={{ marginTop: "25px" }}>
    <p><strong>Name:</strong></p>
    <input
      type="text"
      value={quotation.financeManagerName || ""}
      onChange={(e) =>
        setQuotation({ ...quotation, financeManagerName: e.target.value })
      }
      style={{
        width: "60%",
        padding: "8px",
        fontSize: "16px",
        textAlign: "center",
      }}
    />
  </div>
</div>


{/* Footer */}
<div
  style={{
    display: "flex",
    backgroundColor: "#1F4E79", // main blue
    color: "#fff",
    fontSize: "13px",
    marginTop: "40px",
    borderTop: "2px solid #1F4E79",
  }}
>
  {/* Tel */}
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

  {/* Email */}
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

  {/* URL */}
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

  {/* Address */}
  <div
    style={{
      flex: 2,
      padding: "10px",
      textAlign: "center",
    }}
  >
    C-Wing North, 603, TIDEL Park<br />
    No.4, Rajiv Gandhi Salai,<br />
    Taramani, Chennai - 600113
  </div>
</div>

{/* GST / CIN strip */}
<div
  style={{
    backgroundColor: "#163A5F", // slightly darker blue
    color: "#fff",
    fontSize: "12px",
    textAlign: "center",
    padding: "6px",
  }}
>
  GSTIN:- 33AAJCT2401Q1Z7 | CIN : U91990TN2022NPL150529
</div>
<div>
<button
  onClick={generatePDF}
  style={{ marginTop: "10px", padding: "10px 20px", fontSize: "16px" }}
>
  Download PDF
</button>


{showPreview && (savedQuotation || quotation) && (
  <div className="modal" style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  }}>
    <div style={{ background: "#fff", padding: "20px", width: "80%", height: "90%", overflow: "auto" }}>
      <h2>Quotation Preview</h2>
      <p><strong>Client:</strong> {(savedQuotation || quotation).clientName}</p>
      <p><strong>Ref No:</strong> {(savedQuotation || quotation).refNo}</p>
      <p><strong>Date:</strong> {(savedQuotation || quotation).date}</p>

      <h3>Items</h3>
      {(savedQuotation || quotation).items?.map((item, idx) => (
        <p key={idx}>{idx + 1}. {item.description} — ₹{item.total}</p>
      ))}

      <h3>Terms & Conditions</h3>
      {(savedQuotation || quotation).terms?.map((t, i) => (
        <p key={i}>{i + 1}. <b>{t.title}</b>: {t.value}</p>
      ))}

      <div style={{ textAlign: "right" }}>
        <button onClick={() => setShowPreview(false)}>Close</button>
      </div>
    </div>
  </div>
)}


    </div>

</div>
</div>
  );
};

// Main Page
export default function GenerateQuotation() {
  
  const [quotation, setQuotation] = useState({
    subject: "",
    clientName: "",
    items: [],
    terms: [
      { title: "Validity", value: "This quotation is valid for 15 days." },
      { title: "Payment", value: "100% payment in advance." },
      { title: "Delivery", value: "Delivered within 1 day of PO." },
      { title: "Purchase Order", value: "PO must be issued within 5 days." }
    ]
  });

  const [refNo, setRefNo] = useState("TN/SA/2025/001");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showPreview, setShowPreview] = useState(false);
  const [savedQuotation, setSavedQuotation] = useState(null);

  const currentQuotation = { ...quotation, refNo, date }; // ✅ define it here

  const handleSubmit = async (data) => {
    await generateQuotationDocx(data);
    alert("Quotation Created Successfully");
    setSavedQuotation(data);
    setShowPreview(true);
  };

  const generatePDF = async () => {
  const element = document.createElement("div");
  element.style.width = "600px";
  element.style.padding = "20px";
  element.style.fontFamily = "Arial, sans-serif";
  element.style.background = "#fff";

  element.innerHTML = `
    <h2>Quotation</h2>
    <p><strong>Client:</strong> ${currentQuotation.clientName || "N/A"}</p>
    <p><strong>Ref No:</strong> ${currentQuotation.refNo}</p>
    <p><strong>Date:</strong> ${currentQuotation.date}</p>

    <h3>Items</h3>
    ${
      currentQuotation.items && currentQuotation.items.length > 0
        ? currentQuotation.items.map(
            (item, idx) =>
              `<p>${idx + 1}. ${item.description} — ₹${item.total}</p>`
          ).join("")
        : "<p>No items added</p>"
    }

    <h3>Terms & Conditions</h3>
    ${
      currentQuotation.terms && currentQuotation.terms.length > 0
        ? currentQuotation.terms.map(
            (t, i) => `<p>${i + 1}. <b>${t.title}</b>: ${t.value}</p>`
          ).join("")
        : "<p>No terms added</p>"
    }
  `;

  // Append to document so html2canvas can render it
  element.style.position = "absolute";
  element.style.left = "-9999px"; // hide offscreen
  document.body.appendChild(element);

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "pt", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${currentQuotation.refNo}.pdf`);

  // Clean up
  document.body.removeChild(element);
};

  return (
    <FinanceDocument
      quotation={quotation}
      setQuotation={setQuotation}
      refNo={refNo}
      setRefNo={setRefNo}
      date={date}
      setDate={setDate}
      handleSubmit={handleSubmit}
      showPreview={showPreview}
      setShowPreview={setShowPreview}
      savedQuotation={savedQuotation}
      generatePDF={generatePDF} // ✅ pass it
    />
  );
}
