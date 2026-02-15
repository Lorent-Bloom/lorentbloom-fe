import messages from "../messages/ro.json"; // NOTE: path should match DEFAULT_LOCALE
import { routing } from "../lib/routing";

export type Messages = typeof messages;
export type Locale = (typeof routing.locales)[number];
