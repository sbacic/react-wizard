import { createContext, useContext } from 'react';

export const WizardContext = createContext(undefined);

interface Response {
  next: () => void;
  back: () => void;
  go: (to: number, optional?: boolean) => void;
  store: (fields: { [key: string]: unknown }) => void;
  clear: (keys?: string[]) => void;
  step: number;
  optional: number | undefined;
  values: { [key: string]: unknown };
}

export const useWizard = (): Response => {
  const { setStep, step, values, setValues, setOptional, optional } = useContext(WizardContext);

  /**
   * Go to the next step in the wizard.
   */
  const next = () => {
    setOptional(undefined);
    setStep(step + 1);
  };

  /**
   * Go to the previous step in the wizard.
   * If the current step is optional, go back to the previous non-optional step.
   */
  const back = () => {
    if (optional) {
      setOptional(undefined);
    } else {
      setStep(Math.max(step - 1, 0));
    }
  };

  /**
   * Jump to a specific step in the wizard.
   * @param to
   */
  const go = (to: number, optional?: boolean) => {
    if (optional !== undefined) {
      setOptional(to);
    } else {
      setStep(to);
      setOptional(undefined);
    }
  };

  /**
   * Stores the provided key/value pairs.
   * @param fields
   */
  const store = (fields: { [key: string]: unknown }) => {
    setValues((values) => {
      return { ...values, ...fields };
    });
  };

  /**
   * Remove values by key.
   * @param keys List of keys to be removed. If none are provided, all the values are removed.
   */
  const clear = (keys?: string[]) => {
    const filterByKeys = (values: { [key: string]: unknown }, keys: string[]) =>
      Object.fromEntries(Object.entries(values).filter(([key]) => !keys.includes(key)));

    setValues((values) => (keys ? filterByKeys(values, keys) : {}));
  };

  return { next, back, go, step, store, clear, values, optional };
};
