import { formFieldValidator, FormValuesBase } from "./types";

export function formDataToObj(formData: FormData) {
  const obj: any = {};
  formData.forEach((val, key) => (obj[key] = val));
  return obj;
}

export const withFormErrorSetter = <T extends FormValuesBase>(
  func: formFieldValidator<T>,
  isFormErrorSetter: (val: boolean) => void
) => {
  const inner: formFieldValidator<T> = (value, formData) => {
    const result = func(value, formData);
    if (result !== null) {
      isFormErrorSetter(true);
    } else {
      isFormErrorSetter(false);
    }
    return result;
  };
  return inner;
};

export const isPasswordSecure = (password: string): boolean => {
  // TODO
  return password.length > 5;
};
