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

let recaptchaLoadPromise: Promise<void> | null = null;

function loadRecaptchaScript(): Promise<void> {
  if (recaptchaLoadPromise) return recaptchaLoadPromise;

  recaptchaLoadPromise = new Promise<void>((resolve, reject) => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => resolve());
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.onload = () => {
      window.grecaptcha.ready(() => resolve());
    };
    script.onerror = () => {
      recaptchaLoadPromise = null;
      reject(new Error("Failed to load reCAPTCHA script"));
    };
    document.head.appendChild(script);
  });

  return recaptchaLoadPromise;
}

export const useRecaptcha = () => {
  const executeRecaptcha = useCallback(
    async (action: string): Promise<string> => {
      await loadRecaptchaScript();
      return new Promise((resolve, reject) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action })
            .then(resolve)
            .catch(reject);
        });
      });
    },
    [],
  );

  return { executeRecaptcha };
};
