// dashboards/Finance/Taxinvoice.jsx
import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TaxInvoicePdf from "./TaxInvoicePdf";
import "../../layouts/CSS/TaxInvoiceEditor.css";

import tnlogo from "../../assets/tansam/tnlogo.png";
import tansamLogo from "../../assets/tansam/tansamoldlogo.png";
import tidco from "../../assets/tansam/tidcologo.png";

// Simple Indian number to words (basic version - handles up to crores)
const numberToWords = (num) => {
  if (!num || num === 0) return "Zero Rupees Only";
  
  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const scales = ["", "Thousand", "Lakh", "Crore"];

  const convert = (n) => {
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + units[n % 10] : "");
    if (n < 1000) return units[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");

    for (let i = 3; i >= 1; i--) {
      const divider = Math.pow(100, i);
      if (n >= divider) {
        return convert(Math.floor(n / divider)) + " " + scales[i] + (n % divider ? " " + convert(n % divider) : "");
      }
    }
    return "";
  };

  return convert(num) + " Only";
};

export default function Taxinvoice() {
  const [invoice, setInvoice] = useState({
    invoiceNo: "TN/INV/2026/001",
    invoiceDate: "2026-01-31",
    registeredOffice: "19A Rukmini Lakshmipathy Road\nEgmore, Chennai – 600008",
    terms: "Due on Receipt",
    duration: "As per Quotation",
    billTo: "The Director,\nDirectorate of Public Health and Preventive Medicine,\nDMS Campus, Chennai - 600006",
    shipTo: "The Director,\nDirectorate of Public Health and Preventive Medicine,\nNo.359, Anna Salai, Teynampet,\nDMS Campus, Chennai - 600006",
    items: [
      {
        sl: "1",
        description: "Information technology (IT) consulting and support services (Design, Development, Integration, Testing & Deployment)",
        sac: "998313",
        amc: "1 Year",
        unit: "550000",
        amount: "550000",
      },
    ],
    sgstRate: 9,
    cgstRate: 9,

    // Editable fields in right box
    totalInWords: "Six Lakh Forty Nine Thousand Only",
    bankNameAddress: "ICICI Bank, 20, Egmore High Rd, Egmore, Chennai, Tamil Nadu 600008",
    bankAccount: "321901001253",
    ifscCode: "ICIC0003219",
  });

  const serviceValue = invoice.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const sgst = Math.round((serviceValue * invoice.sgstRate) / 100);
  const cgst = Math.round((serviceValue * invoice.cgstRate) / 100);
  const grandTotal = serviceValue + sgst + cgst;
  const [signatureImage, setSignatureImage] = useState(null);
  const handleSignatureUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    setSignatureImage(reader.result); // base64
  };
  reader.readAsDataURL(file);
};

  // Auto-update Total in Words when grandTotal changes (unless user manually edited it)
  useEffect(() => {
    const autoWords = numberToWords(grandTotal);
    setInvoice(prev => ({
      ...prev,
      totalInWords: prev.totalInWords === "Six Lakh Forty Nine Thousand Only" ? autoWords : prev.totalInWords
    }));
  }, [grandTotal]);

  const handleChange = (field) => (e) => {
    setInvoice(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="invoice-editor">
      {/* Header */}
      <div className="invoice-header-fixed">
        <div className="logos-row">
          <img src={tnlogo} alt="TN Govt" className="logo-small left-logo" />
          <div className="center-logo-container">
            <img src={tansamLogo} alt="TANSAM" className="logo-main" />
            <p className="powered-by">Powered by SIEMENS</p>
          </div>
          <img src={tidco} alt="TIDCO" className="logo-small right-logo" />
        </div>

        <div className="company-info">
          <h2 className="company-main-title">Tamil Nadu Smart and Advanced Manufacturing Centre</h2>
          <p className="company-subtitle">(A Government of Tamil Nadu Enterprise wholly owned by TIDCO)</p>
        </div>

        <h1 className="tax-invoice-title">TAX INVOICE</h1>
      </div>

      <hr className="header-divider" />

      {/* Top row with editable Registered Office */}
      <div className="top-row">
        <div className="left-column">
          <div className="field-row">
            <label>Invoice No</label>
            <input value={invoice.invoiceNo} onChange={handleChange("invoiceNo")} />
          </div>
          <div className="field-row">
            <label>Date</label>
            <input type="date" value={invoice.invoiceDate} onChange={handleChange("invoiceDate")} />
          </div>
          <div className="field-row">
            <label>Terms</label>
            <input value={invoice.terms} onChange={handleChange("terms")} />
          </div>
          <div className="field-row">
            <label>Duration</label>
            <input value={invoice.duration} onChange={handleChange("duration")} />
          </div>
        </div>

        <div className="right-column">
          <strong>Registered Office</strong>
          <textarea
            value={invoice.registeredOffice}
            onChange={handleChange("registeredOffice")}
            rows={3}
          />
        </div>
      </div>

      {/* Bill To / Ship To */}
      <div className="address-row">
        <div className="address-box">
          <strong>Bill To</strong>
          <textarea value={invoice.billTo} onChange={handleChange("billTo")} rows={5} />
        </div>
        <div className="address-box">
          <strong>Ship To</strong>
          <textarea value={invoice.shipTo} onChange={handleChange("shipTo")} rows={5} />
          <p className="place-supply">Place of Supply: Tamil Nadu (33)</p>
        </div>
      </div>

      {/* Invoice Table */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Sl No</th>
            <th>DESCRIPTION</th>
            <th>SAC/HSN Code</th>
            <th>AMC</th>
            <th>Unit Price / Development cost</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i}>
              <td>{item.sl}</td>
              <td><textarea value={item.description} onChange={(e) => {
                const items = [...invoice.items];
                items[i].description = e.target.value;
                setInvoice({ ...invoice, items });
              }} rows={3} /></td>
              <td><input value={item.sac} onChange={(e) => {
                const items = [...invoice.items];
                items[i].sac = e.target.value;
                setInvoice({ ...invoice, items });
              }} /></td>
              <td><input value={item.amc} onChange={(e) => {
                const items = [...invoice.items];
                items[i].amc = e.target.value;
                setInvoice({ ...invoice, items });
              }} /></td>
              <td><input type="number" value={item.unit} onChange={(e) => {
                const items = [...invoice.items];
                items[i].unit = e.target.value;
                items[i].amount = e.target.value;
                setInvoice({ ...invoice, items });
              }} /></td>
              <td>₹ {Number(item.amount).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="footer-section">
        <div className="footer-two-columns">
          {/* LEFT: Totals */}
          <div className="left-totals-box">
            <div className="total-row">
              <span>Total Service Value</span>
              <span>₹ {serviceValue.toLocaleString("en-IN")}</span>
            </div>
            <div className="total-row">
              <span>SGST @9%</span>
              <span>₹ {sgst.toLocaleString("en-IN")}</span>
            </div>
            <div className="total-row">
              <span>CGST @9%</span>
              <span>₹ {cgst.toLocaleString("en-IN")}</span>
            </div>
            <div className="total-row grand">
              <span>Total Service Value with GST</span>
              <span>₹ {grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* RIGHT: Total in Words + Bank (single box) */}
          <div className="right-words-bank-box">
            {/* Total in Words - editable */}
            <div className="words-section">
              <label>Total in Words:</label>
              <input
                value={invoice.totalInWords}
                onChange={handleChange("totalInWords")}
                className="total-words-input"
              />
            </div>

            {/* Bank Details - editable */}
            <div className="bank-section">
              <div className="bank-row">
                <label>Bank Name & address:-</label>
                <textarea
                  value={invoice.bankNameAddress}
                  onChange={handleChange("bankNameAddress")}
                  rows={2}
                  className="bank-textarea"
                />
              </div>
              <div className="bank-row">
                <label>Bank A/c No.:</label>
                <input
                  value={invoice.bankAccount}
                  onChange={handleChange("bankAccount")}
                  className="bank-input"
                />
              </div>
              <div className="bank-row">
                <label>IFSC Code:</label>
                <input
                  value={invoice.ifscCode}
                  onChange={handleChange("ifscCode")}
                  className="bank-input"
                />
              </div>
            </div>
          </div>
        </div>

      {/* Authorized Signature */}
<div className="signature-area">
  <div className="signature-box">
  {signatureImage ? (
    <img
      src={signatureImage}
      alt="Authorized Signature"
      className="signature-preview"
    />
  ) : (
    <span>Authorized Signature</span>
  )}
</div>


  <input
    type="file"
    accept="image/png,image/jpeg"
    onChange={handleSignatureUpload}
    className="signature-upload"
  />
</div>


        {/* Footer bar */}
        <div className="footer-contact-bar">
          <div className="contact-left">
            Tel: +91 44 69255700<br />
            E-Mail: info@tansam.org<br />
            URL: www.tansam.org
          </div>
          <div className="contact-right">
            C-Wing North, 603, TIDEL Park,<br />
            No.4, Rajiv Gandhi Salai,<br />
            Taramani, Chennai-600113
          </div>
        </div>

        {/* GSTIN */}
        <div className="gstin-line">
          GSTIN: 33AAJCT2401Q1Z7 | CIN: U91990TN2022NPL150529
        </div>
      </div>

      <PDFDownloadLink
        document={
          <TaxInvoicePdf
            invoiceNo={invoice.invoiceNo}
            invoiceDate={invoice.invoiceDate}
            registeredOffice={invoice.registeredOffice}
            terms={invoice.terms}
            duration={invoice.duration}
            billTo={invoice.billTo}
            shipTo={invoice.shipTo}
            items={invoice.items}
            serviceValue={serviceValue}
            sgst={sgst}
            cgst={cgst}
            totalWithGst={grandTotal}
            amountInWords={invoice.totalInWords}
            bankNameAddress={invoice.bankNameAddress}
            bankAccount={invoice.bankAccount}
            ifsc={invoice.ifscCode}
            signatureImage={signatureImage} 
          />
        }
        fileName={`TAX_INVOICE_${invoice.invoiceNo.replace(/\//g, "_")}.pdf`}
        className="download-btn"
      >
        Download Tax Invoice
      </PDFDownloadLink>
    </div>
  );
}