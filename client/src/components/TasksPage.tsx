import { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GetTasksDocument,
  DeleteTaskDocument,
  TaskListFieldsFragmentDoc,
  TaskEditFieldsFragmentDoc,
} from '@/graphql/__generated__/graphql';
import {
  useFragment as readFragment,
  type FragmentType,
} from '@/graphql/__generated__/fragment-masking';
import PageContainer from '@/components/PageContainer';
import CreateTaskDialog from '@/components/CreateTaskDialog';
import EditTaskDialog from '@/components/EditTaskDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

type ListTask = FragmentType<typeof TaskListFieldsFragmentDoc>;
type EditTask = FragmentType<typeof TaskEditFieldsFragmentDoc>;

export default function TasksPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<EditTask>();
  const [deleteTask, setDeleteTask] = useState<EditTask>();

  const { data, loading } = useQuery(GetTasksDocument);

  const [deleteTaskMutation] = useMutation(DeleteTaskDocument, {
    update(cache, { data: result }) {
      if (!result) {
        return;
      }
      cache.evict({ id: cache.identify({ __typename: 'Task', id: result.deleteTask }) });
      cache.gc();
    },
  });

  const editTaskData = readFragment(TaskEditFieldsFragmentDoc, editTask);
  const deleteTaskData = readFragment(TaskEditFieldsFragmentDoc, deleteTask);

  const columns: GridColDef[] = [
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      valueGetter: (_value, row) =>
        readFragment(TaskListFieldsFragmentDoc, row as ListTask).description,
    },
    {
      field: 'control',
      headerName: 'Control',
      flex: 1,
      valueGetter: (_value, row) =>
        readFragment(TaskListFieldsFragmentDoc, row as ListTask).control.title,
    },
    {
      field: 'owner',
      headerName: 'Owner',
      flex: 1,
      valueGetter: (_value, row) =>
        readFragment(TaskListFieldsFragmentDoc, row as ListTask).owner.name,
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      flex: 1,
      valueGetter: (_value, row) =>
        readFragment(TaskListFieldsFragmentDoc, row as ListTask).dueDate as string,
      valueFormatter: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      field: 'completed',
      headerName: 'Status',
      width: 100,
      valueGetter: (_value, row) =>
        readFragment(TaskListFieldsFragmentDoc, row as ListTask).completed,
      valueFormatter: (value: boolean) => (value ? 'Done' : 'Open'),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit"
          label="Edit"
          showInMenu
          onClick={() => {
            setEditTask(row as EditTask);
          }}
        />,
        <GridActionsCellItem
          key="delete"
          label="Delete"
          showInMenu
          onClick={() => {
            setDeleteTask(row as EditTask);
          }}
        />,
      ],
    },
  ];

  function handleDeleteConfirm() {
    if (!deleteTask) {
      return;
    }
    const { id } = readFragment(TaskEditFieldsFragmentDoc, deleteTask);
    void deleteTaskMutation({
      variables: { id },
      optimisticResponse: { deleteTask: id },
    });
    setDeleteTask(undefined);
  }

  return (
    <PageContainer>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Tasks</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setCreateOpen(true);
          }}
        >
          Create Task
        </Button>
      </Stack>

      <DataGrid
        rows={data?.tasks ?? []}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        sx={{ height: 'auto' }}
      />

      <CreateTaskDialog
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
        }}
      />

      {editTask && (
        <EditTaskDialog
          key={editTaskData?.id}
          open={!!editTask}
          task={editTask}
          onClose={() => {
            setEditTask(undefined);
          }}
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteTask}
        title={`Delete "${deleteTaskData?.description ?? 'task'}"?`}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          setDeleteTask(undefined);
        }}
      />
    </PageContainer>
  );
}
