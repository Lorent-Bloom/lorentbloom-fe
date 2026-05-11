import { useTranslations } from "next-intl";

export function PrivacyPolicyPage() {
  const t = useTranslations("privacy-policy");

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t("lastUpdated")}</p>

      <div className="space-y-8">
        {/* 1. Introduction and Operator */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("introduction.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("introduction.content")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("introduction.controller")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("introduction.scope")}
          </p>
          <p className="text-muted-foreground leading-relaxed font-medium">
            {t("introduction.agreement")}
          </p>
        </section>

        {/* 2. Regulatory Framework */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("regulatoryFramework.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("regulatoryFramework.content")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-3">
            <li>{t("regulatoryFramework.list.item1")}</li>
            <li>{t("regulatoryFramework.list.item2")}</li>
            <li>{t("regulatoryFramework.list.item3")}</li>
            <li>{t("regulatoryFramework.list.item4")}</li>
            <li>{t("regulatoryFramework.list.item5")}</li>
            <li>{t("regulatoryFramework.list.item6")}</li>
            <li>{t("regulatoryFramework.list.item7")}</li>
            <li>{t("regulatoryFramework.list.item8")}</li>
            <li>{t("regulatoryFramework.list.item9")}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            {t("regulatoryFramework.commitment")}
          </p>
        </section>

        {/* 3. Data We Collect */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("dataCollected.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("dataCollected.intro")}
          </p>

          {/* 3.1 Direct */}
          <h3 className="text-xl font-semibold mb-3">
            {t("dataCollected.directData.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("dataCollected.directData.content")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
            <li>{t("dataCollected.directData.list.item1")}</li>
            <li>{t("dataCollected.directData.list.item2")}</li>
            <li>{t("dataCollected.directData.list.item3")}</li>
            <li>{t("dataCollected.directData.list.item4")}</li>
            <li>{t("dataCollected.directData.list.item5")}</li>
            <li>{t("dataCollected.directData.list.item6")}</li>
            <li>{t("dataCollected.directData.list.item7")}</li>
            <li>{t("dataCollected.directData.list.item8")}</li>
            <li>{t("dataCollected.directData.list.item9")}</li>
          </ul>

          {/* 3.2 Automatic */}
          <h3 className="text-xl font-semibold mb-3">
            {t("dataCollected.automaticData.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("dataCollected.automaticData.content")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
            <li>{t("dataCollected.automaticData.list.item1")}</li>
            <li>{t("dataCollected.automaticData.list.item2")}</li>
            <li>{t("dataCollected.automaticData.list.item3")}</li>
            <li>{t("dataCollected.automaticData.list.item4")}</li>
            <li>{t("dataCollected.automaticData.list.item5")}</li>
          </ul>

          {/* 3.3 Third party */}
          <h3 className="text-xl font-semibold mb-3">
            {t("dataCollected.thirdPartyData.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("dataCollected.thirdPartyData.content")}
          </p>

          {/* 3.4 Sensitive */}
          <h3 className="text-xl font-semibold mb-3">
            {t("dataCollected.sensitiveData.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {t("dataCollected.sensitiveData.content")}
          </p>
        </section>

        {/* 4. Purposes */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("purposes.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("purposes.content")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-3">
            <li>{t("purposes.list.item1")}</li>
            <li>{t("purposes.list.item2")}</li>
            <li>{t("purposes.list.item3")}</li>
            <li>{t("purposes.list.item4")}</li>
            <li>{t("purposes.list.item5")}</li>
            <li>{t("purposes.list.item6")}</li>
            <li>{t("purposes.list.item7")}</li>
            <li>{t("purposes.list.item8")}</li>
            <li>{t("purposes.list.item9")}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            {t("purposes.noProfiling")}
          </p>
        </section>

        {/* 5. Legal Bases */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("legalBases.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("legalBases.content")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
            <li>{t("legalBases.list.item1")}</li>
            <li>{t("legalBases.list.item2")}</li>
            <li>{t("legalBases.list.item3")}</li>
            <li>{t("legalBases.list.item4")}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed font-medium">
            {t("legalBases.idnpBasis")}
          </p>
        </section>

        {/* 6. Retention */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("retention.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("retention.intro")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>{t("retention.list.item1")}</li>
            <li>{t("retention.list.item2")}</li>
            <li>{t("retention.list.item3")}</li>
            <li>{t("retention.list.item4")}</li>
            <li>{t("retention.list.item5")}</li>
            <li>{t("retention.list.item6")}</li>
            <li>{t("retention.list.item7")}</li>
          </ul>
        </section>

        {/* 7. Recipients */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("recipients.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("recipients.intro")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
            <li>{t("recipients.list.item1")}</li>
            <li>{t("recipients.list.item2")}</li>
            <li>{t("recipients.list.item3")}</li>
            <li>{t("recipients.list.item4")}</li>
            <li>{t("recipients.list.item5")}</li>
            <li>{t("recipients.list.item6")}</li>
            <li>{t("recipients.list.item7")}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("recipients.safeguards")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("recipients.publicData")}
          </p>
        </section>

        {/* 8. International Transfers */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("internationalTransfers.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("internationalTransfers.content")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("internationalTransfers.safeguards")}
          </p>
        </section>

        {/* 9. Your Rights */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("yourRights.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("yourRights.intro")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>{t("yourRights.list.item1")}</li>
            <li>{t("yourRights.list.item2")}</li>
            <li>{t("yourRights.list.item3")}</li>
            <li>{t("yourRights.list.item4")}</li>
            <li>{t("yourRights.list.item5")}</li>
            <li>{t("yourRights.list.item6")}</li>
            <li>{t("yourRights.list.item7")}</li>
            <li>{t("yourRights.list.item8")}</li>
          </ul>
        </section>

        {/* 10. Exercise Rights */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("exerciseRights.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("exerciseRights.content")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("exerciseRights.timing")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("exerciseRights.fees")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("exerciseRights.complaint")}
          </p>
        </section>

        {/* 11. Security */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("security.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("security.intro")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("security.technical")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("security.organizational")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("security.disclaimer")}
          </p>
          <p className="text-muted-foreground leading-relaxed font-medium">
            {t("security.breachNotification")}
          </p>
        </section>

        {/* 12. Marketing */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("marketing.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("marketing.transactional")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("marketing.promotional")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("marketing.status")}
          </p>
        </section>

        {/* 13. Cookies */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("cookies.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("cookies.content")}
          </p>
        </section>

        {/* 14. Children */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("children.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("children.content")}
          </p>
        </section>

        {/* 15. Changes */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("changes.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("changes.content")}
          </p>
        </section>

        {/* 16. DPA */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("dpa.heading")}</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("dpa.content")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("dpa.address")}
          </p>
        </section>

        {/* 17. Contact */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("contact.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("contact.entity")}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("contact.content")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("contact.governingLanguage")}
          </p>
        </section>
      </div>
    </div>
  );
}
