import { useTranslations } from "next-intl";

export function TermsOfPolicyPage() {
  const t = useTranslations("terms-of-policy");

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t("lastUpdated")}</p>

      <div className="space-y-8">
        {/* 1. Introduction */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("introduction.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("introduction.content")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("introduction.description")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("introduction.agreement")}
          </p>
        </section>

        {/* 2. Acceptance of Terms */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("acceptanceOfTerms.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("acceptanceOfTerms.content")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
            <li>{t("acceptanceOfTerms.list.item1")}</li>
            <li>{t("acceptanceOfTerms.list.item2")}</li>
            <li>{t("acceptanceOfTerms.list.item3")}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed font-medium">
            {t("acceptanceOfTerms.warning")}
          </p>
        </section>

        {/* 3. Lorent Bloom Status and Disclaimer */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("lorentbloomStatus.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("lorentbloomStatus.point1")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("lorentbloomStatus.point2")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-2">
            {t("lorentbloomStatus.point3")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>{t("lorentbloomStatus.list.item1")}</li>
            <li>{t("lorentbloomStatus.list.item2")}</li>
            <li>{t("lorentbloomStatus.list.item3")}</li>
          </ul>
        </section>

        {/* 4. User Account */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("userAccount.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("userAccount.point1")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-2">
            {t("userAccount.point2")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-3">
            <li>{t("userAccount.list.item1")}</li>
            <li>{t("userAccount.list.item2")}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("userAccount.point3")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("userAccount.point4")}
          </p>
        </section>

        {/* 5. User Obligations */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("userObligations.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("userObligations.content")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>{t("userObligations.list.item1")}</li>
            <li>{t("userObligations.list.item2")}</li>
            <li>{t("userObligations.list.item3")}</li>
            <li>{t("userObligations.list.item4")}</li>
            <li>{t("userObligations.list.item5")}</li>
          </ul>
        </section>

        {/* 6. Rental Risks */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("rentalRisks.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            {t("rentalRisks.point1")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-2">
            <li>{t("rentalRisks.riskList.item1")}</li>
            <li>{t("rentalRisks.riskList.item2")}</li>
            <li>{t("rentalRisks.riskList.item3")}</li>
            <li>{t("rentalRisks.riskList.item4")}</li>
            <li>{t("rentalRisks.riskList.item5")}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("rentalRisks.riskConclusion")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-2">
            {t("rentalRisks.point2")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-3">
            <li>{t("rentalRisks.liabilityList.item1")}</li>
            <li>{t("rentalRisks.liabilityList.item2")}</li>
            <li>{t("rentalRisks.liabilityList.item3")}</li>
            <li>{t("rentalRisks.liabilityList.item4")}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            {t("rentalRisks.point3")}
          </p>
        </section>

        {/* 7. Payments */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("payments.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("payments.point1")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("payments.point2")}
          </p>
        </section>

        {/* 8. Prohibited Activities */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("prohibitedActivities.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("prohibitedActivities.content")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>{t("prohibitedActivities.list.item1")}</li>
            <li>{t("prohibitedActivities.list.item2")}</li>
            <li>{t("prohibitedActivities.list.item3")}</li>
            <li>{t("prohibitedActivities.list.item4")}</li>
            <li>{t("prohibitedActivities.list.item5")}</li>
            <li>{t("prohibitedActivities.list.item6")}</li>
          </ul>
        </section>

        {/* 9. Intellectual Property */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("intellectualProperty.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("intellectualProperty.content")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4 font-medium">
            {t("intellectualProperty.warning")}
          </p>

          {/* 9.1. User Content */}
          <h3 className="text-xl font-semibold mb-3">
            {t("intellectualProperty.userContent.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("intellectualProperty.userContent.content")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("intellectualProperty.userContent.disclaimer")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("intellectualProperty.userContent.confirmation")}
          </p>
        </section>

        {/* 10. Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("limitation.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("limitation.content")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-3">
            <li>{t("limitation.list.item1")}</li>
            <li>{t("limitation.list.item2")}</li>
            <li>{t("limitation.list.item3")}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-4 font-medium">
            {t("limitation.warning")}
          </p>

          {/* 10.1. Disclaimer */}
          <h3 className="text-xl font-semibold mb-3">
            {t("limitation.disclaimer.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("limitation.disclaimer.content")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("limitation.disclaimer.noGuarantee")}
          </p>
        </section>

        {/* 11. Access Termination */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("termination.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("termination.content")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
            <li>{t("termination.list.item1")}</li>
            <li>{t("termination.list.item2")}</li>
            <li>{t("termination.list.item3")}</li>
          </ul>

          {/* 11.1. Indemnity */}
          <h3 className="text-xl font-semibold mb-3">
            {t("termination.indemnity.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("termination.indemnity.content")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>{t("termination.indemnity.list.item1")}</li>
            <li>{t("termination.indemnity.list.item2")}</li>
            <li>{t("termination.indemnity.list.item3")}</li>
          </ul>
        </section>

        {/* 12. Dispute Resolution */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("disputeResolution.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("disputeResolution.point1")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("disputeResolution.point2")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("disputeResolution.point3")}
          </p>

          {/* 12.4. Force Majeure */}
          <h3 className="text-xl font-semibold mb-3">
            {t("disputeResolution.forceMajeure.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {t("disputeResolution.forceMajeure.content")}
          </p>
        </section>

        {/* 13. Privacy Policy */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("privacyPolicy.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("privacyPolicy.intro")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-2">
            {t("privacyPolicy.purposes.content")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
            <li>{t("privacyPolicy.purposes.list.item1")}</li>
            <li>{t("privacyPolicy.purposes.list.item2")}</li>
            <li>{t("privacyPolicy.purposes.list.item3")}</li>
            <li>{t("privacyPolicy.purposes.list.item4")}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("privacyPolicy.thirdParty")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-2">
            {t("privacyPolicy.dataTypes.content")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
            <li>{t("privacyPolicy.dataTypes.list.item1")}</li>
            <li>{t("privacyPolicy.dataTypes.list.item2")}</li>
            <li>{t("privacyPolicy.dataTypes.list.item3")}</li>
            <li>{t("privacyPolicy.dataTypes.list.item4")}</li>
            <li>{t("privacyPolicy.dataTypes.list.item5")}</li>
            <li>{t("privacyPolicy.dataTypes.list.item6")}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("privacyPolicy.consent")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("privacyPolicy.moreInfo")}
          </p>
        </section>

        {/* 14. Changes to Terms */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("changes.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("changes.content")}
          </p>
        </section>

        {/* 15. Contact Information */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("contact.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("contact.content")}
          </p>
        </section>
      </div>
    </div>
  );
}
