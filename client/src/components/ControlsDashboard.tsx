import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import StatusBadge from '@/components/StatusBadge';
import TaskDrawer from '@/components/TaskDrawer';
import PageContainer from '@/components/PageContainer';
import {
  useGetControlsQuery,
  type ControlStatus,
} from '@/graphql/__generated__/types';

type StatusFilter = ControlStatus | 'ALL';

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Title', flex: 2 },
  { field: 'category', headerName: 'Category', flex: 1 },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1,
    renderCell: ({ value }) => <StatusBadge status={value as ControlStatus} />,
  },
];

export default function ControlsDashboard() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedControlId, setSelectedControlId] = useState<string>();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, loading } = useGetControlsQuery();

  const rows = (data?.controls ?? []).filter(
    (c) => statusFilter === 'ALL' || c.status === statusFilter
  );

  return (
    <PageContainer>
      <Typography variant="h5" gutterBottom>
        Compliance Controls
      </Typography>

      <ToggleButtonGroup
        value={statusFilter}
        exclusive
        onChange={(_, val) => val && setStatusFilter(val)}
        size="small"
        sx={{ mb: 2, flexWrap: 'wrap' }}
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

      <TaskDrawer
        controlId={selectedControlId}
        onClose={() => setSelectedControlId(undefined)}
      />
    </PageContainer>
  );
}
