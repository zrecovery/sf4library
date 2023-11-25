interface QueryParams {
  page?: number;
  size?: number;
  keywords?: string;
  love?: boolean;
}
export const objectToQueryParams = (obj: QueryParams): string => {
  const res = Object.entries(obj).filter(
    ([key, value]) => value !== "" && value !== undefined && value !== false,
  );
  return res
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
};
