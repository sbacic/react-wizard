import { createContext, useContext } from 'react';

export const WizardContext = createContext(undefined);

export const useWizard = () => {
  const {
    setStep,
    step,
    values,
    setValues,
    setOptional,
    optional,
  } = useContext(WizardContext);

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
    if (optional) {
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
    setValues((values) =>
      keys
        ? Object.fromEntries(
            Object.entries(values).filter(([key]) => !keys.includes(key))
          )
        : {}
    );
  };

  return { next, back, go, step, store, clear, values, optional, setOptional };
};
