import {
  createFormProviderAndHooks,
  FormState as CoreFormState,
} from "@react-formgen/core";

import type * as z from "zod/v4/core";
import { generateInitialData } from "./utils";
import {
  RenderTemplate as DefaultRenderTemplate,
  FormProps,
  FormProviderProps,
} from "./components";

const createInitialData = (schema: z.$ZodType) => generateInitialData(schema);

/**
 * Extracts validation errors at a specific path from Zod issues
 * @param issues - Array of Zod issues (individual validation errors)
 * @param path - The path to check for errors
 * @returns Array of issues at the specified path, or undefined if none found
 */
const getIssuesAtPath = (
  issues: z.$ZodIssue[],
  path: string[]
): z.$ZodIssue[] | undefined => {
  // Filter issues that match the specified path
  const pathStr = path.join(".");

  const matchingIssues = issues.filter((issue) => {
    const issuePath = issue.path.map(String).join(".");
    return issuePath === pathStr;
  });

  return matchingIssues.length > 0 ? matchingIssues : undefined;
};

/**
 * Create the form provider and hooks using the core factory
 */
const {
  FormProvider: CoreFormProvider,
  useFormContext,
  useFormDataAtPath,
  useErrorsAtPath,
  useArrayTemplate,
  useTemplates,
  useRenderTemplate,
  Form: CoreForm,
} = createFormProviderAndHooks<z.$ZodType, z.$ZodIssue>(
  createInitialData,
  getIssuesAtPath,
  DefaultRenderTemplate
);

export type FormState = CoreFormState<z.$ZodType, z.$ZodIssue>;

const FormProvider = CoreFormProvider as React.FC<FormProviderProps>;
const Form = CoreForm as React.FC<FormProps>;

export {
  CoreFormProvider,
  CoreForm,
  FormProvider,
  useFormContext,
  useFormDataAtPath,
  useErrorsAtPath,
  useArrayTemplate,
  useTemplates,
  useRenderTemplate,
  Form,
};

export * from "./components";
export * from "./utils";
