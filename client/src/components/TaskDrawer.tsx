import { Fragment } from 'react';
import {
  Checkbox,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import DrawerPanel from '@/components/DrawerPanel';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GetTasksByControlDocument,
  CompleteTaskDocument,
} from '@/graphql/__generated__/graphql';

interface Props {
  controlId?: string;
  onClose: () => void;
}

export default function TaskDrawer({ controlId, onClose }: Props) {
  const { data, loading } = useQuery(GetTasksByControlDocument, {
    variables: { controlId: controlId ?? '' },
    skip: !controlId,
  });

  const [completeTask] = useMutation(CompleteTaskDocument);

  const tasks = data?.tasksByControl ?? [];

  function handleComplete(id: string) {
    void completeTask({
      variables: { id },
      optimisticResponse: {
        completeTask: { __typename: 'Task', id, completed: true },
      },
    });
  }

  return (
    <DrawerPanel title="Tasks" open={!!controlId} onClose={onClose}>
      {loading && <CircularProgress size={24} />}

      {!loading && tasks.length === 0 && (
        <Typography color="text.secondary">No tasks for this control.</Typography>
      )}

      <List disablePadding>
        {tasks.map((task, index) => (
          <Fragment key={task.id}>
            <ListItem
              disablePadding
              secondaryAction={
                <Checkbox
                  checked={task.completed}
                  disabled={task.completed}
                  onChange={() => handleComplete(task.id)}
                  edge="end"
                />
              }
            >
              <ListItemText
                primary={task.description}
                secondary={`${task.owner.name} · Due ${new Date(task.dueDate).toLocaleDateString()}`}
              />
            </ListItem>
            {index < tasks.length - 1 && <Divider />}
          </Fragment>
        ))}
      </List>
    </DrawerPanel>
  );
}
