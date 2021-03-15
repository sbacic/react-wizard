import { createContext, useContext } from 'react';

export const WizardContext = createContext(undefined);
export const useWizard = () => {
  const { setStep, step, total, values, setValues } = useContext(WizardContext);

  const next = () => {
    setStep(Math.min(step + 1, total));
  };

  const back = () => {
    setStep(Math.max(step - 1, 0));
  };

  const go = (to: number, optional?: boolean) => {
    setStep(to);
  };

  const submit = (fields: unknown) => {
    setValues((values) => (values[step] = fields));
    next();
  };

  const clear = (step?: number) => {
    setValues(step !== undefined ? [...values].slice(step, 1) : []);
  };

  return { next, back, go, step, submit, clear, values };
};
