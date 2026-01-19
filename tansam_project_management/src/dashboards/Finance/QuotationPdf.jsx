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

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
logo: { height: 50, width: 80, objectFit: "contain" },
header: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginBottom: 20 },

  titleContainer: { textAlign: "center", marginBottom: 20 },
  titleMain: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#000"
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 6,
  },titleSub: { fontSize: 10, textAlign: "center", marginTop: 2 },
  colSNo: { width: "5%", padding: 4 },
  colDescription: { width: "60%", padding: 4 },
  colQty: { width: "10%", padding: 4, textAlign: "center" },
  colUnit: { width: "12%", padding: 4, textAlign: "right" },
  colTotal: { width: "13%", padding: 4, textAlign: "right" },
  meta: { marginBottom: 20 },
  terms: { marginTop: 20 },
  signature: { marginTop: 40 },
});

export default function QuotationPDF({ quotation, refNo, date, signatureUrl, sealUrl }) {
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
        <View style={styles.titleContainer}>
          <Text style={styles.titleMain}>Tamil Nadu Smart and Advanced Manufacturing Centre</Text>
          <Text>(A Government of Tamil Nadu Enterprise wholly owned by TIDCO)</Text>
          <Text style={{ marginTop: 5, fontSize: 12, fontWeight: "bold" }}>Quotation</Text>
        </View>

        {/* META */}
        <View style={styles.meta}>
          <Text>Ref: {refNo}</Text>
          <Text>Date: {date}</Text>
        </View>

        {/* TABLE HEADER */}
        <View style={styles.tableHeader}>
          <Text style={styles.colSNo}>S.No</Text>
          <Text style={styles.colDescription}>Product Description</Text>
          <Text style={styles.colQty}>Qty Per Students</Text>
          <Text style={styles.colUnit}>Unit Price + TAX</Text>
          <Text style={styles.colTotal}>Total Price INR Inclusive of TAX</Text>
        </View>

        {/* TABLE ROWS */}
        {quotation.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.colSNo}>{index + 1}</Text>
            <Text style={styles.colDescription}>{item.description}</Text>
            <Text style={styles.colQty}>{item.qty}</Text>
            <Text style={styles.colUnit}>{item.unitPrice}</Text>
            <Text style={styles.colTotal}>{item.total}</Text>
          </View>
        ))}

        {/* TERMS & CONDITIONS */}
        <View style={styles.terms}>
          <Text>Terms & Conditions</Text>
          {quotation.terms.map((term, i) => (
            <Text key={i}>{i + 1}. {term}</Text>
          ))}
        </View>

        {/* SIGNATURE */}
        <View style={styles.signature}>
          <Text>Yours Truly,</Text>
          {signatureUrl && <Image src={signatureUrl} style={{ height: 60, marginTop: 10 }} />}
          {sealUrl && <Image src={sealUrl} style={{ height: 60, marginTop: 10 }} />}
          <Text>{quotation.financeManagerName}</Text>
        </View>
      </Page>
    </Document>
  );
}
