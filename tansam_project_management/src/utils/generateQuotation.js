import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
} from "docx";

export async function generateQuotationDocx(quotation) {
  const doc = new Document({
    sections: [
      {
        footers: {
          default: new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text:
                  "TANSAM | Project Management Division\n" +
                  "Address: __________________ | Email: __________________ | Phone: __________________",
                size: 18,
              }),
            ],
          }),
        },

        children: [
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "QUOTATION",
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph(""),
          new Paragraph(`Quotation Ref No: ____________________`),
          new Paragraph(`To: ${quotation.clientName}`),
          new Paragraph(`Date: ${new Date().toLocaleDateString()}`),
          new Paragraph(`Subject: ${quotation.subject || "Project Quotation"}`),

          // Project Overview
          new Paragraph(""),
          new Paragraph({
            children: [new TextRun({ text: "Project Overview", bold: true })],
          }),
          new Paragraph(`Project Name: ____________________`),
          new Paragraph(
            quotation.description || "Project Description: ____________________"
          ),
          new Paragraph(`Project Duration: ____________________`),

          // Quotation Table
          new Paragraph(""),
          new Paragraph({
            children: [new TextRun({ text: "Quotation Details", bold: true })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: ["Sl No", "Description", "Persons", "Quantity", "Unit Price", "Total"].map(
                  (h) =>
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: h, bold: true })],
                        }),
                      ],
                    })
                ),
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("1")] }),
                  new TableCell({ children: [new Paragraph(quotation.description || "")] }),
                  new TableCell({ children: [new Paragraph("")] }),
                  new TableCell({ children: [new Paragraph("")] }),
                  new TableCell({ children: [new Paragraph("")] }),
                  new TableCell({ children: [new Paragraph(quotation.amount || "")] }),
                ],
              }),
            ],
          }),

          // Finance Section
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Amount Summary (Finance Use Only)", bold: true })] }),
          new Paragraph("Subtotal: ____________________"),
          new Paragraph("Tax (%): _____________________"),
          new Paragraph("Total Amount: ________________"),
          new Paragraph("Amount in Words: _____________________________"),

          // Payment Terms
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Payment Terms", bold: true })] }),
          new Paragraph("Advance Payment: ____________________"),
          new Paragraph("Payment Mode: _______________________"),
          new Paragraph("Credit Period: _______________________"),

          // Validity
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Quotation Validity", bold: true })] }),
          new Paragraph("This quotation is valid for _____ days from the date of issue."),

          // Terms & Conditions
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Terms & Conditions", bold: true })] }),
          new Paragraph(
            "1. Scope of work as discussed.\n2. Any additional work will be charged separately.\n3. Taxes applicable as per government norms."
          ),

          // Bank Details
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Bank Details", bold: true })] }),
          new Paragraph("Account Name: ______________________"),
          new Paragraph("Bank Name: _________________________"),
          new Paragraph("Account Number: ____________________"),
          new Paragraph("IFSC Code: __________________________"),

          // Declaration
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Declaration", bold: true })] }),
          new Paragraph(
            "We hereby declare that the above information is true and correct to the best of our knowledge."
          ),

          // Signatures
          new Paragraph(""),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph("For TANSAM"),
                      new Paragraph("\nAuthorized Signature"),
                      new Paragraph("Name:"),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("Yours Truly"),
                      new Paragraph("\nManager Signature"),
                      new Paragraph("Name:"),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  // Download file directly in browser
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "TANSAM_Quotation.docx";
  a.click();
  window.URL.revokeObjectURL(url);
}
