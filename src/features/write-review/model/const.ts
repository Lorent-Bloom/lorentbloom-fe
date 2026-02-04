import type { TWriteReviewFormSchema } from "./schema";

export const WRITE_REVIEW_FORM_DEFAULT_VALUES: TWriteReviewFormSchema = {
  nickname: "",
  summary: "",
  text: "",
  overallRating: 0,
  ratings: {},
};
