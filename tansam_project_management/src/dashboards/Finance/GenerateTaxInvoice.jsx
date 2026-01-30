// dashboards/Finance/Taxinvoice.jsx
import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TaxInvoicePdf from "./TaxInvoicePdf";

export default function Taxinvoice() {
  const [invoice] = useState({
    invoiceNo: "TN/INV/2026/001",
    invoiceDate: "31-01-2026",
    billTo: "TANSAM\nChennai",
    shipTo: "TANSAM\nChennai",
    items: [
      {
        description: "Industrial Training Program",
        sac: "9983",
        amc: "-",
        unitPrice: "5000",
        amount: "5000",
      },
    ],
    serviceValue: "5000",
    sgst: "450",
    cgst: "450",
    totalWithGst: "5900",
    amountInWords: "Rupees Five Thousand Nine Hundred Only",
  });

  return (
    <div style={{ padding: "30px" }}>
      <h2>Tax Invoice</h2>

      <PDFDownloadLink
        document={
          <TaxInvoicePdf
            invoiceNo={invoice.invoiceNo}
            invoiceDate={invoice.invoiceDate}
            terms="Due on Receipt"
            duration="As per quotation"
            billTo={invoice.billTo}
            shipTo={invoice.shipTo}
            items={invoice.items}
            serviceValue={invoice.serviceValue}
            sgst={invoice.sgst}
            cgst={invoice.cgst}
            totalWithGst={invoice.totalWithGst}
            amountInWords={invoice.amountInWords}
            bankName="ICICI Bank, Egmore"
            bankAccount="321901001253"
            ifsc="ICIC0003219"
          />
        }
        fileName={`${invoice.invoiceNo}.pdf`}
        style={{
          padding: "10px 20px",
          backgroundColor: "#1F4E79",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "4px",
        }}
      >
        {({ loading }) =>
          loading ? "Generating PDF..." : "Download Tax Invoice"
        }
      </PDFDownloadLink>
    </div>
  );
}
