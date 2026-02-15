"use client";

import "driver.js/dist/driver.css";
import { useTourDriver } from "../lib/useTourDriver";

export function TourDriver({ locale }: { locale: string }) {
  useTourDriver(locale);
  return null;
}
