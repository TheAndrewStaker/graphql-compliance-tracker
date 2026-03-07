import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  useGetTasksByControlQuery,
  useCompleteTaskMutation,
} from '../graphql/__generated__/types';

interface Props {
  controlId?: string;
  onClose: () => void;
}

export default function TaskDrawer({ controlId, onClose }: Props) {
  const { data, loading } = useGetTasksByControlQuery({
    variables: { controlId: controlId ?? '' },
    skip: !controlId,
  });

  const [completeTask] = useCompleteTaskMutation();

  const tasks = data?.tasksByControl ?? [];

  function handleComplete(id: string) {
    completeTask({
      variables: { id },
      optimisticResponse: {
        completeTask: { __typename: 'Task', id, completed: true },
      },
    });
  }

  return (
    <Drawer anchor="right" open={!!controlId} onClose={onClose}>
      <Box sx={{ width: 400, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Tasks</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {loading && <CircularProgress size={24} />}

        {!loading && tasks.length === 0 && (
          <Typography color="text.secondary">No tasks for this control.</Typography>
        )}

        <List disablePadding>
          {tasks.map((task, index) => (
            <Box key={task.id}>
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
                  primary={task.notes ?? '(no notes)'}
                  secondary={`${task.owner.name} · Due ${new Date(task.dueDate).toLocaleDateString()}`}
                />
              </ListItem>
              {index < tasks.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
