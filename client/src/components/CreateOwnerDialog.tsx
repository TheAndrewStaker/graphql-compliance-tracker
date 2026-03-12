import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CreateOwnerDocument } from '@/graphql/__generated__/graphql';
import FormDialog from '@/components/FormDialog';
import OwnerFormFields, {
  validateOwnerFields,
  type OwnerFieldErrors,
  type OwnerFieldValues,
} from '@/components/OwnerFormFields';

interface Props {
  open: boolean;
  onClose: () => void;
}

const EMPTY: OwnerFieldValues = { name: '', email: '' };

export default function CreateOwnerDialog({ open, onClose }: Props) {
  const [values, setValues] = useState<OwnerFieldValues>(EMPTY);
  const [errors, setErrors] = useState<OwnerFieldErrors>({});

  const [createOwner] = useMutation(CreateOwnerDocument, {
    update(cache, { data }) {
      if (!data) {
        return;
      }
      cache.modify({
        fields: {
          owners(existingRefs = [], { toReference }) {
            return [...existingRefs, toReference({ __typename: 'Owner', id: data.createOwner.id })];
          },
        },
      });
    },
  });

  function handleClose() {
    setValues(EMPTY);
    setErrors({});
    onClose();
  }

  function handleSubmit() {
    const next = validateOwnerFields(values);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      return;
    }

    handleClose();
    void createOwner({
      variables: { input: { name: values.name.trim(), email: values.email.trim() } },
      optimisticResponse: {
        createOwner: {
          __typename: 'Owner',
          id: crypto.randomUUID(),
          name: values.name.trim(),
          email: values.email.trim(),
        },
      },
    });
  }

  return (
    <FormDialog
      open={open}
      title="Create Owner"
      submitLabel="Create"
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <OwnerFormFields values={values} errors={errors} autoFocus onChange={setValues} />
    </FormDialog>
  );
}
