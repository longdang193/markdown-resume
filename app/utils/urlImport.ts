export type TextFetcher = (url: string) => Promise<string>;

export type UrlImportResult =
  | { ok: true; content: string }
  | { ok: false; error: unknown };

export const importFileFromUrl = async (
  url: string,
  fetcher: TextFetcher
): Promise<UrlImportResult> => {
  try {
    return { ok: true, content: await fetcher(url) };
  } catch (error) {
    return { ok: false, error };
  }
};
