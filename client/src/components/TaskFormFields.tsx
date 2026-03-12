import { MenuItem, TextField } from '@mui/material';
import { useQuery } from '@apollo/client/react';
import {
  GetControlsDocument,
  GetOwnersDocument,
  ControlListFieldsFragmentDoc,
  OwnerListFieldsFragmentDoc,
} from '@/graphql/__generated__/graphql';
import { useFragment as readFragment } from '@/graphql/__generated__/fragment-masking';

export interface TaskFieldValues {
  description: string;
  controlId: string;
  controlTitle: string; // kept in sync with controlId for optimistic responses
  ownerId: string;
  ownerName: string; // kept in sync with ownerId for optimistic responses
  notes: string;
  dueDate: string; // YYYY-MM-DD for <input type="date">
}

export interface TaskFieldErrors {
  description?: string;
  controlId?: string;
  ownerId?: string;
  notes?: string;
  dueDate?: string;
}

export function validateTaskFields(values: TaskFieldValues): TaskFieldErrors {
  const errors: TaskFieldErrors = {};
  if (!values.description.trim()) {
    errors.description = 'Description is required';
  }
  if (!values.controlId) {
    errors.controlId = 'Control is required';
  }
  if (!values.ownerId) {
    errors.ownerId = 'Owner is required';
  }
  if (!values.dueDate) {
    errors.dueDate = 'Due date is required';
  }
  return errors;
}

interface Props {
  values: TaskFieldValues;
  errors: TaskFieldErrors;
  autoFocus?: boolean;
  onChange: (values: TaskFieldValues) => void;
}

export default function TaskFormFields({ values, errors, autoFocus = false, onChange }: Props) {
  const { data: controlsData } = useQuery(GetControlsDocument);
  const { data: ownersData } = useQuery(GetOwnersDocument);

  const controls = (controlsData?.controls ?? []).map((c) =>
    readFragment(ControlListFieldsFragmentDoc, c),
  );
  const owners = (ownersData?.owners ?? []).map((o) => readFragment(OwnerListFieldsFragmentDoc, o));

  return (
    <>
      <TextField
        label="Description"
        value={values.description}
        error={!!errors.description}
        helperText={errors.description}
        autoFocus={autoFocus}
        fullWidth
        onChange={(e) => {
          onChange({ ...values, description: e.target.value });
        }}
      />
      <TextField
        select
        label="Control"
        value={values.controlId}
        error={!!errors.controlId}
        helperText={errors.controlId}
        onChange={(e) => {
          const id = e.target.value;
          const title = controls.find((c) => c.id === id)?.title ?? '';
          onChange({ ...values, controlId: id, controlTitle: title });
        }}
      >
        {controls.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.title}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Owner"
        value={values.ownerId}
        error={!!errors.ownerId}
        helperText={errors.ownerId}
        onChange={(e) => {
          const id = e.target.value;
          const name = owners.find((o) => o.id === id)?.name ?? '';
          onChange({ ...values, ownerId: id, ownerName: name });
        }}
      >
        {owners.map((o) => (
          <MenuItem key={o.id} value={o.id}>
            {o.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Due Date"
        type="date"
        value={values.dueDate}
        error={!!errors.dueDate}
        helperText={errors.dueDate}
        slotProps={{ inputLabel: { shrink: true } }}
        fullWidth
        onChange={(e) => {
          onChange({ ...values, dueDate: e.target.value });
        }}
      />
      <TextField
        label="Notes"
        multiline
        rows={3}
        value={values.notes}
        error={!!errors.notes}
        helperText={errors.notes}
        fullWidth
        onChange={(e) => {
          onChange({ ...values, notes: e.target.value });
        }}
      />
    </>
  );
}
