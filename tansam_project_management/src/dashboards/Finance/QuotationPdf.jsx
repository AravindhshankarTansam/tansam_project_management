import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from "@react-pdf/renderer";

import tnlogo from "../../assets/tansam/tnlogo.png";
import tansamoldlogo from "../../assets/tansam/tansamoldlogo.png";
import siemens from "../../assets/tansam/siemens.png";
import tidco from "../../assets/tansam/tidcologo.png";

const BLUE = "#1F4E79";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 80,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica"
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15
  },
  logo: { height: 45, objectFit: "contain" },

  /* TITLE */
  titleWrap: { textAlign: "center", marginBottom: 15 },
  titleMain: { fontSize: 14, fontWeight: "bold" },
  titleSub: { fontSize: 10, marginTop: 3 },
  quotation: { fontSize: 12, fontWeight: "bold", marginTop: 6 },

  /* META */
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },

  /* TABLE */
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#C7D4EA",
    border: "1px solid #000"
  },
  tableRow: {
    flexDirection: "row",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000"
  },

  th: { padding: 6, fontWeight: "bold", textAlign: "center" },
  td: { padding: 6 },

  colSno: { width: "6%", textAlign: "center" },
  colDesc: { width: "50%" },
  colQty: { width: "12%", textAlign: "center" },
  colUnit: { width: "14%", textAlign: "right" },
  colTotal: { width: "18%", textAlign: "right" },

  /* TERMS */
  terms: { marginTop: 18 },
  termRow: { flexDirection: "row", marginBottom: 3 },
  termLeft: { width: 90 },
  termColon: { width: 10 },
  termRight: { flex: 1 },

  /* SIGNATURE */
  signWrap: { marginTop: 25 },
  signRow: { flexDirection: "row", gap: 20, marginTop: 10 },
  signImg: { height: 50 },

  /* FOOTER */
  footer: {
    position: "absolute",
    bottom: 25,
    left: 40,
    right: 40,
    backgroundColor: BLUE,
    color: "#fff",
    flexDirection: "row",
    fontSize: 9
  },
  footerCell: {
    flex: 1,
    padding: 6,
    borderRight: "1px solid #ffffff55",
    textAlign: "center"
  },
  footerAddress: { flex: 2, padding: 6, textAlign: "center" },

  gst: {
    position: "absolute",
    bottom: 5,
    left: 40,
    right: 40,
    backgroundColor: "#163A5F",
    color: "#fff",
    fontSize: 8,
    textAlign: "center",
    padding: 4
  }
});

export default function QuotationPDF({
  quotation,
  refNo,
  date,
  signatureUrl,
  sealUrl
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}
        <View style={styles.header}>
          <Image src={tnlogo} style={styles.logo} />
          <Image src={tansamoldlogo} style={styles.logo} />
          <Image src={siemens} style={styles.logo} />
          <Image src={tidco} style={styles.logo} />
        </View>

        {/* TITLE */}
        <View style={styles.titleWrap}>
          <Text style={styles.titleMain}>
            Tamil Nadu Smart and Advanced Manufacturing Centre
          </Text>
          <Text style={styles.titleSub}>
            (A Government of Tamil Nadu Enterprise wholly owned by TIDCO)
          </Text>
          <Text style={styles.quotation}>Quotation</Text>
        </View>

        {/* META */}
        <View style={styles.metaRow}>
          <Text>REF: {refNo}</Text>
          <Text>DATE: {date}</Text>
        </View>

        {/* TABLE HEADER */}
        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.colSno]}>S.No</Text>
          <Text style={[styles.th, styles.colDesc]}>Product description</Text>
          <Text style={[styles.th, styles.colQty]}>Qty Per Students</Text>
          <Text style={[styles.th, styles.colUnit]}>Unit price +TAX</Text>
          <Text style={[styles.th, styles.colTotal]}>
            Total price in INR inclusive of TAX
          </Text>
        </View>

        {/* TABLE ROWS */}
        {quotation.items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.td, styles.colSno]}>{i + 1}</Text>
            <Text style={[styles.td, styles.colDesc]}>{item.description}</Text>
            <Text style={[styles.td, styles.colQty]}>{item.qty}</Text>
            <Text style={[styles.td, styles.colUnit]}>{item.unitPrice}</Text>
            <Text style={[styles.td, styles.colTotal]}>{item.total}</Text>
          </View>
        ))}

        {/* TERMS */}
        <View style={styles.terms}>
          <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
            Terms & Conditions
          </Text>
          {quotation.terms.map((t, i) => (
            <View key={i} style={styles.termRow}>
              <Text style={styles.termLeft}>{i + 1}. {t.title}</Text>
              <Text style={styles.termColon}>:</Text>
              <Text style={styles.termRight}>{t.value}</Text>
            </View>
          ))}
        </View>

        {/* SIGNATURE */}
        <View style={styles.signWrap}>
          <Text>Yours truly,</Text>
          <View style={styles.signRow}>
            {signatureUrl && <Image src={signatureUrl} style={styles.signImg} />}
            {sealUrl && <Image src={sealUrl} style={styles.signImg} />}
          </View>
          <Text style={{ marginTop: 6 }}>
            {quotation.financeManagerName}
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerCell}>Tel: +91 44 69255700</Text>
          <Text style={styles.footerCell}>E-Mail: info@tansam.org</Text>
          <Text style={styles.footerCell}>URL: www.tansam.org</Text>
          <Text style={styles.footerAddress}>
            C-Wing North, 603, TIDEL Park, Rajiv Gandhi Salai,
            Taramani, Chennai-600113
          </Text>
        </View>

        <View style={styles.gst}>
          GSTIN:- 33AAJCT2401Q1Z7 | CIN : U91990TN2022NPL150529
        </View>

      </Page>
    </Document>
  );
}
