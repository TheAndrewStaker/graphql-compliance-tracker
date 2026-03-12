import { useState } from 'react';
import { Button, Stack, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridActionsCellItem, type GridColDef, type GridRowParams } from '@mui/x-data-grid';
import { type Reference } from '@apollo/client';
import StatusBadge from '@/components/StatusBadge';
import TaskDrawer from '@/components/TaskDrawer';
import PageContainer from '@/components/PageContainer';
import CreateControlDialog from '@/components/CreateControlDialog';
import EditControlDialog from '@/components/EditControlDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GetControlsDocument,
  DeleteControlDocument,
  ControlListFieldsFragmentDoc,
  ControlEditFieldsFragmentDoc,
  type ControlStatus,
} from '@/graphql/__generated__/graphql';
import { useFragment as readFragment, type FragmentType } from '@/graphql/__generated__/fragment-masking';

type StatusFilter = ControlStatus | 'ALL';
type ListControl = FragmentType<typeof ControlListFieldsFragmentDoc>;
type EditControl = FragmentType<typeof ControlEditFieldsFragmentDoc>;

export default function ControlsDashboard() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedControlId, setSelectedControlId] = useState<string>();
  const [createOpen, setCreateOpen] = useState(false);
  const [editControl, setEditControl] = useState<EditControl>();
  const [deleteControl, setDeleteControl] = useState<EditControl>();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, loading } = useQuery(GetControlsDocument);

  const [deleteControlMutation] = useMutation(DeleteControlDocument, {
    update(cache, { data: result }) {
      if (!result) { return; }
      const deletedId = result.deleteControl;
      const taskIds: string[] = [];
      cache.modify({
        fields: {
          tasks(existingRefs: readonly Reference[] = [], { readField }) {
            return existingRefs.filter(ref => {
              const control = readField('control', ref) as Reference | undefined;
              if (control && readField('id', control) === deletedId) {
                const id = readField('id', ref) as string | undefined;
                if (id) { taskIds.push(id); }
                return false;
              }
              return true;
            });
          },
        },
      });
      for (const id of taskIds) {
        cache.evict({ id: cache.identify({ __typename: 'Task', id }) });
      }
      cache.evict({ id: cache.identify({ __typename: 'Control', id: deletedId }) });
      cache.gc();
    },
  });

  const editControlData = readFragment(ControlEditFieldsFragmentDoc, editControl);
  const deleteControlData = readFragment(ControlEditFieldsFragmentDoc, deleteControl);

  const rows = (data?.controls ?? []).filter(
    (c) => statusFilter === 'ALL' || readFragment(ControlListFieldsFragmentDoc, c as ListControl).status === statusFilter
  );

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
      valueGetter: (_value, row) => readFragment(ControlListFieldsFragmentDoc, row as ListControl).title,
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      valueGetter: (_value, row) => readFragment(ControlListFieldsFragmentDoc, row as ListControl).category,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      valueGetter: (_value, row) => readFragment(ControlListFieldsFragmentDoc, row as ListControl).status,
      renderCell: ({ value }) => <StatusBadge status={value as ControlStatus} />,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      getActions: ({ row }: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          label="Edit"
          showInMenu
          onClick={() => setEditControl(row as EditControl)}
        />,
        <GridActionsCellItem
          key="delete"
          label="Delete"
          showInMenu
          onClick={() => setDeleteControl(row as EditControl)}
        />,
      ],
    },
  ];

  function handleDeleteConfirm() {
    if (!deleteControl) { return; }
    const { id } = readFragment(ControlEditFieldsFragmentDoc, deleteControl);
    void deleteControlMutation({
      variables: { id },
      optimisticResponse: { deleteControl: id },
    });
    setDeleteControl(undefined);
  }

  return (
    <PageContainer>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Compliance Controls</Typography>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>Create Control</Button>
      </Stack>

      <ToggleButtonGroup
        value={statusFilter}
        exclusive
        onChange={(_, val) => val && setStatusFilter(val)}
        size="small"
        sx={{ flexWrap: 'wrap' }}
      >
        <ToggleButton value="ALL">All</ToggleButton>
        <ToggleButton value="PASSING">Passing</ToggleButton>
        <ToggleButton value="FAILING">Failing</ToggleButton>
        <ToggleButton value="UNKNOWN">Unknown</ToggleButton>
      </ToggleButtonGroup>

      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        onRowClick={({ id }) => setSelectedControlId(String(id))}
        columnVisibilityModel={{ category: !isMobile }}
        sx={{ height: 'auto', cursor: 'pointer' }}
      />

      <CreateControlDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      {editControl && (
        <EditControlDialog
          key={editControlData?.id}
          open={!!editControl}
          control={editControl}
          onClose={() => setEditControl(undefined)}
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteControl}
        title={`Delete "${deleteControlData?.title ?? 'control'}"?`}
        warning="Any tasks assigned to this control will also be deleted."
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteControl(undefined)}
      />

      <TaskDrawer
        controlId={selectedControlId}
        onClose={() => setSelectedControlId(undefined)}
      />
    </PageContainer>
  );
}
