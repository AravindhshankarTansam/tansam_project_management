import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ImageRun } from "docx";
import fs from "fs";
import path from "path";

export const createQuotationDocx = async (quotation) => {
  try {
    // ✅ FIXED: Multiple logo path attempts
    const logoPaths = [
      path.resolve("src/assets/logo.png"),
      path.resolve("backend/src/assets/logo.png"),
      path.resolve("assets/logo.png"),
      path.resolve("./logo.png"),
      path.resolve("../logo.png"),
    ];

    let logoBuffer = null;
    let logoPathUsed = "";

    for (const logoPath of logoPaths) {
      try {
        if (fs.existsSync(logoPath)) {
          logoBuffer = fs.readFileSync(logoPath);
          logoPathUsed = logoPath;
          console.log("✅ Logo found at:", logoPath);
          break;
        }
      } catch (e) {
        console.log("Logo not found at:", logoPath);
      }
    }

    if (!logoBuffer) {
      console.warn("⚠️ Logo not found, creating without logo");
    }

    // Rest of your DOCX code...
    const detailsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph("Quotation No: " + quotation.quotationNo)] 
            }),
            new TableCell({ 
              children: [new Paragraph("Date: " + new Date(quotation.date).toLocaleDateString("en-IN"))] 
            }),
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
            new TableCell({ children: [new Paragraph(quotation.description || "N/A")] }),
            new TableCell({ children: [new Paragraph(parseInt(quotation.value || 0).toLocaleString("en-IN"))] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Total")], columnSpan: 1 }),
            new TableCell({ children: [new Paragraph(parseInt(quotation.value || 0).toLocaleString("en-IN"))] }),
          ],
        }),
      ],
    });

   const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        // ✅ Replace this part
        ...(logoBuffer ? [
          new Paragraph({
            children: [
              new ImageRun({
                data: logoBuffer,
                transformation: { width: 150, height: 50 },
              }),
            ],
          })
        ] : []),

        new Paragraph({ text: "\n\n" }),
        new Paragraph({
          text: "QUOTATION",
          bold: true,
          size: 36,
        }),
        new Paragraph({ text: "\n" }),

        detailsTable,
        new Paragraph({ text: "\n" }),
        itemsTable,
        new Paragraph({ text: "\n\nThank you for your business!", italics: true }),
      ],
    },
  ],
});


    const buffer = await Packer.toBuffer(doc);
    console.log("✅ DOCX generated successfully, size:", buffer.length, "bytes");
    return buffer;
  } catch (error) {
    console.error("❌ DOCX creation failed:", error);
    throw new Error(`DOCX generation failed: ${error.message}`);
  }
};
