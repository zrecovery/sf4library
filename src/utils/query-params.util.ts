interface QueryParams {
  page?: number;
  size?: number;
  keywords?: string;
  love?: boolean;
}
export const objectToQueryParams = (obj: QueryParams): string => {
  const queryParams = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value !== "" && value !== undefined && value !== false) {
      queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }
  return queryParams.join("&");
};
