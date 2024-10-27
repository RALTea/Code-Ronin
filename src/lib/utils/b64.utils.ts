export const base64ToCode = (base64Code: string) => {
	return atob(base64Code);
}

export const codeToBase64 = (code: string) => {
	return btoa(code);
}

export const unicodeToBase64 = (unicode: string): string => {
  const bytes = new TextEncoder().encode(unicode);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
  return base64;
}

export const base64ToUnicode = (base64: string): string => {
  const binString = atob(base64);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
  return new TextDecoder().decode(bytes);
}