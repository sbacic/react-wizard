import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useWizard, Wizard, Optional } from './index';
import { Steps } from './components';

describe('basic tests', () => {
  it('only the current step is shown', () => {
    render(
      <Wizard>
        <div>Step 1</div>
        <div>Step 2</div>
        <div>Step 3</div>
        <Optional>
          <div>Step 1a</div>
          <div>Step 1b</div>
        </Optional>
      </Wizard>
    );

    expect(screen.queryByText('Step 1')).toBeTruthy();
    expect(screen.queryByText('Step 2')).toBeFalsy();
    expect(screen.queryByText('Step 3')).toBeFalsy();
    expect(screen.queryByText('Step 1a')).toBeFalsy();
    expect(screen.queryByText('Step 1b')).toBeFalsy();
  });

  it('a step less than 0 displays the first step', () => {
    render(
      <Wizard startingStep={-2}>
        <div>Step 1</div>
        <div>Step 2</div>
        <div>Step 3</div>
        <Optional>
          <div>Step 1a</div>
          <div>Step 1b</div>
        </Optional>
      </Wizard>
    );

    expect(screen.queryByText('Step 1')).toBeTruthy();
    expect(screen.queryByText('Step 2')).toBeFalsy();
    expect(screen.queryByText('Step 3')).toBeFalsy();
    expect(screen.queryByText('Step 1a')).toBeFalsy();
    expect(screen.queryByText('Step 1b')).toBeFalsy();
  });

  it('a step greater than the max number of valid children displays the last step', () => {
    render(
      <Wizard startingStep={4}>
        <div>Step 1</div>
        <div>Step 2</div>
        <div>Step 3</div>
        <Optional>
          <div>Step 1a</div>
          <div>Step 1b</div>
        </Optional>
      </Wizard>
    );

    expect(screen.queryByText('Step 1')).toBeFalsy();
    expect(screen.queryByText('Step 2')).toBeFalsy();
    expect(screen.queryByText('Step 3')).toBeTruthy();
    expect(screen.queryByText('Step 1a')).toBeFalsy();
    expect(screen.queryByText('Step 1b')).toBeFalsy();
  });

  it('Optional is rendered even if there are no regular steps', () => {
    render(
      <Wizard wrapInSteps={false} startingOptional={0}>
        <Steps>
          <Optional>
            <div>Hello world!</div>
          </Optional>
        </Steps>
      </Wizard>
    );

    expect(screen.getByText('Hello world!')).toBeTruthy();
  });

  const Component = () => {
    const { total, isFirst, isLast, step } = useWizard();

    return (
      <div>
        <span>step: {step}</span>
        <span>total: {total}</span>
        <span>isFirst: {isFirst && 'yes'}</span>
        <span>isLast: {isLast && 'yes'}</span>
      </div>
    );
  };

  it('isFirst works as expected', () => {
    render(
      <Wizard wrapInSteps={false}>
        <Steps>
          <div></div>
          <div></div>
          <div></div>
        </Steps>
        <Component />
      </Wizard>
    );

    expect(screen.getByText('isFirst: yes')).toBeTruthy();
    expect(screen.queryByText('isLast: yes')).toBeFalsy();
  });

  it('isLast works expected', () => {
    render(
      <Wizard wrapInSteps={false} startingStep={2}>
        <Steps>
          <div></div>
          <div></div>
          <div></div>
        </Steps>
        <Component />
      </Wizard>
    );

    expect(screen.queryByText('isFirst: yes')).toBeFalsy();
    expect(screen.getByText('isLast: yes')).toBeTruthy();
  });

  it('total displays the correct number of children', () => {
    render(
      <Wizard wrapInSteps={false} startingStep={2}>
        <Steps>
          <div></div>
          <div></div>
          <div></div>
        </Steps>
        <Component />
      </Wizard>
    );

    expect(screen.queryByText('total: 3')).toBeTruthy();
  });

  it('total returns 0 when there are no children', () => {
    render(
      <Wizard wrapInSteps={false} startingStep={2}>
        <Steps></Steps>
        <Component />
      </Wizard>
    );

    expect(screen.getByText('total: 0')).toBeTruthy();
  });

  it('next() works', () => {
    const wrapper = ({ children }) => <Wizard wrapInSteps={false}>{children}</Wizard>;
    const hook = renderHook(() => useWizard(), { wrapper });
    expect(hook.result.current.step).toBe(0);
    act(() => hook.result.current.next());
    expect(hook.result.current.step).toBe(1);
  });

  it('back() works', () => {
    const wrapper = ({ children }) => (
      <Wizard startingStep={2} wrapInSteps={false}>
        {children}
      </Wizard>
    );
    const hook = renderHook(() => useWizard(), { wrapper });

    expect(hook.result.current.step).toBe(2);
    act(() => hook.result.current.back());
    expect(hook.result.current.step).toBe(1);
  });

  it('go() works', () => {
    const wrapper = ({ children }) => (
      <Wizard startingStep={0} wrapInSteps={false}>
        {children}
      </Wizard>
    );
    const hook = renderHook(() => useWizard(), { wrapper });

    expect(hook.result.current.step).toBe(0);
    act(() => hook.result.current.go(2));
    expect(hook.result.current.step).toBe(2);
  });

  it('go() with optional set to true works', () => {
    const wrapper = ({ children }) => (
      <Wizard startingStep={0} wrapInSteps={false}>
        {children}
      </Wizard>
    );
    const hook = renderHook(() => useWizard(), { wrapper });

    expect(hook.result.current.step).toBe(0);
    act(() => hook.result.current.go(2, true));
    expect(hook.result.current.step).toBe(0);
    expect(hook.result.current.optional).toBe(2);
  });

  it('store() works', async () => {
    const wrapper = ({ children }) => (
      <Wizard startingStep={0} wrapInSteps={false}>
        {children}
      </Wizard>
    );
    const hook = renderHook(() => useWizard(), { wrapper });

    act(() => hook.result.current.store({ name: 'John' }));
    expect(hook.result.current.values).toStrictEqual({ name: 'John' });
    act(() => hook.result.current.store({ name: 'Sam', job: 'waiter' }));
    expect(hook.result.current.values).toStrictEqual({
      name: 'Sam',
      job: 'waiter',
    });
  });

  it('clear() works', async () => {
    const wrapper = ({ children }) => (
      <Wizard startingStep={0} wrapInSteps={false}>
        {children}
      </Wizard>
    );
    const hook = renderHook(() => useWizard(), { wrapper });

    act(() => hook.result.current.store({ name: 'John' }));
    act(() => hook.result.current.store({ password: 'pass' }));
    act(() => hook.result.current.clear(['name']));
    expect(hook.result.current.values).toStrictEqual({
      password: 'pass',
    });
    act(() => hook.result.current.clear());
    expect(hook.result.current.values).toStrictEqual({});
  });
});
