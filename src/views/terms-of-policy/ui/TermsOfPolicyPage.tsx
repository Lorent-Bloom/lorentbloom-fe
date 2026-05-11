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
          <p className="text-muted-foreground leading-relaxed mb-3 font-medium">
            {t("introduction.intermediary")}
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
          <p className="text-muted-foreground leading-relaxed font-medium mb-4">
            {t("acceptanceOfTerms.warning")}
          </p>

          {/* 2.1. Age and Legal Capacity */}
          <h3 className="text-xl font-semibold mb-3">
            {t("acceptanceOfTerms.ageAndCapacity.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {t("acceptanceOfTerms.ageAndCapacity.content")}
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
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
            <li>{t("lorentbloomStatus.list.item1")}</li>
            <li>{t("lorentbloomStatus.list.item2")}</li>
            <li>{t("lorentbloomStatus.list.item3")}</li>
          </ul>

          {/* 3.4. Trust and Safety Tools */}
          <h3 className="text-xl font-semibold mb-3">
            {t("lorentbloomStatus.trustTools.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("lorentbloomStatus.trustTools.content")}
          </p>

          {/* 3.5. Identity Verification */}
          <h3 className="text-xl font-semibold mb-3">
            {t("lorentbloomStatus.identityVerification.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("lorentbloomStatus.identityVerification.content")}
          </p>

          {/* 3.6. Rental Agreement Facilitation */}
          <h3 className="text-xl font-semibold mb-3">
            {t("lorentbloomStatus.rentalAgreement.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("lorentbloomStatus.rentalAgreement.content")}
          </p>

          {/* 3.7. Chat and Photographic Documentation */}
          <h3 className="text-xl font-semibold mb-3">
            {t("lorentbloomStatus.chatAndPhotos.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("lorentbloomStatus.chatAndPhotos.content")}
          </p>

          {/* 3.8. Administrative Review of Listings */}
          <h3 className="text-xl font-semibold mb-3">
            {t("lorentbloomStatus.listingReview.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {t("lorentbloomStatus.listingReview.content")}
          </p>
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
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("userAccount.point4")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("userAccount.point5")}
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
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("payments.point2")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("payments.point3")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("payments.point4")}
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
            <li>{t("prohibitedActivities.list.item7")}</li>
            <li>{t("prohibitedActivities.list.item8")}</li>
            <li>{t("prohibitedActivities.list.item9")}</li>
            <li>{t("prohibitedActivities.list.item10")}</li>
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
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("intellectualProperty.userContent.confirmation")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("intellectualProperty.userContent.license")}
          </p>

          {/* 9.2. Notice and Takedown */}
          <h3 className="text-xl font-semibold mb-3">
            {t("intellectualProperty.noticeAndTakedown.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("intellectualProperty.noticeAndTakedown.content")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("intellectualProperty.noticeAndTakedown.process")}
          </p>

          {/* 9.3. Reporting Violations */}
          <h3 className="text-xl font-semibold mb-3">
            {t("intellectualProperty.reportingViolations.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("intellectualProperty.reportingViolations.content")}
          </p>

          {/* 9.4. Nature of Listings */}
          <h3 className="text-xl font-semibold mb-3">
            {t("intellectualProperty.natureOfListings.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("intellectualProperty.natureOfListings.content")}
          </p>

          {/* 9.5. Reviews and Ratings */}
          <h3 className="text-xl font-semibold mb-3">
            {t("intellectualProperty.reviews.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {t("intellectualProperty.reviews.content")}
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
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("limitation.disclaimer.noGuarantee")}
          </p>

          {/* 10.2. Application of Mandatory Law */}
          <h3 className="text-xl font-semibold mb-3">
            {t("limitation.mandatoryLaw.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {t("limitation.mandatoryLaw.content")}
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
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
            <li>{t("termination.indemnity.list.item1")}</li>
            <li>{t("termination.indemnity.list.item2")}</li>
            <li>{t("termination.indemnity.list.item3")}</li>
          </ul>

          {/* 11.2. Suspension Pending Investigation */}
          <h3 className="text-xl font-semibold mb-3">
            {t("termination.suspension.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("termination.suspension.content")}
          </p>

          {/* 11.3. Survival */}
          <h3 className="text-xl font-semibold mb-3">
            {t("termination.survival.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {t("termination.survival.content")}
          </p>
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

          {/* 12.4. Individual Disputes */}
          <h3 className="text-xl font-semibold mb-3">
            {t("disputeResolution.classAction.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("disputeResolution.classAction.content")}
          </p>

          {/* 12.5. Force Majeure */}
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

          {/* 13.1. Legal Bases */}
          <h3 className="text-xl font-semibold mb-3">
            {t("privacyPolicy.legalBases.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("privacyPolicy.legalBases.content")}
          </p>

          {/* 13.2. Data Subject Rights */}
          <h3 className="text-xl font-semibold mb-3">
            {t("privacyPolicy.dataSubjectRights.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("privacyPolicy.dataSubjectRights.content")}
          </p>

          {/* 13.3. Retention */}
          <h3 className="text-xl font-semibold mb-3">
            {t("privacyPolicy.retention.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("privacyPolicy.retention.content")}
          </p>

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

        {/* 15. Consumer Rights */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("consumerRights.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("consumerRights.content")}
          </p>

          {/* 15.1. Withdrawal */}
          <h3 className="text-xl font-semibold mb-3">
            {t("consumerRights.withdrawal.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {t("consumerRights.withdrawal.content")}
          </p>
        </section>

        {/* 16. General Provisions */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t("generalProvisions.heading")}
          </h2>

          {/* 16.1. Severability */}
          <h3 className="text-xl font-semibold mb-3">
            {t("generalProvisions.severability.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("generalProvisions.severability.content")}
          </p>

          {/* 16.2. Entire Agreement */}
          <h3 className="text-xl font-semibold mb-3">
            {t("generalProvisions.entireAgreement.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("generalProvisions.entireAgreement.content")}
          </p>

          {/* 16.3. No Waiver */}
          <h3 className="text-xl font-semibold mb-3">
            {t("generalProvisions.noWaiver.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("generalProvisions.noWaiver.content")}
          </p>

          {/* 16.4. Assignment */}
          <h3 className="text-xl font-semibold mb-3">
            {t("generalProvisions.assignment.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("generalProvisions.assignment.content")}
          </p>

          {/* 16.5. Governing Language */}
          <h3 className="text-xl font-semibold mb-3">
            {t("generalProvisions.governingLanguage.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("generalProvisions.governingLanguage.content")}
          </p>

          {/* 16.6. Electronic Communications */}
          <h3 className="text-xl font-semibold mb-3">
            {t("generalProvisions.electronicCommunications.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("generalProvisions.electronicCommunications.content")}
          </p>

          {/* 16.7. Governing Law */}
          <h3 className="text-xl font-semibold mb-3">
            {t("generalProvisions.governingLaw.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("generalProvisions.governingLaw.content")}
          </p>

          {/* 16.8. No Agency */}
          <h3 className="text-xl font-semibold mb-3">
            {t("generalProvisions.noAgency.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("generalProvisions.noAgency.content")}
          </p>

          {/* 16.9. No Third-Party Beneficiaries */}
          <h3 className="text-xl font-semibold mb-3">
            {t("generalProvisions.noThirdPartyBeneficiaries.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {t("generalProvisions.noThirdPartyBeneficiaries.content")}
          </p>
        </section>

        {/* 17. Contact Information */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("contact.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("contact.entity")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("contact.content")}
          </p>
        </section>
      </div>
    </div>
  );
}
