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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  logo: {
    height: 30,               // very compact but still recognizable
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
    fontSize: 9,
  },

  toBlock: {
    marginTop: 5,
    marginBottom: 8,
    lineHeight: 1.2,
  },
watermark: {
  position: "absolute",
  top: "35%",
  left: "15%",
  width: 350,
  opacity: 0.8,
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
    fontStyle: "italic",
    fontSize: 9.5,
  },

  introText: {
    marginBottom: 6,
    lineHeight: 1.22,
    fontSize: 9,
  },

    
  // Compact Table Styles
tableHeader: {
  flexDirection: "row",
  borderWidth: 1,
  borderColor: "#000",
  backgroundColor: "#E8F0FA",
},

th: {
  paddingVertical: 2.5,
  paddingHorizontal: 3,
  fontWeight: "bold",
  fontSize: 8,
  textAlign: "center",
  borderWidth: 1,
  borderColor: "#000",
},



colSNo: { width: "6%", textAlign: "center" },
colDesc: { width: "53%", textAlign: "left" },
colQty: { width: "11.5%", textAlign: "center" },
colUnit: { width: "13.5%", textAlign: "right" },
colTotal: { width: "16%", textAlign: "right" },

  descCell: {
    paddingVertical: 3.2,
    paddingHorizontal: 5,
    fontSize: 8.3,            // small but readable
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
    fontSize: 8.8,
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

  footer: {
    position: "absolute",
    bottom: 24,
    left: 34,
    right: 34,
    backgroundColor: BLUE,
    color: "#fff",
    flexDirection: "row",
    fontSize: 8.4,
    paddingVertical: 4,
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
    position: "absolute",
    bottom: 6,
    left: 34,
    right: 34,
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
}) {
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
<Image src={watermark} style={styles.watermark} />

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

        {/* Ref & Date */}
        <View style={styles.refDateRow}>
          <Text>REF: {refNo || "TANSAM/XXXX/2025-26"}</Text>
          <Text>DATE: {date || "DD-MM-YYYY"}</Text>
        </View>

        {/* To + Kind Attn */}
<View style={styles.toBlock}>
  <Text>To, {clientName || "INSTITUTE NAME"}</Text>
  <Text style={{alignItems: "center"}}>
  
    kind attn.: {kindAttn || "NAME, DESIGNATION"}
  </Text>
</View>

        {/* Subject */}
        <Text style={styles.subject}>
          Sub: {subject}
        </Text>

      
<View style={styles.tableHeader}>
  <Text style={[styles.th, styles.colSNo]}>S. No</Text>
  <Text style={[styles.th, styles.colDesc]}>Product description</Text>
  <Text style={[styles.th, styles.colQty]}>Qty</Text>
  <Text style={[styles.th, styles.colUnit]}>Unit price</Text>
  <Text style={[styles.th, styles.colTotal]}>Total</Text>
</View>

{/* Table Rows */}
{items.length > 0 ? items.map((item, i) => (
  <View key={i} style={{ flexDirection: "row" }}>
    <Text style={[styles.td, styles.colSNo]}>{i + 1}</Text>
    <Text style={[styles.td, styles.colDesc]}>{item.description}</Text>
    <Text style={[styles.td, styles.colQty]}>{item.qty }</Text>
    <Text style={[styles.td, styles.colUnit]}>{item.unitPrice }</Text>
    <Text style={[styles.td, styles.colTotal]}>{item.total }</Text>
  </View>
)) : (
  <View style={{ flexDirection: "row" }}>
    <Text style={[styles.td, styles.colSNo]}>1</Text>
    <Text style={[styles.td, styles.colDesc]}>—</Text>
    <Text style={[styles.td, styles.colQty]}>—</Text>
    <Text style={[styles.td, styles.colUnit]}>—</Text>
    <Text style={[styles.td, styles.colTotal]}>—</Text>
  </View>
)}

{/* Total Row */}
<View style={[styles.totalRow, { marginTop: 0 }]}>
  <Text style={[styles.totalLabel, { width: "84%", padding: 3 }]}>
    Total Service Value with Tax
  </Text>
  <Text style={[styles.totalValue, { width: "16%", padding: 3 }]}>
    {totalAmount ? `₹ ${totalAmount}` : "—"}
  </Text>
</View>


        {/* Very tight Terms */}
        <View style={{ marginTop: 10 }}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>

          <View style={styles.termItem}>
            <Text style={styles.termLabel}>Validity :</Text>
            <Text>10/15 days from date of issue</Text>
          </View>

          <View style={styles.termItem}>
            <Text style={styles.termLabel}>Payment :</Text>
            <Text>100% advance</Text>
          </View>

          <View style={styles.termItem}>
            <Text style={styles.termLabel}>Delivery :</Text>
            <Text>As per P.O date</Text>
          </View>

          <View style={styles.termItem}>
            <Text style={styles.termLabel}>P.O :</Text>
            <Text>Within 5 days</Text>
          </View>
        </View>

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
        <View style={styles.footer}>
          <Text style={styles.footerCell}>Tel: +91 44 69255700</Text>
          <Text style={styles.footerCell}>E-Mail: info@tansam.org</Text>
          <Text style={styles.footerCell}>URL: www.tansam.org</Text>
          <Text style={styles.footerAddress}>
            C-Wing North, 603, TIDEL Park, Rajiv Gandhi Salai, Taramani, Chennai-600113
          </Text>
        </View>

        <View style={styles.gstBar}>
          GSTIN:- 33AAJCT2401Q1Z7 | CIN : U91990TN2022NPL150529
        </View>
      </Page>
    </Document>
  );
}