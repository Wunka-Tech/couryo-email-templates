import { createContext, useContext } from "react";
import type { Lang } from "../types.js";
import { resolveBrand, type ResolvedBrand } from "./theme.js";

export type EmailContextValue = { lang: Lang; brand: ResolvedBrand };

export const EmailContext = createContext<EmailContextValue>({ lang: "pt", brand: resolveBrand(undefined, "pt") });

export const useEmail = () => useContext(EmailContext);
