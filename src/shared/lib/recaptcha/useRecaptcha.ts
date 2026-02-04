"use client";

import { useCallback } from "react";
import { env } from "@shared/config/env";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

export const useRecaptcha = () => {
  const executeRecaptcha = useCallback((action: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error("reCAPTCHA not loaded"));
        return;
      }
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action })
          .then(resolve)
          .catch(reject);
      });
    });
  }, []);

  return { executeRecaptcha };
};
