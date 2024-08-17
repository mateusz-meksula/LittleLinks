export function formDataToObj(formData: FormData) {
  const obj: any = {};
  formData.forEach((val, key) => (obj[key] = val));
  return obj;
}

export const isPasswordSecure = (password: string): boolean => {
  // TODO
  return password.length > 5;
};

export const copyToClipBoard = (text: string): void => {
  navigator.clipboard.writeText(text);
};

export const getPageOrigin = (): string => {
  return window.location.origin;
};

export const getLittleLinkUrl = (alias: string): string => {
  return getPageOrigin() + "/" + alias;
};
