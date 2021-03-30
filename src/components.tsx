import React from 'react';
import { useState } from 'react';
import { WizardContext, useWizard } from './hook';

interface Child {
  type?: { name?: string };
}

const count = (children: React.ReactNode) => {
  const array = React.Children.toArray(children);
  return array.filter((child) => (child as Child)?.type?.name !== 'Optional').length;
};

/**
 * A component that renders only the current step in the Wizard.
 * @param children Children to render.
 */
export const Steps: React.FC = ({ children }) => {
  const { step, optional } = useWizard();
  const max = count(children) - 1;
  const index = Math.max(Math.min(step, max), 0);

  if (children && optional === undefined) {
    return children[index] || null;
  } else {
    return null;
  }
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
}

/**
 * Context provider for the WizardContext.
 * @param startingStep Which child to render on first render. Zero-indexed. Default is 0, or the very first child.
 */
export const ContextWrapper: React.FC<WizardProps> = ({ children, startingStep }) => {
  const [values, setValues] = useState({});
  const [step, setStep] = useState(startingStep);
  const [optional, setOptional] = useState<undefined | number>(undefined);
  const context = {
    step,
    setStep,
    values,
    setValues,
    optional,
    setOptional,
  };

  return <WizardContext.Provider value={context}>{children}</WizardContext.Provider>;
};

/**
 * The top level Wizard component wrapper.
 */
export const Wizard: React.FC<WizardProps> = ({ children, startingStep = 0, wrapInSteps = true }) => {
  return (
    <ContextWrapper startingStep={startingStep}>{wrapInSteps ? <Steps>{children}</Steps> : children}</ContextWrapper>
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

  if (children && optional !== undefined) {
    return children[index] || null;
  } else {
    return null;
  }
};
