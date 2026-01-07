import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ImageRun } from "docx";
import fs from "fs";

export const createQuotationDocx = async (quotation) => {
  // Read logo
  const logo = fs.readFileSync(
    "D:/Aishwarya_2025/project_management_system/tansam_project_management/tansam_project_management/backend/src/assets/logo.png"
  );

  // Table for quotation details
  const detailsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Quotation No: " + quotation.quotationNo)] }),
          new TableCell({ children: [new Paragraph("Date: " + new Date(quotation.date).toLocaleDateString())] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Client Name: " + quotation.clientName)] }),
          new TableCell({ children: [new Paragraph("Client Type: " + quotation.clientType)] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Work Category: " + quotation.workCategory)] }),
          new TableCell({ children: [new Paragraph("Lab: " + quotation.lab)] }),
        ],
      }),
    ],
  });

  // Table for description and value
  const itemsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Description")] }),
          new TableCell({ children: [new Paragraph("Quote Value (₹)")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(quotation.description)] }),
          new TableCell({ children: [new Paragraph(parseInt(quotation.value).toLocaleString("en-IN"))] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Total")], columnSpan: 1 }),
          new TableCell({ children: [new Paragraph(parseInt(quotation.value).toLocaleString("en-IN"))] }),
        ],
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Logo + Title
          new Paragraph({
            children: [
              new ImageRun({
                data: logo,
                transformation: { width: 150, height: 50 },
              }),
              new TextRun({ text: "\n\nQUOTATION\n\n", bold: true, size: 36 }),
            ],
          }),
          // Details Table
          detailsTable,
          new Paragraph({ text: "\n" }),
          // Items Table
          itemsTable,
          new Paragraph({ text: "\n\nThank you for your business!", italics: true }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
};