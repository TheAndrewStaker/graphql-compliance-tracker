import { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import { type Reference } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GetOwnersDocument,
  DeleteOwnerDocument,
  OwnerListFieldsFragmentDoc,
  OwnerEditFieldsFragmentDoc,
} from '@/graphql/__generated__/graphql';
import { useFragment as readFragment, type FragmentType } from '@/graphql/__generated__/fragment-masking';
import PageContainer from '@/components/PageContainer';
import CreateOwnerDialog from '@/components/CreateOwnerDialog';
import EditOwnerDialog from '@/components/EditOwnerDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

type ListOwner = FragmentType<typeof OwnerListFieldsFragmentDoc>;
type EditOwner = FragmentType<typeof OwnerEditFieldsFragmentDoc>;

export default function OwnersPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOwner, setEditOwner] = useState<EditOwner>();
  const [deleteOwner, setDeleteOwner] = useState<EditOwner>();

  const { data, loading } = useQuery(GetOwnersDocument);

  const [deleteOwnerMutation] = useMutation(DeleteOwnerDocument, {
    update(cache, { data: result }) {
      if (!result) { return; }
      const deletedId = result.deleteOwner;
      const taskIds: string[] = [];
      cache.modify({
        fields: {
          tasks(existingRefs: readonly Reference[] = [], { readField }) {
            return existingRefs.filter(ref => {
              const owner = readField('owner', ref) as Reference | undefined;
              if (owner && readField('id', owner) === deletedId) {
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
      cache.evict({ id: cache.identify({ __typename: 'Owner', id: deletedId }) });
      cache.gc();
    },
  });

  const editOwnerData = readFragment(OwnerEditFieldsFragmentDoc, editOwner);
  const deleteOwnerData = readFragment(OwnerEditFieldsFragmentDoc, deleteOwner);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (_value, row) => readFragment(OwnerListFieldsFragmentDoc, row as ListOwner).name,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      valueGetter: (_value, row) => readFragment(OwnerListFieldsFragmentDoc, row as ListOwner).email,
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
          onClick={() => setEditOwner(row as EditOwner)}
        />,
        <GridActionsCellItem
          key="delete"
          label="Delete"
          showInMenu
          onClick={() => setDeleteOwner(row as EditOwner)}
        />,
      ],
    },
  ];

  function handleDeleteConfirm() {
    if (!deleteOwner) { return; }
    const { id } = readFragment(OwnerEditFieldsFragmentDoc, deleteOwner);
    void deleteOwnerMutation({
      variables: { id },
      optimisticResponse: { deleteOwner: id },
    });
    setDeleteOwner(undefined);
  }

  return (
    <PageContainer>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Owners</Typography>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>Create Owner</Button>
      </Stack>

      <DataGrid
        rows={data?.owners ?? []}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        sx={{ height: 'auto' }}
      />

      <CreateOwnerDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      {editOwner && (
        <EditOwnerDialog
          key={editOwnerData?.id}
          open={!!editOwner}
          owner={editOwner}
          onClose={() => setEditOwner(undefined)}
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteOwner}
        title={`Delete ${deleteOwnerData?.name ?? 'this owner'}?`}
        warning="Any tasks assigned to them will also be deleted."
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteOwner(undefined)}
      />
    </PageContainer>
  );
}
