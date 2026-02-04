"use server";

import { getPublicClient } from "@shared/api";
import { GET_CITIES } from "../gql/query";
import type { City, GetCitiesResponse } from "../../model/interface";

export async function getCities(): Promise<{
  success: boolean;
  data?: City[];
  error?: string;
}> {
  try {
    const result = await getPublicClient().query<GetCitiesResponse>({
      query: GET_CITIES,
      fetchPolicy: "cache-first",
    });

    return { success: true, data: result.data?.cities ?? [] };
  } catch {
    return { success: false, error: "Failed to load cities" };
  }
}
