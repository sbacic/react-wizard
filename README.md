# Wizard

Wizard is a React library for handling multi-page forms.

### Features

- Easy to learn
- Clean layout
- Flexible
- Supports optional pages
- Uses Typescript

The API consists of two parts: React components and a custom React hook.

**\<Wizard\>**
Your form pages should be wrapped in this to receive the Wizard context. It accepts the following props:

- `startingStep`

The starting step of the Wizard. Default is 0.

- `useWizardRenderer`

Whether to use the `WizardRenderer` to render only the current step or to render all children. Useful if you want to make other contexts available to the children first. Default is true.

**\<WizardRenderer\>**

Must be a child of `Wizard`. Renders only the child that matches the current step of the wizard.
If the step is less than 0, it shows the first step.
If the step is greater than the number of children, shows the last child.

**Optional**

Optional pages. These are _only_ renderered if you manually send the user there (see `go()`, below).
If the step is less than 0, it shows the first step.
If the step is greater than the number of children, shows the last child.

**useWizard()**

This hook provides everything you need to switch between forms and store form values for later submission.

- `next()`

Go to the next page in form. If used on an optional page, it returns you to the next non-optional page (eg: if you were on step 2 of a wizard it sends you to step 3).

- `back()`

Go to the previous page in the form. If used on an optional page, it returns you to the main page you were at (eg: if you were on step 2 and went to an optional page, it returns you to step 2).

- `go(step: number, optional?: boolean)`

Jump to a specific step in the form. If optional is set to true, it jumps to that optional page instead.

- `store(fields: { [key: string]: unknown })`

Stores an object of key/value pairs for later submission.

- `clear(keys?: string[])`

Clear the stored values by key. If no keys are provided, the entire store is emptied.

- `values`

A dictionary of values stored with `store()`.

- `step`

A number representing the current step in the wizard. Zero-indexed.

- `optional`

A number representing the current optional step. If undefined, no optional page is shown.

### Examples

Basic example:

```JSX
import { Wizard } from "sbacic/wizard";

<Wizard>
  <Page1 />
  <Page2 />
  <Page3 />
</Wizard>
```

With optional pages:

```JSX
import { Wizard, Optional } from "sbacic/wizard";

<Wizard>
  <Page1 />
  <Page2 />
  <Page3 />
  <Optional>
    <Step1a />
    <Step1b />
  </Optional>
</Wizard>
```

With additional context added in:

```JSX
import { Wizard, Optional, WizardRenderer, useWizard } from "sbacic/wizard";
import { Formik } from "formik";

const FormWithFormikContext = () => {
    const initialValues = {name: "John Smith"};
    const { values, step, next, store } = useWizard();
    const submit = (values) => {
        if (step < 3) {
            store(values);
            next();
        } else {
            // Submit the data
        }
    }

    return (
        <Formik onSubmit={submit} initialValues={{...initialValues, ...values}}>
        <WizardRenderer>
            <Page1 />
            <Page2 />
            <Page3 />
            <Optional>
                <Step1a />
                <Step1b />
            </Optional>
        </WizardRenderer>
    </Formik>
    )
}

const Form = () => {
    return (
        <Wizard useWizardRenderer={false}>
          <FormWithFormikContext />
        </Wizard>
    )
}

```
