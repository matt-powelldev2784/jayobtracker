export type Return<T> = { success: true; data: T } | { success: false; error: string };
