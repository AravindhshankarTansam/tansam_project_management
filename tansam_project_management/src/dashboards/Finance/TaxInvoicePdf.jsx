// dashboards/Finance/TaxInvoicePdf.jsx
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
import tidco from "../../assets/tansam/tidcologo.png";

const styles = StyleSheet.create({
  page: {
    padding: 26,
    fontSize: 9.5,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  logo: { height: 40 },

  title: { textAlign: "center", marginBottom: 10 },
  titleMain: { fontSize: 12, fontWeight: "bold" },
  titleSub: { fontSize: 9 },
  invoiceTitle: { fontSize: 12, fontWeight: "bold", marginTop: 4 },

  boxRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
  },
  boxCell: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#000",
  },

  tableHeader: {
    flexDirection: "row",
    borderWidth: 1,
    backgroundColor: "#f1f5f9",
    marginTop: 10,
  },
  th: {
    padding: 5,
    fontWeight: "bold",
    borderRightWidth: 1,
    textAlign: "center",
  },
  td: {
    padding: 5,
    borderRightWidth: 1,
  },

  colSl: { width: "6%" },
  colDesc: { width: "44%" },
  colSAC: { width: "12%" },
  colAMC: { width: "10%" },
  colUnit: { width: "14%" },
  colAmt: { width: "14%" },

  totalsBox: {
    width: "50%",
    alignSelf: "flex-end",
    borderWidth: 1,
    marginTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  totalLabel: { flex: 1, padding: 5 },
  totalValue: { width: "40%", padding: 5, textAlign: "right" },

  footer: {
    position: "absolute",
    bottom: 24,
    left: 26,
    right: 26,
    backgroundColor: "#1F4E79",
    color: "#fff",
    flexDirection: "row",
    fontSize: 8,
    padding: 5,
  },
  footerCell: { flex: 1, textAlign: "center" },

  gstBar: {
    position: "absolute",
    bottom: 6,
    left: 26,
    right: 26,
    fontSize: 8,
    textAlign: "center",
  },
});

export default function TaxInvoicePdf({
  invoiceNo,
  invoiceDate,
  terms,
  duration,
  billTo,
  shipTo,
  items,
  serviceValue,
  sgst,
  cgst,
  totalWithGst,
  amountInWords,
  bankName,
  bankAccount,
  ifsc,
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image src={tnlogo} style={styles.logo} />
          <Image src={tansamLogo} style={styles.logo} />
          <Image src={tidco} style={styles.logo} />
        </View>

        {/* TITLE */}
        <View style={styles.title}>
          <Text style={styles.titleMain}>
            Tamil Nadu Smart and Advanced Manufacturing Centre
          </Text>
          <Text style={styles.titleSub}>
            (A Government of Tamil Nadu Enterprise wholly owned by TIDCO)
          </Text>
          <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
        </View>

        {/* INFO */}
        <View style={styles.boxRow}>
          <View style={styles.boxCell}>
            <Text>Invoice No: {invoiceNo}</Text>
            <Text>Date: {invoiceDate}</Text>
            <Text>Terms: {terms}</Text>
            <Text>Duration: {duration}</Text>
          </View>
          <View style={styles.boxCell}>
            <Text>Registered Office:</Text>
            <Text>19A Rukmini Lakshmipathy Road</Text>
            <Text>Egmore, Chennai – 600008</Text>
          </View>
        </View>

        {/* BILL / SHIP */}
        <View style={styles.boxRow}>
          <View style={styles.boxCell}>
            <Text style={{ fontWeight: "bold" }}>Bill To</Text>
            <Text>{billTo}</Text>
          </View>
          <View style={styles.boxCell}>
            <Text style={{ fontWeight: "bold" }}>Ship To</Text>
            <Text>{shipTo}</Text>
            <Text>Place of Supply: Tamil Nadu (33)</Text>
          </View>
        </View>

        {/* TABLE */}
        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.colSl]}>Sl</Text>
          <Text style={[styles.th, styles.colDesc]}>Description</Text>
          <Text style={[styles.th, styles.colSAC]}>SAC</Text>
          <Text style={[styles.th, styles.colAMC]}>AMC</Text>
          <Text style={[styles.th, styles.colUnit]}>Unit</Text>
          <Text style={[styles.th, styles.colAmt]}>Amount</Text>
        </View>

        {items.map((item, i) => (
          <View key={i} style={{ flexDirection: "row", borderWidth: 1 }}>
            <Text style={[styles.td, styles.colSl]}>{i + 1}</Text>
            <Text style={[styles.td, styles.colDesc]}>{item.description}</Text>
            <Text style={[styles.td, styles.colSAC]}>{item.sac}</Text>
            <Text style={[styles.td, styles.colAMC]}>{item.amc}</Text>
            <Text style={[styles.td, styles.colUnit]}>{item.unitPrice}</Text>
            <Text style={[styles.td, styles.colAmt]}>{item.amount}</Text>
          </View>
        ))}

        {/* TOTALS */}
        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{serviceValue}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>SGST @ 9%</Text>
            <Text style={styles.totalValue}>{sgst}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>CGST @ 9%</Text>
            <Text style={styles.totalValue}>{cgst}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>{totalWithGst}</Text>
          </View>
        </View>

        <Text style={{ marginTop: 6 }}>
          Amount in Words: {amountInWords}
        </Text>

        {/* BANK */}
        <Text style={{ marginTop: 6, fontWeight: "bold" }}>Bank Details</Text>
        <Text>{bankName}</Text>
        <Text>A/c No: {bankAccount}</Text>
        <Text>IFSC: {ifsc}</Text>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerCell}>Tel: +91 44 69255700</Text>
          <Text style={styles.footerCell}>info@tansam.org</Text>
          <Text style={styles.footerCell}>www.tansam.org</Text>
        </View>

        <View style={styles.gstBar}>
          GSTIN: 33AAJCT2401Q1Z7 | CIN: U91990TN2022NPL150529
        </View>
      </Page>
    </Document>
  );
}
