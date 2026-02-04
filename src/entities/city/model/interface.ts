export interface City {
  value: string;
  label: string;
}

export interface GetCitiesResponse {
  cities: City[];
}
