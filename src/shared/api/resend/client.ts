import { Resend } from "resend";
import { RESEND_API_KEY } from "./model/const";

export const resend = new Resend(RESEND_API_KEY);
