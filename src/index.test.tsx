import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useWizard, Wizard, Optional } from './index';

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

  it('next() works', () => {
    const wrapper = ({ children }) => (
      <Wizard useWizardRenderer={false}>{children}</Wizard>
    );
    const hook = renderHook(() => useWizard(), { wrapper });
    expect(hook.result.current.step).toBe(0);
    act(() => hook.result.current.next());
    expect(hook.result.current.step).toBe(1);
  });

  it('back() works', () => {
    const wrapper = ({ children }) => (
      <Wizard startingStep={2} useWizardRenderer={false}>
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
      <Wizard startingStep={0} useWizardRenderer={false}>
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
      <Wizard startingStep={0} useWizardRenderer={false}>
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
      <Wizard startingStep={0} useWizardRenderer={false}>
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
      <Wizard startingStep={0} useWizardRenderer={false}>
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
