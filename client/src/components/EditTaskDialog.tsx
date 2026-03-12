import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { UpdateTaskDocument, TaskEditFieldsFragmentDoc } from '@/graphql/__generated__/graphql';
import { useFragment, type FragmentType } from '@/graphql/__generated__/fragment-masking';
import FormDialog from '@/components/FormDialog';
import TaskFormFields, {
  validateTaskFields,
  type TaskFieldErrors,
  type TaskFieldValues,
} from '@/components/TaskFormFields';

interface Props {
  open: boolean;
  task: FragmentType<typeof TaskEditFieldsFragmentDoc>;
  onClose: () => void;
}

const toDateInput = (iso: string) => iso.slice(0, 10);
const toIso = (date: string) => `${date}T12:00:00.000Z`;

export default function EditTaskDialog({ open, task, onClose }: Props) {
  const taskData = useFragment(TaskEditFieldsFragmentDoc, task);

  const [values, setValues] = useState<TaskFieldValues>({
    description: taskData.description,
    controlId: taskData.control.id,
    controlTitle: taskData.control.title,
    ownerId: taskData.owner.id,
    ownerName: taskData.owner.name,
    notes: taskData.notes ?? '',
    dueDate: toDateInput(taskData.dueDate as string),
  });
  const [errors, setErrors] = useState<TaskFieldErrors>({});

  const [updateTask] = useMutation(UpdateTaskDocument);

  function handleSubmit() {
    const next = validateTaskFields(values);
    setErrors(next);
    if (Object.keys(next).length > 0) { return; }

    onClose();
    void updateTask({
      variables: {
        input: {
          id: taskData.id,
          controlId: values.controlId,
          ownerId: values.ownerId,
          dueDate: toIso(values.dueDate),
          description: values.description.trim(),
          notes: values.notes.trim() || undefined,
        },
      },
      optimisticResponse: {
        updateTask: {
          __typename: 'Task',
          id: taskData.id,
          description: values.description.trim(),
          notes: values.notes.trim() || null,
          dueDate: toIso(values.dueDate),
          control: { __typename: 'Control', id: values.controlId, title: values.controlTitle },
          owner: { __typename: 'Owner', id: values.ownerId, name: values.ownerName },
        },
      },
    });
  }

  return (
    <FormDialog open={open} title="Edit Task" onClose={onClose} onSubmit={handleSubmit}>
      <TaskFormFields values={values} errors={errors} autoFocus onChange={setValues} />
    </FormDialog>
  );
}
