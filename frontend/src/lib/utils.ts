export function formDataToObj(formData: FormData) {
  const obj: any = {};
  formData.forEach((val, key) => (obj[key] = val));
  return obj;
}

export const isPasswordSecure = (password: string): boolean => {
  // TODO
  return password.length > 5;
};
