import { Chip } from '@mui/material';
import type { ControlStatus } from '../graphql/__generated__/types';

const colorMap: Record<ControlStatus, 'success' | 'error' | 'default'> = {
  PASSING: 'success',
  FAILING: 'error',
  UNKNOWN: 'default',
};

interface Props {
  status: ControlStatus;
}

export default function StatusBadge({ status }: Props) {
  return <Chip label={status} color={colorMap[status]} size="small" />;
}
