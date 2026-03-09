import { Box, styled } from '@mui/material';

/**
 * Wraps page-level content with responsive padding.
 * Tighter on mobile (16px), roomier on sm+ (24px).
 */
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
}));

export default PageContainer;
