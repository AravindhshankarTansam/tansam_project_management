
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
  BorderStyle,
} from "docx";

export const createQuotationDocx = async (q) => {
  const cell = (text, bold = false, align = AlignmentType.LEFT) =>
    new TableCell({
      width: { size: 50, type: WidthType.PERCENTAGE },
      margins: { top: 100, bottom: 100, left: 120, right: 120 },
      children: [
        new Paragraph({
          alignment: align,
          children: [
            new TextRun({
              text: text || "",
              bold,
              size: 22,
            }),
          ],
        }),
      ],
      borders: {
        top: { style: BorderStyle.SINGLE },
        bottom: { style: BorderStyle.SINGLE },
        left: { style: BorderStyle.SINGLE },
        right: { style: BorderStyle.SINGLE },
      },
    });

  const wideCell = (text, bold = false, align = AlignmentType.LEFT, width = 100, bgColor = null) =>
    new TableCell({
      width: { size: width, type: WidthType.PERCENTAGE },
      margins: { top: 100, bottom: 100, left: 120, right: 120 },
      shading: bgColor ? { fill: bgColor } : undefined,
      children: [
        new Paragraph({
          alignment: align,
          children: [
            new TextRun({
              text: text || "",
              bold,
              size: 22,
            }),
          ],
        }),
      ],
      borders: {
        top: { style: BorderStyle.SINGLE },
        bottom: { style: BorderStyle.SINGLE },
        left: { style: BorderStyle.SINGLE },
        right: { style: BorderStyle.SINGLE },
      },
    });

  const baseValue = parseFloat(q.value || 0);
  const tax = parseFloat(q.tax || 0);
  const totalAmount = baseValue + tax;

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { size: 22, font: "Calibri" },
          paragraph: { spacing: { line: 280 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 400, bottom: 400, left: 720, right: 720 },
          },
        },
        children: [
          // ========== HEADER ==========
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: "TAMIL NADU SMART AND ADVANCED MANUFACTURING CENTRE",
                bold: true,
                size: 26,
                color: "1F4FD8",
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "QUOTATION",
                bold: true,
                size: 28,
                color: "1F4FD8",
              }),
            ],
          }),

          // ========== QUOTATION INFO ==========
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  cell(`Quotation No: ${q.quotationNo || "---"}`, true),
                  cell(`Date: ${q.date || "---"}`, true),
                ],
              }),
              new TableRow({
                children: [
                  cell(`Client Name: ${q.clientName || "---"}`, true),
                  cell(`Client Type: ${q.clientType || "---"}`, true),
                ],
              }),
              new TableRow({
                children: [
                  cell(`Work Category: ${q.workCategory || "---"}`, true),
                  cell(`Lab: ${q.lab || "---"}`, true),
                ],
              }),
              new TableRow({
                children: [
                  cell(`Valid Until: ${q.validUntil || "30 days"}`, true),
                  cell(`Reference: ${q.reference || "---"}`, true),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { after: 120 } }),

          // ========== ITEMS TABLE ==========
          new Paragraph({
            children: [
              new TextRun({
                text: "SCOPE OF WORK",
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 80 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  wideCell("Description", true, AlignmentType.CENTER, 45, "D3E5F7"),
                  wideCell("Qty", true, AlignmentType.CENTER, 10, "D3E5F7"),
                  wideCell("Unit Price (₹)", true, AlignmentType.CENTER, 22, "D3E5F7"),
                  wideCell("Amount (₹)", true, AlignmentType.CENTER, 23, "D3E5F7"),
                ],
              }),
              new TableRow({
                children: [
                  wideCell(q.description || "Service/Product", false, AlignmentType.LEFT, 45),
                  wideCell(q.quantity || "1", false, AlignmentType.CENTER, 10),
                  wideCell(`₹ ${baseValue.toLocaleString("en-IN")}`, false, AlignmentType.RIGHT, 22),
                  wideCell(`₹ ${baseValue.toLocaleString("en-IN")}`, false, AlignmentType.RIGHT, 23),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { after: 100 } }),

          // ========== AMOUNT SUMMARY TABLE ==========
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  wideCell("Subtotal", true, AlignmentType.RIGHT, 50),
                  wideCell(`₹ ${baseValue.toLocaleString("en-IN")}`, false, AlignmentType.RIGHT, 50),
                ],
              }),
              new TableRow({
                children: [
                  wideCell("Tax / GST", true, AlignmentType.RIGHT, 50),
                  wideCell(`₹ ${tax.toLocaleString("en-IN")}`, false, AlignmentType.RIGHT, 50),
                ],
              }),
              new TableRow({
                children: [
                  wideCell("TOTAL AMOUNT", true, AlignmentType.RIGHT, 50, "D3E5F7"),
                  wideCell(`₹ ${totalAmount.toLocaleString("en-IN")}`, true, AlignmentType.RIGHT, 50, "D3E5F7"),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { after: 100 } }),

          // ========== TERMS & CONDITIONS ==========
          new Paragraph({
            children: [
              new TextRun({
                text: "TERMS & CONDITIONS:",
                bold: true,
                size: 22,
              }),
            ],
            spacing: { after: 70 },
          }),

          new Paragraph({
            spacing: { after: 45 },
            children: [
              new TextRun({
                text: "1. Quotation Validity: This quotation is valid for 30 days from the date mentioned above. After expiry, rates and terms may change without notice.",
                size: 20,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 45 },
            children: [
              new TextRun({
                text: "2. Payment Terms: 100% advance payment required. Bank Transfer / Cheque / Cash accepted as per company policy. GST applicable if mentioned.",
                size: 20,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 45 },
            children: [
              new TextRun({
                text: "3. Delivery & Timeline: Delivery will be made as per the agreed timeline. Delays caused by client or external factors beyond our control are not our responsibility.",
                size: 20,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 45 },
            children: [
              new TextRun({
                text: "4. Scope of Work: This quotation is limited to the items/services mentioned above. Any additional work or modifications will be charged separately and requires written approval.",
                size: 20,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 45 },
            children: [
              new TextRun({
                text: "5. Warranty & Liability: Products/services covered under standard warranty as per company policy. Any damage due to misuse or negligence will not be covered. Liability limited to quoted amount.",
                size: 20,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 45 },
            children: [
              new TextRun({
                text: "6. Cancellation & Refund: Cancellations must be made in writing. Cancellation charges may apply if work has already commenced. Refunds processed as per policy.",
                size: 20,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 45 },
            children: [
              new TextRun({
                text: "7. Governing Terms: All disputes shall be subject to the jurisdiction of courts in Chennai, Tamil Nadu, India. This quotation is subject to our standard terms and conditions.",
                size: 20,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "By accepting this quotation, you agree to all the above terms and conditions.",
                size: 20,
                italics: true,
              }),
            ],
          }),

          // ========== FOOTER ==========
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  wideCell("Authorized Signatory", true, AlignmentType.CENTER, 50),
                  wideCell("Date & Seal", true, AlignmentType.CENTER, 50),
                ],
              }),
              new TableRow({
                children: [
                  wideCell("_________________________", false, AlignmentType.CENTER, 50),
                  wideCell("_________________________", false, AlignmentType.CENTER, 50),
                ],
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 30 },
            children: [
              new TextRun({
                text: "Thank you for your business!",
                italics: true,
                size: 20,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 20 },
            children: [
              new TextRun({
                text: "Tamil Nadu Smart and Advanced Manufacturing Centre",
                size: 18,
                bold: true,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Email: contact@tnsam.org | Phone: +91-XXXXXXXXXX | Website: tnsam.org",
                size: 18,
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
};
