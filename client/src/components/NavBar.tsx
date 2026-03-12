import { AppBar, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const TABS = [
  { label: 'Controls', path: '/' },
  { label: 'Owners', path: '/owners' },
  { label: 'Tasks', path: '/tasks' },
];

export default function NavBar() {
  const { pathname } = useLocation();
  const currentTab = TABS.find((t) => t.path === pathname)?.path ?? '/';

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Compliance Tracker
        </Typography>
        <Tabs value={currentTab} textColor="inherit" indicatorColor="secondary">
          {TABS.map(({ label, path }) => (
            <Tab key={path} label={label} value={path} component={Link} to={path} />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
