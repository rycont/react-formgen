import { JSONSchema7 } from "json-schema";
import {
  createFormProviderAndHooks,
  FormState as CoreFormState,
} from "@react-formgen/core";
import { ErrorObject } from "ajv";
import { generateInitialData } from "./utils";
import {
  RenderTemplate as DefaultRenderTemplate,
  FormgenJSONSchema7,
  FormProviderProps,
  FormProps,
} from "./components";

const createInitialData = (schema: JSONSchema7 | FormgenJSONSchema7) =>
  generateInitialData(schema, schema.definitions || {});

const getErrorsAtPath = (
  errors: ErrorObject[],
  path: string[]
): ErrorObject[] | undefined => {
  const errorMap: { [key: string]: ErrorObject[] } = {};

  errors.forEach((error) => {
    const fullPath = error.instancePath
      ? `/${(error.instancePath || "").split("/").slice(1).join("/")}`
      : "/";
    const missingPath =
      error.keyword === "required"
        ? `${fullPath === "/" ? "" : fullPath}/${error.params.missingProperty}`
        : fullPath;
    errorMap[missingPath] = errorMap[missingPath] || [];
    errorMap[missingPath].push(error);
  });

  const fullPath = `/${path.join("/")}`;
  return errorMap[fullPath] || [];
};

const {
  FormProvider: CoreFormProvider,
  useFormContext,
  useFormDataAtPath,
  useErrorsAtPath,
  useArrayTemplate,
  useTemplates,
  useRenderTemplate,
  Form: CoreForm,
} = createFormProviderAndHooks<JSONSchema7 | FormgenJSONSchema7, ErrorObject>(
  createInitialData,
  getErrorsAtPath,
  DefaultRenderTemplate
);

export type FormState = CoreFormState<
  JSONSchema7 | FormgenJSONSchema7,
  ErrorObject
>;

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
export * from "./hooks";
