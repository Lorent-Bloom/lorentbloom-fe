import fs from "fs";
import path from "path";
import { glob } from "glob";
import deepmerge from "deepmerge";
import { LOCALES, DEFAULT_LOCALE } from "@shared/config/i18n";

interface Messages {
  [key: string]: string | Messages;
}

const FSD_ROOTS = ["widgets", "features", "shared/ui", "entities", "views"].map(
  (p) => path.resolve(process.cwd(), "src", p),
);
const OUTPUT_PATH = path.resolve(
  process.cwd(),
  "src/shared/config/i18n/messages",
);

const getLocaleFiles = (locale: string) => {
  const files: string[] = [];
  for (const root of FSD_ROOTS) {
    files.push(...glob.sync(`${root}/**/i18n/${locale}.json`));
  }
  return files;
};

const readJsonFile = (filePath: string): Messages => {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

// Build nested object based on path relative to FSD root
const wrapWithSliceHierarchy = (filePath: string): Messages => {
  const fsdRoot = FSD_ROOTS.find((root) => {
    const rel = path.relative(root, filePath);
    return !rel.startsWith("..") && !path.isAbsolute(rel);
  });

  // skip if not in FSD root
  if (!fsdRoot) return {};

  const relativePath = path.relative(fsdRoot, filePath);
  const parts = relativePath.split(path.sep);

  // all folders before 'i18n' become hierarchy
  const i18nIndex = parts.indexOf("i18n");
  if (i18nIndex <= 0) return {};

  const sliceHierarchy = parts.slice(0, i18nIndex);
  const messages = readJsonFile(filePath);

  return sliceHierarchy.reduceRight((acc, key) => ({ [key]: acc }), messages);
};

const fillMissingAndDetectExtraKeys = (
  defaultObj: Messages,
  compareObj: Messages,
  locale: string,
  parentKey = "",
): Messages => {
  const result: Messages = {};

  for (const key of Object.keys(defaultObj)) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    const defaultVal = defaultObj[key];
    const compareVal = compareObj[key];

    if (compareVal === undefined) {
      if (typeof defaultVal === "object" && defaultVal !== null) {
        const recurse = (obj: Messages, pKey: string) => {
          for (const k of Object.keys(obj)) {
            const fk = `${pKey}.${k}`;
            if (typeof obj[k] === "object" && obj[k] !== null)
              recurse(obj[k], fk);
            else console.warn(`❌ [${locale}] Missing key "${fk}"`);
          }
        };
        recurse(defaultVal, fullKey);
      } else console.warn(`❌ [${locale}] Missing key "${fullKey}"`);
      result[key] = defaultVal;
    } else if (
      typeof defaultVal === "object" &&
      defaultVal !== null &&
      typeof compareVal === "object" &&
      compareVal !== null
    ) {
      result[key] = fillMissingAndDetectExtraKeys(
        defaultVal,
        compareVal,
        locale,
        fullKey,
      );
    } else {
      result[key] = compareVal;
    }
  }

  for (const key of Object.keys(compareObj)) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    if (!(key in defaultObj)) {
      console.warn(`❓ [${locale}] Extra key "${fullKey}"`);
      result[key] = compareObj[key];
    }
  }

  return result;
};

const generateMessages = () => {
  if (!fs.existsSync(OUTPUT_PATH))
    fs.mkdirSync(OUTPUT_PATH, { recursive: true });

  let defaultMessages: Messages = {};
  const localeMessagesMap: Record<string, Messages> = {};

  LOCALES.forEach((locale) => {
    const files = getLocaleFiles(locale);
    let merged: Messages = {};

    files.forEach((file) => {
      const wrapped = wrapWithSliceHierarchy(file);
      merged = deepmerge(merged, wrapped);
    });

    localeMessagesMap[locale] = merged;

    if (locale === DEFAULT_LOCALE) defaultMessages = merged;
  });

  LOCALES.forEach((locale) => {
    const finalMessages =
      locale === DEFAULT_LOCALE
        ? defaultMessages
        : fillMissingAndDetectExtraKeys(
            defaultMessages,
            localeMessagesMap[locale],
            locale,
          );

    const outputFile = path.join(OUTPUT_PATH, `${locale}.json`);
    fs.writeFileSync(
      outputFile,
      JSON.stringify(finalMessages, null, 2),
      "utf-8",
    );
    console.log(`✅ Generated locale.json for "${locale}"`);
  });

  console.log("✅ All messages generated successfully!");
};

generateMessages();
