import { Drawer, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DrawerContent from '@/components/DrawerContent';
import {ReactNode} from "react";

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function DrawerPanel({ title, open, onClose, children }: Props) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <DrawerContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose} size="small" aria-label="close">
            <CloseIcon />
          </IconButton>
        </Stack>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
