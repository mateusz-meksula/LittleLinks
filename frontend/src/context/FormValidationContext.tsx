import { createContext } from "react";
import { FormValidationContextType } from "../lib/types";

export const FormValidationContext =
  createContext<FormValidationContextType | null>(null);
