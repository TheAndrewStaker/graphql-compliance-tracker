import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { UpdateOwnerDocument, OwnerEditFieldsFragmentDoc } from '@/graphql/__generated__/graphql';
import { useFragment, type FragmentType } from '@/graphql/__generated__/fragment-masking';
import FormDialog from '@/components/FormDialog';
import OwnerFormFields, {
  validateOwnerFields,
  type OwnerFieldErrors,
  type OwnerFieldValues,
} from '@/components/OwnerFormFields';

interface Props {
  open: boolean;
  owner: FragmentType<typeof OwnerEditFieldsFragmentDoc>;
  onClose: () => void;
}

export default function EditOwnerDialog({ open, owner, onClose }: Props) {
  const ownerData = useFragment(OwnerEditFieldsFragmentDoc, owner);

  const [values, setValues] = useState<OwnerFieldValues>({
    name: ownerData.name,
    email: ownerData.email,
  });
  const [errors, setErrors] = useState<OwnerFieldErrors>({});

  const [updateOwner] = useMutation(UpdateOwnerDocument);

  function handleSubmit() {
    const next = validateOwnerFields(values);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      return;
    }

    onClose();
    void updateOwner({
      variables: {
        input: { id: ownerData.id, name: values.name.trim(), email: values.email.trim() },
      },
      optimisticResponse: {
        updateOwner: {
          __typename: 'Owner',
          id: ownerData.id,
          name: values.name.trim(),
          email: values.email.trim(),
        },
      },
    });
  }

  return (
    <FormDialog open={open} title="Edit Owner" onClose={onClose} onSubmit={handleSubmit}>
      <OwnerFormFields values={values} errors={errors} autoFocus onChange={setValues} />
    </FormDialog>
  );
}
