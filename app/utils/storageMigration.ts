type ResumeStorageRecord = Record<string, unknown>;

export const LEGACY_STORAGE_KEYS = ["ohcv_data", "ohmycv_data", "resumemd_data"] as const;
export const CURRENT_STORAGE_KEY = "MARKDOWN_RESUME_data";

type StorageByKey = Partial<Record<typeof CURRENT_STORAGE_KEY | (typeof LEGACY_STORAGE_KEYS)[number], unknown>>;

const isStorageRecord = (value: unknown): value is ResumeStorageRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const getMergedStorage = (storageByKey: StorageByKey) => {
  const orderedKeys = [...LEGACY_STORAGE_KEYS, CURRENT_STORAGE_KEY] as const;
  const merged = orderedKeys.reduce<ResumeStorageRecord>((acc, key) => {
    const value = storageByKey[key];
    return isStorageRecord(value) ? { ...acc, ...value } : acc;
  }, {});

  const migrated = LEGACY_STORAGE_KEYS.some((key) => {
    const value = storageByKey[key];
    return isStorageRecord(value) && Object.keys(value).length > 0;
  });

  return { storage: merged, migrated };
};
