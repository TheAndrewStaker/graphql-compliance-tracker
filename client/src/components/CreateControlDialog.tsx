import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CreateControlDocument } from '@/graphql/__generated__/graphql';
import FormDialog from '@/components/FormDialog';
import ControlFormFields, {
  validateControlFields,
  type ControlFieldErrors,
  type ControlFieldValues,
} from '@/components/ControlFormFields';

interface Props {
  open: boolean;
  onClose: () => void;
}

const EMPTY_VALUES: ControlFieldValues = {
  title: '',
  category: '',
  status: 'UNKNOWN',
  description: '',
};

export default function CreateControlDialog({ open, onClose }: Props) {
  const [values, setValues] = useState<ControlFieldValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ControlFieldErrors>({});

  const [createControl] = useMutation(CreateControlDocument, {
    update(cache, { data }) {
      if (!data) {
        return;
      }
      cache.modify({
        fields: {
          controls(existingRefs = [], { toReference }) {
            return [
              ...existingRefs,
              toReference({ __typename: 'Control', id: data.createControl.id }),
            ];
          },
        },
      });
    },
  });

  function handleClose() {
    setValues(EMPTY_VALUES);
    setErrors({});
    onClose();
  }

  function handleSubmit() {
    const next = validateControlFields(values);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      return;
    }

    handleClose();
    void createControl({
      variables: {
        input: {
          title: values.title.trim(),
          category: values.category.trim(),
          description: values.description.trim() || undefined,
        },
      },
      optimisticResponse: {
        createControl: {
          __typename: 'Control',
          id: crypto.randomUUID(),
          title: values.title.trim(),
          category: values.category.trim(),
          description: values.description.trim() || null,
          status: 'UNKNOWN',
        },
      },
    });
  }

  return (
    <FormDialog
      open={open}
      title="Create Control"
      submitLabel="Create"
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <ControlFormFields values={values} errors={errors} autoFocus onChange={setValues} />
    </FormDialog>
  );
}
