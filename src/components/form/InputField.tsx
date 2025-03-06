import * as React from 'react';
import { useField } from 'formik';

interface InputFieldProps {
  label: string;
  name: string;
  placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, name, placeholder }) => {
  const [field, meta] = useField(name);

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input {...field} id={name} placeholder={placeholder} />
      {meta.touched && meta.error ? <div style={{ color: 'red' }}>{meta.error}</div> : null}
    </div>
  );
};
