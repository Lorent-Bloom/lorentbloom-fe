import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  Home,
  Camera,
  FileText,
  Users,
  Shield,
} from "lucide-react";

type StepKey = "step1" | "step2" | "step3" | "step4" | "step5";

export function HowToRentOutView() {
  const t = useTranslations("how-to-rent-out");

  const steps: Array<{ icon: typeof Home; key: StepKey }> = [
    {
      icon: Home,
      key: "step1",
    },
    {
      icon: Camera,
      key: "step2",
    },
    {
      icon: FileText,
      key: "step3",
    },
    {
      icon: Users,
      key: "step4",
    },
    {
      icon: Shield,
      key: "step5",
    },
  ];

  const tips: Array<"tip1" | "tip2" | "tip3" | "tip4" | "tip5"> = [
    "tip1",
    "tip2",
    "tip3",
    "tip4",
    "tip5",
  ];

  const benefits: Array<"benefit1" | "benefit2" | "benefit3" | "benefit4"> = [
    "benefit1",
    "benefit2",
    "benefit3",
    "benefit4",
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Introduction */}
      <section className="mb-12">
        <p className="text-lg leading-relaxed">{t("introduction")}</p>
      </section>

      {/* Steps Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8">{t("steps.title")}</h2>
        <div className="space-y-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.key} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-3">
                    {t(`steps.${step.key}.title`)}
                  </h3>
                  <p className="text-lg leading-relaxed mb-3">
                    {t(`steps.${step.key}.description`)}
                  </p>
                  <ul className="space-y-2">
                    {([1, 2, 3] as const).map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>
                          {t(
                            `steps.${step.key}.items.item${item}` as `steps.${StepKey}.items.item${1 | 2 | 3}`,
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tips Section */}
      <section className="mb-12 bg-muted/50 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6">{t("tips.title")}</h2>
        <div className="space-y-4">
          {tips.map((tip) => (
            <div key={tip} className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-lg">{t(`tips.${tip}`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8">{t("benefits.title")}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit) => (
            <div key={benefit} className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">
                {t(`benefits.${benefit}.title`)}
              </h3>
              <p className="leading-relaxed">
                {t(`benefits.${benefit}.description`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-primary/5 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">{t("cta.title")}</h2>
        <p className="text-lg mb-6">{t("cta.description")}</p>
      </section>
    </div>
  );
}
