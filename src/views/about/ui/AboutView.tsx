import { useTranslations } from "next-intl";

export function AboutView() {
  const t = useTranslations("about");

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("ourStory.title")}</h2>
        <p className="text-lg leading-relaxed mb-4">
          {t("ourStory.paragraph1")}
        </p>
        <p className="text-lg leading-relaxed">{t("ourStory.paragraph2")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("mission.title")}</h2>
        <p className="text-lg leading-relaxed">{t("mission.description")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("values.title")}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              {t("values.quality.title")}
            </h3>
            <p className="leading-relaxed">{t("values.quality.description")}</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              {t("values.trust.title")}
            </h3>
            <p className="leading-relaxed">{t("values.trust.description")}</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              {t("values.innovation.title")}
            </h3>
            <p className="leading-relaxed">
              {t("values.innovation.description")}
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              {t("values.support.title")}
            </h3>
            <p className="leading-relaxed">{t("values.support.description")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
