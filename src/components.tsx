import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { WizardContext, useWizard } from './hook';

interface Child {
  type?: unknown;
}

const count = (children: React.ReactNode) => {
  const array = React.Children.toArray(children);
  return array.filter((child) => (child as Child)?.type !== Optional).length;
};

const isOptional = (child: React.ReactNode) => {
  return (child as Child)?.type === Optional;
};

/**
 * A component that renders only the current step in the Wizard.
 * @param children Children to render.
 */
export const Steps: React.FC = ({ children }) => {
  const { setTotal, total } = useContext(WizardContext);
  const { step, optional } = useWizard();
  const length = count(children);
  const index = Math.max(Math.min(step, total - 1), 0);

  useEffect(() => {
    setTotal(length);
  }, [length]);

  return (
    <>
      {React.Children.toArray(children).filter((child, i) => {
        return (i === index && optional === undefined && total !== undefined) || isOptional(child);
      })}
    </>
  );
};

export interface WizardProps {
  children: React.ReactNode;
  /**
   * The step to be displayed on first render.
   * Default is 0.
   */
  startingStep?: number;
  /**
   * Whether to wrap children with the Steps component. Set to false if you want to add additional context providers first.
   * Default is true.
   */
  wrapInSteps?: boolean;
  startingOptional?: number;
}

/**
 * Context provider for the WizardContext.
 * @param startingStep Which child to render on first render. Zero-indexed. Default is 0, or the very first child.
 */
export const ContextWrapper: React.FC<WizardProps> = ({ children, startingStep, startingOptional }) => {
  const [total, setTotal] = useState();
  const [values, setValues] = useState({});
  const [step, setStep] = useState(startingStep);
  const [optional, setOptional] = useState<undefined | number>(startingOptional);
  const context = {
    step,
    setStep,
    values,
    setValues,
    optional,
    setOptional,
    total,
    setTotal,
  };

  return <WizardContext.Provider value={context}>{children}</WizardContext.Provider>;
};

/**
 * The top level Wizard component wrapper.
 */
export const Wizard: React.FC<WizardProps> = ({
  children,
  startingStep = 0,
  startingOptional = undefined,
  wrapInSteps = true,
}) => {
  return (
    <ContextWrapper startingStep={startingStep} startingOptional={startingOptional}>
      {wrapInSteps ? <Steps>{children}</Steps> : children}
    </ContextWrapper>
  );
};

/**
 * Wrapper for optional children. These are only rendered when optional is not undefined.
 * @param children Children to render.
 */
export const Optional: React.FC = ({ children }) => {
  const { optional } = useWizard();
  const max = count(children) - 1;
  const index = Math.max(Math.min(optional, max), 0);

  return (
    <>
      {React.Children.toArray(children).filter((child, i) => {
        return (i === index && optional !== undefined) || isOptional(child);
      })}
    </>
  );
};
