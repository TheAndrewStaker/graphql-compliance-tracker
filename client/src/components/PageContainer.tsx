import { Stack, type StackProps } from '@mui/material';

/**
 * Page-level layout wrapper. Applies responsive padding and consistent
 * vertical spacing between direct children so pages don't need mb/mt props.
 */
export default function PageContainer({ children, ...props }: StackProps) {
  return (
    <Stack
      spacing={2}
      sx={{ p: { xs: 2, sm: 3 }, ...props.sx }}
      {...props}
    >
      {children}
    </Stack>
  );
}
