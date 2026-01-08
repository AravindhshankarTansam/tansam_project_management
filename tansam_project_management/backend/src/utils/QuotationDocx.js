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
      margins: { top: 200, bottom: 200, left: 200, right: 200 },
      children: [
        new Paragraph({
          alignment: align,
          children: [
            new TextRun({
              text,
              bold,
              size: 24, // ✅ 12pt NORMAL SIZE
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

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { size: 24, font: "Times New Roman" },
          paragraph: { spacing: { line: 360 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children: [
          /* ORGANIZATION NAME */
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text:
                  "TAMIL NADU SMART AND ADVANCED MANUFACTURING CENTRE",
                bold: true,
                size: 28, // ✅ 14pt
                color: "1F4FD8",
              }),
            ],
          }),

          /* TITLE */
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: "QUOTATION",
                bold: true,
                size: 32, // ✅ 16pt
                color: "1F4FD8",
              }),
            ],
          }),

          /* INFO TABLE */
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  cell(`Quotation No: ${q.quotationNo}`, true),
                  cell(`Quote Date: ${q.date}`, true),
                ],
              }),
              new TableRow({
                children: [
                  cell(`Client Name: ${q.clientName}`, true),
                  cell(`Client Type: ${q.clientType}`, true),
                ],
              }),
              new TableRow({
                children: [
                  cell(`Work Category: ${q.workCategory}`, true),
                  cell(`Lab: ${q.lab}`, true),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { after: 500 } }),

          /* VALUE TABLE */
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  cell("Description", true, AlignmentType.CENTER),
                  cell("Quote Value (₹)", true, AlignmentType.CENTER),
                  cell("Tax", true, AlignmentType.CENTER),
                  cell("Total", true, AlignmentType.CENTER),
                ],
              }),
              new TableRow({
                children: [
                  cell(q.description),
                  cell(q.value, false, AlignmentType.CENTER),
                  cell("0", false, AlignmentType.CENTER),
                  cell(q.value, false, AlignmentType.CENTER),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 600 } }),

          /* TERMS */
          new Paragraph({
            children: [
              new TextRun({
                text: "Terms and conditions",
                bold: true,
                size: 26,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "-------------------------------------------",
                size: 24,
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
};
