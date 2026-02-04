export interface HeaderSearchProps {
  locale: string;
}

export interface SearchResult {
  uid: string;
  name: string;
  url_key: string;
  small_image?: {
    url: string;
  };
  price_range?: {
    minimum_price: {
      final_price: {
        value: number;
        currency: string;
      };
    };
  };
}
