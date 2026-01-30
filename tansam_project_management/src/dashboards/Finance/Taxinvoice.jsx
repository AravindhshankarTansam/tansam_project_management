// dashboards/Finance/Taxinvoice.jsx
import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TaxInvoicePdf from "./TaxInvoicePdf";
import "../../layouts/CSS/TaxInvoiceEditor.css";

import tnlogo from "../../assets/tansam/tnlogo.png";
import tansamLogo from "../../assets/tansam/tansamoldlogo.png";
import tidco from "../../assets/tansam/tidcologo.png";

export default function Taxinvoice() {
  const [invoice, setInvoice] = useState({
    invoiceNo: "TN/INV/2026/001",
    invoiceDate: "2026-01-31",
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
    terms: "Due on Receipt",
    duration: "As per Quotation",
    sgstRate: 9,
    cgstRate: 9,
  });

  const serviceValue = invoice.items.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const sgst = Math.round((serviceValue * invoice.sgstRate) / 100);
  const cgst = Math.round((serviceValue * invoice.cgstRate) / 100);
  const grandTotal = serviceValue + sgst + cgst;

  const amountInWords = "Six Lakh Forty Nine Thousand Only";

 return (
    <div className="invoice-editor">
      {/* Fixed Header - matching original printed invoice */}
      <div className="invoice-header-fixed">
        {/* Logos row */}
        <div className="logos-row">
          <img src={tnlogo} alt="TN Govt" className="logo-small left-logo" />
          <div className="center-logo-container">
            <img src={tansamLogo} alt="TANSAM" className="logo-main" />
            <p className="powered-by">Powered by SIEMENS</p>
          </div>
          <img src={tidco} alt="TIDCO" className="logo-small right-logo" />
        </div>

        {/* Company name & subtitle */}
        <div className="company-info">
          <h2 className="company-main-title">
            Tamil Nadu Smart and Advanced Manufacturing Centre
          </h2>
          <p className="company-subtitle">
            (A Government of Tamil Nadu Enterprise wholly owned by TIDCO)
          </p>
        </div>

        {/* TAX INVOICE title */}
        <h1 className="tax-invoice-title">TAX INVOICE</h1>
      </div>

      <hr className="header-divider" />

      {/* Rest of the form */}
      <div className="top-row">
        <div className="left-column">
          <div className="field-row">
            <label>Invoice No</label>
            <input
              value={invoice.invoiceNo}
              onChange={(e) => setInvoice({ ...invoice, invoiceNo: e.target.value })}
            />
          </div>
          <div className="field-row">
            <label>Date</label>
            <input
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.target.value })}
            />
          </div>
          <div className="field-row static">
            <label>Terms</label>
            <span>{invoice.terms}</span>
          </div>
          <div className="field-row static">
            <label>Duration</label>
            <span>{invoice.duration}</span>
          </div>
        </div>

        <div className="right-column">
          <strong>Registered Office</strong>
          <p>19A Rukmini Lakshmipathy Road</p>
          <p>Egmore, Chennai – 600008</p>
        </div>
      </div>

      <div className="address-row">
        <div className="address-box">
          <strong>Bill To</strong>
          <textarea
            value={invoice.billTo}
            onChange={(e) => setInvoice({ ...invoice, billTo: e.target.value })}
            rows={5}
          />
        </div>

        <div className="address-box">
          <strong>Ship To</strong>
          <textarea
            value={invoice.shipTo}
            onChange={(e) => setInvoice({ ...invoice, shipTo: e.target.value })}
            rows={5}
          />
          <p className="place-supply">Place of Supply: Tamil Nadu (33)</p>
        </div>
      </div>

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
              <td>
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const items = [...invoice.items];
                    items[i].description = e.target.value;
                    setInvoice({ ...invoice, items });
                  }}
                  rows={3}
                />
              </td>
              <td>
                <input
                  value={item.sac}
                  onChange={(e) => {
                    const items = [...invoice.items];
                    items[i].sac = e.target.value;
                    setInvoice({ ...invoice, items });
                  }}
                />
              </td>
              <td>
                <input
                  value={item.amc}
                  onChange={(e) => {
                    const items = [...invoice.items];
                    items[i].amc = e.target.value;
                    setInvoice({ ...invoice, items });
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.unit}
                  onChange={(e) => {
                    const items = [...invoice.items];
                    items[i].unit = e.target.value;
                    items[i].amount = e.target.value;
                    setInvoice({ ...invoice, items });
                  }}
                />
              </td>
              <td>₹ {Number(item.amount).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
<div className="footer-section">
  {/* Total in Words - full width above the totals table */}
  <div className="amount-in-words-block">
    <strong>Total in Words:</strong> {amountInWords}
  </div>

  {/* Totals table - wider, full-width like printed invoice */}
  <div className="totals-table-block">
    <div className="total-line">
      <span className="total-label">Total Service Value</span>
      <span className="total-value">₹ {serviceValue.toLocaleString("en-IN")}</span>
    </div>
    <div className="total-line">
      <span className="total-label">SGST @9%</span>
      <span className="total-value">₹ {sgst.toLocaleString("en-IN")}</span>
    </div>
    <div className="total-line">
      <span className="total-label">CGST @9%</span>
      <span className="total-value">₹ {cgst.toLocaleString("en-IN")}</span>
    </div>
    <div className="total-line grand-total">
      <span className="total-label">Total Service Value with GST</span>
      <span className="total-value">₹ {grandTotal.toLocaleString("en-IN")}</span>
    </div>
  </div>

  {/* Bank Details - one single box below totals */}
  <div className="bank-details-box">
    <div className="bank-line">
      <strong>Bank Name & address:-</strong>
      <span>ICICI Bank, 20, Egmore High Rd, Egmore, Chennai, Tamil Nadu 600008</span>
    </div>
    <div className="bank-line">
      <strong>Bank A/c No.:</strong>
      <span>321901001253</span>
    </div>
    <div className="bank-line">
      <strong>IFSC Code:</strong>
      <span>ICIC0003219</span>
    </div>
  </div>

  {/* Authorized Signature - right side */}
  <div className="signature-section">
    <div className="signature-box">
      <p>Authorized Signature</p>
    </div>
  </div>

  {/* Footer contact bar */}
  <div className="invoice-footer-bar">
    <div className="footer-left">
      Tel: +91 44 69255700<br />
      E-Mail: info@tansam.org<br />
      URL: www.tansam.org
    </div>
    <div className="footer-right">
      C-Wing North, 603, TIDEL Park,<br />
      No.4, Rajiv Gandhi Salai,<br />
      Taramani, Chennai-600113
    </div>
  </div>

  {/* GSTIN / CIN */}
  <div className="gstin-bar">
    GSTIN: 33AAJCT2401Q1Z7 | CIN: U91990TN2022NPL150529
  </div>
</div>
      <PDFDownloadLink
        document={
          <TaxInvoicePdf
            invoiceNo={invoice.invoiceNo}
            invoiceDate={invoice.invoiceDate}
            billTo={invoice.billTo}
            shipTo={invoice.shipTo}
            items={invoice.items}
            serviceValue={serviceValue}
            sgst={sgst}
            cgst={cgst}
            totalWithGst={grandTotal}
            amountInWords={amountInWords}
            terms={invoice.terms}
            duration={invoice.duration}
            bankName="ICICI Bank, 20, Egmore High Rd, Egmore, Chennai, Tamil Nadu 600008"
            bankAccount="321901001253"
            ifsc="ICIC0003219"
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