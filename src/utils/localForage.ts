import LOCAL_FORAGE_KEY from "../constants/localForageKey";

export function getLocalForageItem(key: LOCAL_FORAGE_KEY): string | undefined {
  try {
    return localStorage.getItem(key) ?? undefined;
  } catch (e) {
    return undefined;
  }
}

export function setLocalForageItem(
  key: LOCAL_FORAGE_KEY,
  value: string | undefined
): void {
  if (value) {
    localStorage.setItem(key, value);
  }
}

export function removeLocalForageItem(key: LOCAL_FORAGE_KEY) {
  return localStorage.removeItem(key);
}
