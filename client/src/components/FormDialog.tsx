import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  open: boolean;
  title: string;
  submitLabel?: string;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
}

export default function FormDialog({
  open,
  title,
  submitLabel = 'Save',
  onClose,
  onSubmit,
  children,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box
        component="form"
        noValidate
        onSubmit={e => { e.preventDefault(); onSubmit(); }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">{submitLabel}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
