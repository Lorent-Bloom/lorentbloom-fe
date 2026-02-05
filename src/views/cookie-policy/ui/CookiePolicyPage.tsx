import { useTranslations } from "next-intl";

export function CookiePolicyPage() {
  const t = useTranslations("cookie-policy");

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-sm text-muted-foreground mb-4">{t("lastUpdated")}</p>
      <p className="text-muted-foreground leading-relaxed mb-8">{t("intro")}</p>

      <div className="space-y-8">
        {/* Section 1: What are cookies */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("whatAreCookies.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("whatAreCookies.content")}
          </p>
        </section>

        {/* Section 2: Cookie types */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("cookieTypes.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t("cookieTypes.intro")}
          </p>

          {/* 2.1 Required cookies */}
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2">
              {t("cookieTypes.required.heading")}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              {t("cookieTypes.required.content")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>{t("cookieTypes.required.list.item1")}</li>
              <li>{t("cookieTypes.required.list.item2")}</li>
              <li>{t("cookieTypes.required.list.item3")}</li>
              <li>{t("cookieTypes.required.list.item4")}</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              {t("cookieTypes.required.note")}
            </p>
          </div>

          {/* 2.2 Functional cookies */}
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2">
              {t("cookieTypes.functional.heading")}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("cookieTypes.functional.content")}
            </p>
          </div>

          {/* 2.3 Analytics cookies */}
          <div>
            <h3 className="text-xl font-medium mb-2">
              {t("cookieTypes.analytics.heading")}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              {t("cookieTypes.analytics.content")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>{t("cookieTypes.analytics.list.item1")}</li>
              <li>{t("cookieTypes.analytics.list.item2")}</li>
              <li>{t("cookieTypes.analytics.list.item3")}</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              {t("cookieTypes.analytics.note")}
            </p>
          </div>
        </section>

        {/* Section 3: Third-party cookies */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("thirdPartyCookies.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("thirdPartyCookies.content")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("thirdPartyCookies.disclaimer")}
          </p>
        </section>

        {/* Section 4: Managing cookies */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("managingCookies.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {t("managingCookies.content")}
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>{t("managingCookies.list.item1")}</li>
            <li>{t("managingCookies.list.item2")}</li>
            <li>{t("managingCookies.list.item3")}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            {t("managingCookies.note")}
          </p>
        </section>

        {/* Section 5: Consent */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("consent.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("consent.content")}
          </p>
        </section>

        {/* Section 6: Changes */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {t("changes.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("changes.content")}
          </p>
        </section>

        {/* Section 7: Contact */}
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
