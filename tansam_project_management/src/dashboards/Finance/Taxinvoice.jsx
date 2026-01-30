// dashboards/Finance/Taxinvoice.jsx
import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TaxInvoicePdf from "./TaxInvoicePdf";
import "../../layouts/CSS/TaxInvoiceEditor.css";
export default function Taxinvoice() {
  const [invoice, setInvoice] = useState({
    invoiceNo: "TN/INV/2026/001",
    invoiceDate: "2026-01-31",
    billTo: "The Director,\nDMS Campus,\nChennai – 600006",
    shipTo: "The Director,\nDMS Campus,\nChennai – 600006",
    items: [
      {
        description:
          "Information Technology Consulting & Support Services",
        sac: "998313",
        amc: "1 Year",
        unitPrice: 550000,
      },
    ],
    sgstRate: 9,
    cgstRate: 9,
  });

  const serviceValue = invoice.items.reduce(
    (s, i) => s + Number(i.unitPrice || 0),
    0
  );

  const sgst = Math.round((serviceValue * invoice.sgstRate) / 100);
  const cgst = Math.round((serviceValue * invoice.cgstRate) / 100);
  const totalWithGst = serviceValue + sgst + cgst;

  return (
    <div className="invoice-editor">
      <h2>TAX INVOICE</h2>

      {/* HEADER BOX */}
      <div className="box-row">
        <div className="box-cell">
          <label>Invoice No</label>
          <input
            value={invoice.invoiceNo}
            onChange={(e) =>
              setInvoice({ ...invoice, invoiceNo: e.target.value })
            }
          />

          <label>Date</label>
          <input
            type="date"
            value={invoice.invoiceDate}
            onChange={(e) =>
              setInvoice({ ...invoice, invoiceDate: e.target.value })
            }
          />

          <p>Terms: Due on Receipt</p>
          <p>Duration: As per quotation</p>
        </div>

        <div className="box-cell">
          <strong>Registered Office</strong>
          <p>19A Rukmini Lakshmipathy Road</p>
          <p>Egmore, Chennai – 600008</p>
        </div>
      </div>

      {/* BILL / SHIP */}
      <div className="box-row">
        <div className="box-cell">
          <strong>Bill To</strong>
          <textarea
            value={invoice.billTo}
            onChange={(e) =>
              setInvoice({ ...invoice, billTo: e.target.value })
            }
          />
        </div>

        <div className="box-cell">
          <strong>Ship To</strong>
          <textarea
            value={invoice.shipTo}
            onChange={(e) =>
              setInvoice({ ...invoice, shipTo: e.target.value })
            }
          />
          <p>Place of Supply: Tamil Nadu (33)</p>
        </div>
      </div>

      {/* TABLE */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Sl</th>
            <th>Description</th>
            <th>SAC</th>
            <th>AMC</th>
            <th>Unit</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                <input
                  value={item.description}
                  onChange={(e) => {
                    const items = [...invoice.items];
                    items[i].description = e.target.value;
                    setInvoice({ ...invoice, items });
                  }}
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
                  value={item.unitPrice}
                  onChange={(e) => {
                    const items = [...invoice.items];
                    items[i].unitPrice = Number(e.target.value);
                    setInvoice({ ...invoice, items });
                  }}
                />
              </td>
              <td>{item.unitPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS */}
      <div className="totals-box">
        <p>Total: ₹ {serviceValue}</p>
        <p>SGST @ 9%: ₹ {sgst}</p>
        <p>CGST @ 9%: ₹ {cgst}</p>
        <h3>Grand Total: ₹ {totalWithGst}</h3>
      </div>

      {/* DOWNLOAD */}
      <PDFDownloadLink
        document={
          <TaxInvoicePdf
            invoiceNo={invoice.invoiceNo}
            invoiceDate={invoice.invoiceDate}
            billTo={invoice.billTo}
            shipTo={invoice.shipTo}
            items={invoice.items.map((i) => ({
              ...i,
              amount: i.unitPrice,
            }))}
            serviceValue={serviceValue}
            sgst={sgst}
            cgst={cgst}
            totalWithGst={totalWithGst}
            amountInWords="Six Lakh Forty Nine Thousand Only"
            terms="Due on Receipt"
            duration="As per quotation"
            bankName="ICICI Bank, Egmore"
            bankAccount="321901001253"
            ifsc="ICIC0003219"
          />
        }
        fileName={`${invoice.invoiceNo}.pdf`}
        className="download-btn"
      >
        Download Tax Invoice
      </PDFDownloadLink>
    </div>
  );
}
