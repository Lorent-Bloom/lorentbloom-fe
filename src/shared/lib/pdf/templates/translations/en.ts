import type { ContractTranslations } from "./ro";

export const enTranslations: ContractTranslations = {
  title: "MOVABLE PROPERTY LEASE CONTRACT",
  contractNumber: "No.",
  date: "dated",

  sections: {
    parties: {
      title: "1. CONTRACTING PARTIES",
      owner: "LESSOR (Owner)",
      renter: "LESSEE (Tenant)",
      name: "Name",
      idnp: "Personal ID",
      address: "Address",
      phone: "Phone",
      email: "Email",
    },
    subject: {
      title: "2. SUBJECT OF THE CONTRACT",
      productName: "Product name",
      productSku: "Identification code",
      description: "Description",
    },
    duration: {
      title: "3. CONTRACT TERM",
      from: "From",
      to: "Until",
      totalDays: "Total number of days",
    },
    price: {
      title: "4. PRICE AND PAYMENT METHOD",
      totalPrice: "Total rent",
      paymentMethod: "Payment method",
    },
    ownerObligations: {
      title: "5. LESSOR'S OBLIGATIONS",
      items: [
        "To transfer the property to the Lessee in a condition suitable for use according to its purpose.",
        "To hand over all documents and accessories necessary for using the property.",
        "To ensure the normal functioning of the property during the contract period.",
        "Not to interfere with the peaceful use of the property by the Lessee.",
      ],
    },
    renterObligations: {
      title: "6. LESSEE'S OBLIGATIONS",
      items: [
        "To use the property according to the purpose established in the contract.",
        "To pay the rent within the established terms and conditions.",
        "To preserve the integrity of the property and return it in the same condition.",
        "Not to sublease the property without the written consent of the Lessor.",
        "To bear the costs of current maintenance of the property.",
        "To immediately inform the Lessor about any damage or malfunction of the property.",
      ],
    },
    liability: {
      title: "7. LIABILITY OF THE PARTIES",
      content:
        "The parties are liable for non-performance or improper performance of their obligations under this contract and in accordance with the legislation of the Republic of Moldova. In case of damage or loss of the property due to the fault of the Lessee, they are obliged to compensate the Lessor in an amount equal to the value of the property.",
    },
    forceMajeure: {
      title: "8. FORCE MAJEURE",
      content:
        "The parties are exempt from liability for total or partial non-performance of contractual obligations if such non-performance occurred as a result of a force majeure event (fire, flood, earthquake, wars, acts of governing and administrative bodies of the Republic of Moldova).",
    },
    disputes: {
      title: "9. DISPUTE RESOLUTION",
      content:
        "Any dispute arising from or in connection with this contract shall be settled amicably. If the parties fail to reach an agreement, the dispute shall be submitted for resolution to the competent courts of the Republic of Moldova.",
    },
    electronicSignature: {
      title: "10. ELECTRONIC SIGNATURE CLAUSE",
      content:
        "The parties agree that electronic signatures applied to this contract (including drawn, typed, or digitally uploaded signatures) have the same legal value as handwritten signatures, in accordance with Art. 1252 of the Civil Code and Law No. 124/2022 on electronic identification and trust services.",
    },
    finalProvisions: {
      title: "11. FINAL PROVISIONS",
      items: [
        "Any modification or addition to this Contract is valid only if made in writing and signed by both parties.",
        "This Contract is drawn up in electronic format, one copy for each Party, with the same legal value.",
        "The Contract enters into force on the date of signing by both parties.",
      ],
    },
    signatures: {
      title: "12. SIGNATURES",
      owner: "LESSOR",
      renter: "LESSEE",
      signatureLabel: "Signature",
      dateLabel: "Date",
    },
  },
};
