import * as React from 'react';
import { Formik, Form } from 'formik';

interface WithFormikProps<T> {
  initialValues: T;
  onSubmit: (values: T, actions: any) => void;
  validationSchema: any;
  children?: React.ReactNode;
}

export const withFormik = <T extends object>(
  WrappedComponent: React.FC<{ values: T }>
) => {
  return ({ initialValues, onSubmit, validationSchema, children }: WithFormikProps<T>) => {
    return (
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ values, isSubmitting }) => (
          <Form>
            <WrappedComponent values={values} />
            {children} {/* ✅ Pass children inside the Formik wrapper */}
            <button type="submit" disabled={isSubmitting}>Submit</button>
          </Form>
        )}
      </Formik>
    );
  };
};
