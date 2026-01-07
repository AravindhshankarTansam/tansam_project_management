import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ImageRun } from "docx";
import fs from "fs";
import path from "path";

export const createQuotationDocx = async (quotation) => {
  try {
    // ✅ Attempt multiple logo paths
    const logoPaths = [
      path.resolve("src/assets/logo.png"),
      path.resolve("backend/src/assets/logo.png"),
      path.resolve("assets/logo.png"),
      path.resolve("./logo.png"),
      path.resolve("../logo.png"),
    ];

    let logoBuffer = null;

    for (const logoPath of logoPaths) {
      if (fs.existsSync(logoPath)) {
        logoBuffer = fs.readFileSync(logoPath);
        console.log("✅ Logo found at:", logoPath);
        break;
      }
    }

    if (!logoBuffer) console.warn("⚠️ Logo not found, creating DOCX without logo");

    // ----- Client / Quotation Details Table -----
    const detailsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "Quotation No: " + quotation.quotationNo, bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: "Date: " + new Date(quotation.date).toLocaleDateString("en-IN") })] }),
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

    // ----- Items Table (Description + Value) -----
    const itemsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        // Header row
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "Description", bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: "Quote Value (₹)", bold: true })] }),
          ],
        }),
        // Item row
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(quotation.description || "N/A")] }),
            new TableCell({ children: [new Paragraph(parseInt(quotation.value || 0).toLocaleString("en-IN"))] }),
          ],
        }),
        // Total row
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "Total", bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: parseInt(quotation.value || 0).toLocaleString("en-IN"), bold: true })] }),
          ],
        }),
      ],
    });

    // ----- Final Document -----
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Logo
            ...(logoBuffer
              ? [
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: logoBuffer,
                        transformation: { width: 150, height: 50 },
                      }),
                    ],
                  }),
                ]
              : []),

            new Paragraph({ text: "\n\n" }),

            // Quotation Header
            new Paragraph({
              text: "QUOTATION",
              bold: true,
              size: 36,
              spacing: { after: 200 },
            }),

            // Details Table
            detailsTable,
            new Paragraph({ text: "\n" }),

            // Items Table
            itemsTable,
            new Paragraph({ text: "\n" }),

            // Closing Note
            new Paragraph({
              children: [
                new TextRun({
                  text: "Thank you for your business!",
                  italics: true,
                }),
              ],
            }),
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
