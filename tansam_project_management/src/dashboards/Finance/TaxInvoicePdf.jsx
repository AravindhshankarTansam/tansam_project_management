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
    marginBottom: 8,
  },
  logo: { height: 40 },

  title: { textAlign: "center", marginBottom: 8 },
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
    marginTop: 10,
    backgroundColor: "#f1f5f9",
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

  /* ===== BOTTOM SECTION ===== */

  bottomRow: {
    flexDirection: "row",
    marginTop: 10,
  },

  leftColumn: {
    width: "50%",
    paddingRight: 10,
  },

  rightColumn: {
    width: "50%",
    borderWidth: 1,
    borderColor: "#000",
  },

  totalLine: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  totalLabel: {
    flex: 1,
    padding: 5,
  },
  totalValue: {
    width: "40%",
    padding: 5,
    textAlign: "right",
  },

  wordsBlock: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 6,
    marginBottom: 6,
  },

  bankBlock: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 6,
  },

  footer: {
    position: "absolute",
    bottom: 26,
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
    signatureRow: {
    flexDirection: "row",
    marginTop: 14,
  },

  signatureSpacer: {
    width: "50%",
  },

  signatureBox: {
    width: "50%",
    borderWidth: 1,
    borderColor: "#000",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  signatureText: {
    fontSize: 9,
    fontWeight: "bold",
  },

});

export default function TaxInvoicePdf({
  invoiceNo,
  invoiceDate,
  terms,
  duration,
  registeredOffice,
  billTo,
  shipTo,
  items,
  serviceValue,
  sgst,
  cgst,
  totalWithGst,
  amountInWords,
  bankNameAddress,
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

        {/* TOP INFO */}
        <View style={styles.boxRow}>
          <View style={styles.boxCell}>
            <Text>Invoice No : {invoiceNo}</Text>
            <Text>Invoice Date : {invoiceDate}</Text>
            <Text>Terms : {terms}</Text>
            <Text>Duration : {duration}</Text>
          </View>
          <View style={styles.boxCell}>
            <Text>Registered office address :</Text>
            <Text>{registeredOffice}</Text>
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
            <Text>Place of Service/Supply : Tamil Nadu (33)</Text>
          </View>
        </View>

        {/* TABLE */}
        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.colSl]}>Sl. No</Text>
          <Text style={[styles.th, styles.colDesc]}>DESCRIPTION</Text>
          <Text style={[styles.th, styles.colSAC]}>SAC/HSN Code</Text>
          <Text style={[styles.th, styles.colAMC]}>AMC</Text>
          <Text style={[styles.th, styles.colUnit]}>
            Unit Price / Development cost
          </Text>
          <Text style={[styles.th, styles.colAmt]}>Amount</Text>
        </View>

        {items.map((item, i) => (
          <View key={i} style={{ flexDirection: "row", borderWidth: 1 }}>
            <Text style={[styles.td, styles.colSl]}>{i + 1}</Text>
            <Text style={[styles.td, styles.colDesc]}>{item.description}</Text>
            <Text style={[styles.td, styles.colSAC]}>{item.sac}</Text>
            <Text style={[styles.td, styles.colAMC]}>{item.amc}</Text>
            <Text style={[styles.td, styles.colUnit]}>{item.unit}</Text>
            <Text style={[styles.td, styles.colAmt]}>{item.amount}</Text>
          </View>
        ))}

        {/* ===== BOTTOM SECTION ===== */}
        <View style={styles.bottomRow}>
          {/* LEFT: WORDS + BANK */}
          <View style={styles.leftColumn}>
            <View style={styles.wordsBlock}>
              <Text>Total in Words: {amountInWords}</Text>
            </View>

            <View style={styles.bankBlock}>
              <Text>Bank Name & address:-</Text>
              <Text>{bankNameAddress}</Text>
              <Text>Bank A/c No.: {bankAccount}</Text>
              <Text>IFSC Code: {ifsc}</Text>
            </View>
          </View>

          {/* RIGHT: TOTALS */}
          <View style={styles.rightColumn}>
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>Total Service Value</Text>
              <Text style={styles.totalValue}>₹ {serviceValue}</Text>
            </View>
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>SGST @ 9%</Text>
              <Text style={styles.totalValue}>₹ {sgst}</Text>
            </View>
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>CGST @ 9%</Text>
              <Text style={styles.totalValue}>₹ {cgst}</Text>
            </View>
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>
                Total Service Value with GST
              </Text>
              <Text style={styles.totalValue}>₹ {totalWithGst}</Text>
            </View>
          </View>
        </View>
                {/* AUTHORIZED SIGNATURE */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureSpacer} />
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>
              Authorized Signature
            </Text>
          </View>
        </View>


        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerCell}>Tel: +91 44 69255700</Text>
          <Text style={styles.footerCell}>E-Mail: info@tansam.org</Text>
          <Text style={styles.footerCell}>URL: www.tansam.org</Text>
        </View>

        <View style={styles.gstBar}>
          GSTIN: 33AAJCT2401Q1Z7 | CIN: U91990TN2022NPL150529
        </View>
      </Page>
    </Document>
  );
}
