import { ApolloProvider } from '@apollo/client/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { client } from '@/apollo/client';
import NavBar from '@/components/NavBar';
import ControlsDashboard from '@/components/ControlsDashboard';
import OwnersPage from '@/components/OwnersPage';
import TasksPage from '@/components/TasksPage';
import React from 'react';

const theme = createTheme({
  typography: {
    fontFamily: '"Figtree", sans-serif',
  },
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar />
        <Routes>
          <Route path="/" element={<ControlsDashboard />} />
          <Route path="/owners" element={<OwnersPage />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Routes>
      </ThemeProvider>
    </ApolloProvider>
  );
}
