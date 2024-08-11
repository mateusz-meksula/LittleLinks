export function formDataToObj(formData: FormData) {
  const obj: any = {};
  formData.forEach((val, key) => (obj[key] = val));
  return obj;
}

export function withFormErrorSetter(
  func: (value: string) => null | string,
  isFormErrorSetter: (val: boolean) => void
) {
  return (value: string): null | string => {
    const result = func(value);
    if (result !== null) {
      isFormErrorSetter(true);
    } else {
      isFormErrorSetter(false);
    }
    return result;
  };
}
