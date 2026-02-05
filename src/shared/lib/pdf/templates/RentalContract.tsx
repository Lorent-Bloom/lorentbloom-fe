import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import {
  getContractTranslations,
  type ContractTranslations,
} from "./translations";

// Register local Noto Sans font for full Unicode support (Cyrillic, Romanian diacritics)
// Font files are stored in public/fonts/
Font.register({
  family: "NotoSans",
  fonts: [
    {
      src: process.cwd() + "/public/fonts/NotoSans-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: process.cwd() + "/public/fonts/NotoSans-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "NotoSans",
    lineHeight: 1.4,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  contractInfo: {
    fontSize: 11,
    marginBottom: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 4,
  },
  subsectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: "35%",
    fontWeight: "bold",
  },
  value: {
    width: "65%",
  },
  partiesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  partyBox: {
    width: "48%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  partyTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  listItem: {
    marginBottom: 4,
    paddingLeft: 10,
  },
  bulletPoint: {
    position: "absolute",
    left: 0,
  },
  paragraph: {
    textAlign: "justify",
    marginBottom: 8,
  },
  signaturesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    gap: 40,
  },
  signatureBox: {
    width: "45%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 4,
    minHeight: 120,
  },
  signatureTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  signatureImage: {
    width: 150,
    height: 60,
    marginVertical: 10,
    alignSelf: "center",
  },
  signatureDate: {
    fontSize: 9,
    marginTop: 10,
    textAlign: "center",
  },
  signaturePlaceholder: {
    width: "100%",
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    borderStyle: "dashed",
    marginVertical: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
  },
});

export interface ContractParty {
  name: string;
  idnp?: string;
  address: string;
  phone: string;
  email: string;
}

export interface ContractProduct {
  name: string;
  sku: string;
  description?: string;
}

export interface ContractDates {
  from: string;
  to: string;
  totalDays: number;
}

export interface ContractPrice {
  total: string;
  currency: string;
  paymentMethod: string;
}

export interface ContractSignature {
  image: string; // base64
  date: string;
}

export interface RentalContractData {
  contractNumber: string;
  contractDate: string;
  owner: ContractParty;
  renter: ContractParty;
  product: ContractProduct;
  dates: ContractDates;
  price: ContractPrice;
  ownerSignature?: ContractSignature;
  renterSignature?: ContractSignature;
  locale?: string;
}

interface PartyInfoProps {
  party: ContractParty;
  title: string;
  t: ContractTranslations;
}

function PartyInfo({ party, title, t }: PartyInfoProps) {
  return (
    <View style={styles.partyBox}>
      <Text style={styles.partyTitle}>{title}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>{t.sections.parties.name}:</Text>
        <Text style={styles.value}>{party.name}</Text>
      </View>
      {party.idnp && (
        <View style={styles.row}>
          <Text style={styles.label}>{t.sections.parties.idnp}:</Text>
          <Text style={styles.value}>{party.idnp}</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.label}>{t.sections.parties.address}:</Text>
        <Text style={styles.value}>{party.address}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t.sections.parties.phone}:</Text>
        <Text style={styles.value}>{party.phone}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t.sections.parties.email}:</Text>
        <Text style={styles.value}>{party.email}</Text>
      </View>
    </View>
  );
}

interface ListSectionProps {
  items: string[];
}

function ListSection({ items }: ListSectionProps) {
  return (
    <View>
      {items.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.bulletPoint}>{"\u2022"}</Text>
          <Text style={styles.listItem}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

interface SignatureBoxProps {
  title: string;
  signature?: ContractSignature;
  t: ContractTranslations;
}

function SignatureBox({ title, signature, t }: SignatureBoxProps) {
  return (
    <View style={styles.signatureBox}>
      <Text style={styles.signatureTitle}>{title}</Text>
      <Text style={{ fontSize: 9 }}>
        {t.sections.signatures.signatureLabel}:
      </Text>
      {signature?.image ? (
        // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image doesn't support alt prop
        <Image style={styles.signatureImage} src={signature.image} />
      ) : (
        <View style={styles.signaturePlaceholder} />
      )}
      <Text style={styles.signatureDate}>
        {t.sections.signatures.dateLabel}:{" "}
        {signature?.date || "________________"}
      </Text>
    </View>
  );
}

export function RentalContract({ data }: { data: RentalContractData }) {
  const t = getContractTranslations(data.locale || "ro");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.contractInfo}>
            {t.contractNumber} {data.contractNumber} {t.date}{" "}
            {data.contractDate}
          </Text>
        </View>

        {/* 1. Parties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.sections.parties.title}</Text>
          <View style={styles.partiesContainer}>
            <PartyInfo
              party={data.owner}
              title={t.sections.parties.owner}
              t={t}
            />
            <PartyInfo
              party={data.renter}
              title={t.sections.parties.renter}
              t={t}
            />
          </View>
        </View>

        {/* 2. Subject */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.sections.subject.title}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{t.sections.subject.productName}:</Text>
            <Text style={styles.value}>{data.product.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t.sections.subject.productSku}:</Text>
            <Text style={styles.value}>{data.product.sku}</Text>
          </View>
          {data.product.description && (
            <View style={styles.row}>
              <Text style={styles.label}>
                {t.sections.subject.description}:
              </Text>
              <Text style={styles.value}>{data.product.description}</Text>
            </View>
          )}
        </View>

        {/* 3. Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.sections.duration.title}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{t.sections.duration.from}:</Text>
            <Text style={styles.value}>{data.dates.from}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t.sections.duration.to}:</Text>
            <Text style={styles.value}>{data.dates.to}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t.sections.duration.totalDays}:</Text>
            <Text style={styles.value}>{data.dates.totalDays}</Text>
          </View>
        </View>

        {/* 4. Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.sections.price.title}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{t.sections.price.totalPrice}:</Text>
            <Text style={styles.value}>
              {data.price.total} {data.price.currency}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t.sections.price.paymentMethod}:</Text>
            <Text style={styles.value}>{data.price.paymentMethod}</Text>
          </View>
        </View>

        {/* 5. Owner Obligations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t.sections.ownerObligations.title}
          </Text>
          <ListSection items={t.sections.ownerObligations.items} />
        </View>

        {/* 6. Renter Obligations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t.sections.renterObligations.title}
          </Text>
          <ListSection items={t.sections.renterObligations.items} />
        </View>

        {/* 7. Liability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.sections.liability.title}</Text>
          <Text style={styles.paragraph}>{t.sections.liability.content}</Text>
        </View>

        {/* 8. Force Majeure */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t.sections.forceMajeure.title}
          </Text>
          <Text style={styles.paragraph}>
            {t.sections.forceMajeure.content}
          </Text>
        </View>

        {/* 9. Disputes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.sections.disputes.title}</Text>
          <Text style={styles.paragraph}>{t.sections.disputes.content}</Text>
        </View>

        {/* 10. Electronic Signature Clause */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t.sections.electronicSignature.title}
          </Text>
          <Text style={styles.paragraph}>
            {t.sections.electronicSignature.content}
          </Text>
        </View>

        {/* 11. Final Provisions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t.sections.finalProvisions.title}
          </Text>
          <ListSection items={t.sections.finalProvisions.items} />
        </View>

        {/* 12. Signatures */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.sections.signatures.title}</Text>
          <View style={styles.signaturesContainer}>
            <SignatureBox
              title={t.sections.signatures.owner}
              signature={data.ownerSignature}
              t={t}
            />
            <SignatureBox
              title={t.sections.signatures.renter}
              signature={data.renterSignature}
              t={t}
            />
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generated by Minimum Platform - {new Date().toISOString()}
        </Text>
      </Page>
    </Document>
  );
}

export default RentalContract;
