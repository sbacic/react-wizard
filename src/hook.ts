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
  isFirst: boolean;
  isLast: boolean;
  total: number;
}

export const useWizard = (): Response => {
  const { setStep, step, values, setValues, setOptional, optional, total } = useContext(WizardContext);

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
    if (optional !== undefined) {
      setOptional(undefined);
    } else {
      setStep(Math.max(step - 1, 0));
    }
  };

  /**
   * Jump to a specific step in the wizard.
   * @param to
   * @param goToOptional Whether to jump to an optional step
   */
  const go = (to: number, goToOptional?: true) => {
    if (goToOptional !== undefined) {
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

  /**
   * Are we on the first step of the Wizard?
   */
  const isFirst = step === 0 && !optional;

  /**
   * Are we on the last step of the Wizard?
   */
  const isLast = !total || step + 1 === total;

  return {
    next,
    back,
    go,
    step,
    store,
    clear,
    values,
    optional,
    total: total || 0,
    isFirst,
    isLast,
  };
};
