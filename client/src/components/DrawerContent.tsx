import { Box, styled } from '@mui/material';

/**
 * Sizes the inner content area of a right-anchored MUI Drawer.
 * Full-viewport width on mobile so the drawer isn't clipped;
 * fixed 400px on sm+ where there is enough horizontal space.
 */
const DrawerContent = styled(Box)(({ theme }) => ({
  width: '100vw',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    width: 400,
    padding: theme.spacing(3),
  },
}));

export default DrawerContent;
