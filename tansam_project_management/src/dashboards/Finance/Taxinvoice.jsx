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
      {/* Header - exactly like PDF */}
      <div className="invoice-top-header">
        <div className="logos-container">
          <img src={tnlogo} alt="TN Govt Logo" className="header-logo" />
          <img src={tansamLogo} alt="TANSAM Logo" className="header-logo" />
          <img src={tidco} alt="TIDCO Logo" className="header-logo" />
        </div>

        <div className="company-title-block">
          <h2 className="company-name">
            Tamil Nadu Smart and Advanced Manufacturing Centre
          </h2>
          <p className="company-subtitle">
            (A Government of Tamil Nadu Enterprise wholly owned by TIDCO)
          </p>
          <h1 className="invoice-main-title">TAX INVOICE</h1>
        </div>
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
        <div className="totals-and-words">
          <div className="totals-box">
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

          <div className="amount-words">
            <strong>Total in Words:</strong> {amountInWords}
          </div>
        </div>

        <div className="bank-details">
          <strong>Bank Name & address:-</strong>
          <p>ICICI Bank, 20, Egmore High Rd, Egmore, Chennai, Tamil Nadu 600008</p>
          <strong>Bank A/c No.:</strong> 321901001253
          <br />
          <strong>IFSC Code:</strong> ICIC0003219
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