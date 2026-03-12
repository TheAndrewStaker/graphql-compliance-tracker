import { MenuItem, TextField } from '@mui/material';
import type { ControlStatus } from '@/graphql/__generated__/graphql';

export interface ControlFieldValues {
  title: string;
  category: string;
  status: ControlStatus;
  description: string;
}

export interface ControlFieldErrors {
  title?: string;
  category?: string;
}

export function validateControlFields(values: ControlFieldValues): ControlFieldErrors {
  const errors: ControlFieldErrors = {};
  if (!values.title.trim()) {
    errors.title = 'Title is required';
  }
  if (!values.category.trim()) {
    errors.category = 'Category is required';
  }
  return errors;
}

interface Props {
  values: ControlFieldValues;
  errors: ControlFieldErrors;
  showStatus?: boolean;
  autoFocus?: boolean;
  onChange: (values: ControlFieldValues) => void;
}

export default function ControlFormFields({
  values,
  errors,
  showStatus = false,
  autoFocus = false,
  onChange,
}: Props) {
  return (
    <>
      <TextField
        label="Title"
        value={values.title}
        error={!!errors.title}
        helperText={errors.title}
        autoFocus={autoFocus}
        fullWidth
        onChange={(e) => {
          onChange({ ...values, title: e.target.value });
        }}
      />
      <TextField
        label="Category"
        value={values.category}
        error={!!errors.category}
        helperText={errors.category}
        fullWidth
        onChange={(e) => {
          onChange({ ...values, category: e.target.value });
        }}
      />
      {showStatus && (
        <TextField
          select
          label="Status"
          value={values.status}
          onChange={(e) => {
            onChange({ ...values, status: e.target.value as ControlStatus });
          }}
        >
          <MenuItem value="PASSING">Passing</MenuItem>
          <MenuItem value="FAILING">Failing</MenuItem>
          <MenuItem value="UNKNOWN">Unknown</MenuItem>
        </TextField>
      )}
      <TextField
        label="Description"
        multiline
        rows={3}
        value={values.description}
        fullWidth
        onChange={(e) => {
          onChange({ ...values, description: e.target.value });
        }}
      />
    </>
  );
}
