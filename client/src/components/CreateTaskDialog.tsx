import { useState } from 'react';
import { type Reference } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { CreateTaskDocument } from '@/graphql/__generated__/graphql';
import FormDialog from '@/components/FormDialog';
import TaskFormFields, {
  validateTaskFields,
  type TaskFieldErrors,
  type TaskFieldValues,
} from '@/components/TaskFormFields';

interface Props {
  open: boolean;
  onClose: () => void;
}

const EMPTY_VALUES: TaskFieldValues = {
  description: '',
  controlId: '',
  controlTitle: '',
  ownerId: '',
  ownerName: '',
  notes: '',
  dueDate: '',
};

const toIso = (date: string) => `${date}T12:00:00.000Z`;

export default function CreateTaskDialog({ open, onClose }: Props) {
  const [values, setValues] = useState<TaskFieldValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<TaskFieldErrors>({});

  const [createTask] = useMutation(CreateTaskDocument, {
    update(cache, { data }) {
      if (!data) { return; }
      cache.modify({
        fields: {
          tasks(existingRefs = [], { toReference }) {
            return [...existingRefs, toReference({ __typename: 'Task', id: data.createTask.id })];
          },
          tasksByControl(existingRefs, { storeFieldName, toReference }) {
            if (!storeFieldName.includes(JSON.stringify(data.createTask.control.id))) { return existingRefs; }
            const refs = Array.isArray(existingRefs) ? (existingRefs as Reference[]) : [];
            const ref = toReference({ __typename: 'Task', id: data.createTask.id });
            return ref ? [...refs, ref] : refs;
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
    const next = validateTaskFields(values);
    setErrors(next);
    if (Object.keys(next).length > 0) { return; }

    handleClose();
    void createTask({
      variables: {
        input: {
          controlId: values.controlId,
          ownerId: values.ownerId,
          dueDate: toIso(values.dueDate),
          description: values.description.trim(),
          notes: values.notes.trim() || undefined,
        },
      },
      optimisticResponse: {
        createTask: {
          __typename: 'Task',
          id: crypto.randomUUID(),
          description: values.description.trim(),
          notes: values.notes.trim() || null,
          completed: false,
          dueDate: toIso(values.dueDate),
          control: { __typename: 'Control', id: values.controlId, title: values.controlTitle },
          owner: { __typename: 'Owner', id: values.ownerId, name: values.ownerName },
        },
      },
    });
  }

  return (
    <FormDialog open={open} title="Create Task" submitLabel="Create" onClose={handleClose} onSubmit={handleSubmit}>
      <TaskFormFields values={values} errors={errors} autoFocus onChange={setValues} />
    </FormDialog>
  );
}
