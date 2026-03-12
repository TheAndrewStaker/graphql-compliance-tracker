import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import {
  UpdateControlDocument,
  ControlEditFieldsFragmentDoc,
} from '@/graphql/__generated__/graphql';
import { useFragment, type FragmentType } from '@/graphql/__generated__/fragment-masking';
import FormDialog from '@/components/FormDialog';
import ControlFormFields, {
  validateControlFields,
  type ControlFieldErrors,
  type ControlFieldValues,
} from '@/components/ControlFormFields';

interface Props {
  open: boolean;
  control: FragmentType<typeof ControlEditFieldsFragmentDoc>;
  onClose: () => void;
}

export default function EditControlDialog({ open, control, onClose }: Props) {
  const controlData = useFragment(ControlEditFieldsFragmentDoc, control);

  const [values, setValues] = useState<ControlFieldValues>({
    title: controlData.title,
    category: controlData.category,
    status: controlData.status,
    description: controlData.description ?? '',
  });
  const [errors, setErrors] = useState<ControlFieldErrors>({});

  const [updateControl] = useMutation(UpdateControlDocument);

  function handleSubmit() {
    const next = validateControlFields(values);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      return;
    }

    onClose();
    void updateControl({
      variables: {
        input: {
          id: controlData.id,
          title: values.title.trim(),
          category: values.category.trim(),
          status: values.status,
          description: values.description.trim() || undefined,
        },
      },
      optimisticResponse: {
        updateControl: {
          __typename: 'Control',
          id: controlData.id,
          title: values.title.trim(),
          category: values.category.trim(),
          status: values.status,
          description: values.description.trim() || null,
        },
      },
    });
  }

  return (
    <FormDialog open={open} title="Edit Control" onClose={onClose} onSubmit={handleSubmit}>
      <ControlFormFields
        values={values}
        errors={errors}
        showStatus
        autoFocus
        onChange={setValues}
      />
    </FormDialog>
  );
}
