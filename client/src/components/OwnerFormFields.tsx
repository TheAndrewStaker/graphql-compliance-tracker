import { Alert, TextField } from '@mui/material';

export interface OwnerFieldValues {
  name: string;
  email: string;
}

export interface OwnerFieldErrors {
  name?: string;
  email?: string;
}

interface Props {
  values: OwnerFieldValues;
  errors: OwnerFieldErrors;
  serverError?: string;
  autoFocus?: boolean;
  onChange: (values: OwnerFieldValues) => void;
}

export function validateOwnerFields(values: OwnerFieldValues): OwnerFieldErrors {
  const errors: OwnerFieldErrors = {};
  if (!values.name.trim()) {
    errors.name = 'Name is required';
  }
  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!values.email.includes('@')) {
    errors.email = 'Enter a valid email address';
  }
  return errors;
}

export default function OwnerFormFields({
  values,
  errors,
  serverError,
  autoFocus = false,
  onChange,
}: Props) {
  return (
    <>
      {serverError && <Alert severity="error">{serverError}</Alert>}
      <TextField
        label="Name"
        value={values.name}
        onChange={(e) => {
          onChange({ ...values, name: e.target.value });
        }}
        error={!!errors.name}
        helperText={errors.name}
        autoFocus={autoFocus}
        fullWidth
      />
      <TextField
        label="Email"
        type="email"
        value={values.email}
        onChange={(e) => {
          onChange({ ...values, email: e.target.value });
        }}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
      />
    </>
  );
}
