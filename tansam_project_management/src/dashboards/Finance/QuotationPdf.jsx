// QuotationPdf.jsx - DYNAMIC + ULTRA COMPACT (best chance for 1 page)
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import tnlogo from "../../assets/tansam/tnlogo.png";
import tansamLogo from "../../assets/tansam/tansamoldlogo.png";
import siemens from "../../assets/tansam/siemens.png";
import tidco from "../../assets/tansam/tidcologo.png";
import watermark from "../../assets/tansam/watermark.png";

const BLUE = "#1F4E79";
const DARK_BLUE = "#163A5F";

const styles = StyleSheet.create({
  page: {
    paddingTop: 18,
    paddingBottom: 70,
    paddingHorizontal: 34,
    fontSize: 9.2,
    fontFamily: "Helvetica",
  },
sectionGap: {
  marginTop: 8,
},
totalBoxRow: {
  flexDirection: "row",
  borderLeftWidth: 1,
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderColor: "#000",
},

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  logo: {
    height: 50,               // very compact but still recognizable
  },

  titleCenter: {
    textAlign: "center",
    marginVertical: 4,
  },
  mainTitle:    { fontSize: 11.8, fontWeight: "bold" },
  subTitle:     { fontSize: 8.4, marginTop: 1 },
  quotationTitle: { fontSize: 11, fontWeight: "bold", marginTop: 2 },

  refDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
    fontSize: 10,
  },

  toBlock: {
    marginTop: 5,
    marginBottom: 8,
    lineHeight: 1.2,
  },
watermarkContainer: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
},

watermark: {
  width: 350,
  opacity: 1, // keep watermark subtle
},

toRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 5,
  marginBottom: 8,
},

toLeft: {
  width: "60%",
  lineHeight: 1.2,
},

toRight: {
  width: "38%",
  textAlign: "right",
  lineHeight: 1.2,
},

  subject: {
    marginVertical: 5,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 2,
  },

  introText: {
    marginBottom: 6,
    lineHeight: 1.22,
    fontSize: 12,
  },
tableBox: {
  borderWidth: 1,
  borderColor: "#000",
},
  
  // Compact Table Styles
tableHeader: {
  flexDirection: "row",
  backgroundColor: "#D9E2F3",
  borderBottomWidth: 1,
  borderColor: "#000",
},

th: {
  paddingVertical: 4,
  paddingHorizontal: 4,
  fontSize: 10,
  fontWeight: "bold",
  textAlign: "center",
  borderRightWidth: 1,
  borderColor: "#000",
},

row: {
  flexDirection: "row",
},

cell: {
  paddingVertical: 4,
  paddingHorizontal: 4,
  fontSize: 10,
  lineHeight: 1.2,
  borderRightWidth: 1,
  borderColor: "#000",
},
lastCell: {
  borderRightWidth: 0,
},
colSNo: { width: "6%", textAlign: "center" },
colDesc: { width: "53%", textAlign: "left" },
colQty: { width: "11.5%", textAlign: "center" },
colUnit: { width: "13.5%", textAlign: "right" },
colTotal: { width: "16%", textAlign: "right" },

  descCell: {
    paddingVertical: 3.2,
    paddingHorizontal: 5,
    fontSize: 10,            // small but readable
    lineHeight: 1.12,         // very tight → crucial for long descriptions
  },

  totalRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#F8F8F8",
    marginTop: 1,
  },
  totalLabel: { width: "84%", padding: 4, fontWeight: "bold", textAlign: "right", fontSize: 9 },
  totalValue: { width: "16%", padding: 4, fontWeight: "bold", textAlign: "right", fontSize: 9 },

  termsTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 9,
    marginBottom: 4,
  },

  termItem: {
    flexDirection: "row",
    marginBottom: 2.5,
    lineHeight: 1.18,
    fontSize: 10,
  },
  termLabel: { width: 85 },

  signatureBlock: {
    marginTop: 14,
  },

  signRow: {
    flexDirection: "row",
    gap: 25,
    marginVertical: 6,
  },

footerContainer: {
  position: "absolute",
  bottom: 0,
  left: 34,
  right: 34,
  fontSize: 8.4,
},

footer: {
  backgroundColor: BLUE,
  color: "#fff",
  flexDirection: "row",
  paddingVertical: 4,
  fontSize: 8.4,
},

footerCell: {
  flex: 1,
  textAlign: "center",
  paddingHorizontal: 3,
  borderRightWidth: 1,
  borderRightColor: "rgba(255,255,255,0.4)",
},

footerAddress: {
  flex: 2,
  textAlign: "center",
  paddingHorizontal: 3,
},

gstBar: {
  backgroundColor: DARK_BLUE,
  color: "#fff",
  fontSize: 7.8,
  textAlign: "center",
  paddingVertical: 3,
},


});

export default function QuotationPDF({
  refNo,
  date,
  clientName,
  kindAttn,
  subject,
  items = [],
  totalAmount,
  financeManagerName,
  designation = "Manager - Operations",
  signatureUrl,
  sealUrl,
  termsContent,
}) {
  const calculatedTotalAmount = items.reduce((sum, item) => {
  const qty = Number(item.qty || 0);
  const unit = Number(item.unitPrice || 0);
  const tax = Number(item.tax || 0);

  const base = qty * unit;
  const taxAmount = base * (tax / 100);

  return sum + base + taxAmount;
}, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Very small logos */}
        <View style={styles.header}>
          <Image src={tnlogo} style={styles.logo} />
          <Image src={tansamLogo} style={styles.logo} />
          <Image src={siemens} style={styles.logo} />
          <Image src={tidco} style={styles.logo} />
        </View>
<View style={styles.watermarkContainer}>
  <Image src={watermark} style={styles.watermark} />
</View>

        {/* Title */}
        <View style={styles.titleCenter}>
          <Text style={styles.mainTitle}>
            Tamil Nadu Smart and Advanced Manufacturing Centre
          </Text>
          <Text style={styles.subTitle}>
            (A Government of Tamil Nadu Enterprise wholly owned by TIDCO)
          </Text>
          <Text style={styles.quotationTitle}>Quotation</Text>
        </View>
<View style={styles.sectionGap} />
        {/* Ref & Date */}
        <View style={styles.refDateRow}>
          <Text>REF: {refNo || "TANSAM/XXXX/2025-26"}</Text>
          <Text>DATE: {date || "DD-MM-YYYY"}</Text>
        </View>
<View style={styles.sectionGap} />
        {/* To + Kind Attn */}
<View style={styles.refDateRow}>
  <Text>To, {clientName || "INSTITUTE NAME"}</Text>
  <Text>Kind Attn.: {kindAttn || "NAME, DESIGNATION"}</Text>
</View>

<View style={styles.sectionGap} />
        {/* Subject */}
        <Text style={styles.subject}>
          Sub: 
          {subject}
        </Text>

      <View style={styles.sectionGap} />
<View style={styles.tableBox}>

  {/* HEADER */}
  <View style={styles.tableHeader}>
    <Text style={[styles.th, styles.colSNo]}>S. No</Text>
    <Text style={[styles.th, styles.colDesc]}>Product description</Text>
    <Text style={[styles.th, styles.colQty]}>Qty</Text>
    <Text style={[styles.th, styles.colUnit]}>Unit price</Text>
    <Text style={[styles.th, styles.colUnit]}>Tax</Text>
    <Text style={[styles.th, styles.colTotal, styles.lastCell]}>Total</Text>
  </View>

  {/* BODY */}
  {items.map((item, i) => (
    <View key={i} style={styles.row}>
      <Text style={[styles.cell, styles.colSNo]}>{i + 1}</Text>
      <Text style={[styles.cell, styles.colDesc]}>{item.description}</Text>
      <Text style={[styles.cell, styles.colQty]}>{item.qty}</Text>
      <Text style={[styles.cell, styles.colUnit]}>{item.unitPrice}</Text>
       <Text style={[styles.cell, styles.colUnit]}>{item.tax }</Text>
 <Text style={[styles.cell, styles.colTotal, styles.lastCell]}>
  {(() => {
    const qty = Number(item.qty || 0);
    const unit = Number(item.unitPrice || 0);
    const tax = Number(item.tax || 0);

    const base = qty * unit;
    const taxAmount = base * (tax / 100);

    return (base + taxAmount).toFixed(2);
  })()}
</Text>

    </View>
  ))}

  {/* TOTAL */}
{/* TOTAL */}
{/* TOTAL */}
<View style={[styles.row, styles.totalBoxRow]}>
  <Text
    style={[
      styles.cell,
      {
        width: "84%",
        textAlign: "right",
        fontWeight: "bold",
        borderTopWidth: 0,   // important
      },
    ]}
  >
    Total Service Value{"\n"}with Tax
  </Text>

  <Text
    style={[
      styles.cell,
      styles.lastCell,
      {
        width: "16%",
        textAlign: "right",
        fontWeight: "bold",
        borderTopWidth: 0,   // important
      },
    ]}
  >
    ₹ {calculatedTotalAmount.toFixed(2)}
  </Text>
</View>



</View>

{termsContent && (
  <View style={{ marginTop: 10 }}>
    <Text style={styles.termsTitle}>Terms & Conditions</Text>
    <Text style={styles.subject}>
      {termsContent}
    </Text>
  </View>
)}


        {/* Very tight Terms */}
        

        {/* Compact Signature */}
        <View style={styles.signatureBlock}>
          <Text>Yours truly,</Text>

          <View style={styles.signRow}>
            {signatureUrl && <Image src={signatureUrl} style={{ height: 40 }} />}
            {sealUrl && <Image src={sealUrl} style={{ height: 40 }} />}
          </View>

          <Text style={{ fontWeight: "bold", marginTop: 3 }}>
            {financeManagerName || ""}
          </Text>
          <Text>{designation}</Text>
        </View>

        {/* Footer */}
<View style={styles.footerContainer} fixed>
  <View style={styles.footer}>
    <Text style={styles.footerCell}>Tel: +91 44 69255700</Text>
    <Text style={styles.footerCell}>E-Mail: info@tansam.org</Text>
    <Text style={styles.footerCell}>URL: www.tansam.org</Text>
    <Text style={styles.footerAddress}>
      C-Wing North, 603, TIDEL Park, Rajiv Gandhi Salai, Taramani, Chennai-600113
    </Text>
  </View>
  <View style={styles.gstBar}>
    <Text>GSTIN:- 33AAJCT2401Q1Z7 | CIN : U91990TN2022NPL150529</Text>
  </View>
</View>

      </Page>
    </Document>
  );
}