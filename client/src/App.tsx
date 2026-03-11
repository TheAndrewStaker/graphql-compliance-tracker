import { ApolloProvider } from '@apollo/client/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { client } from '@/apollo/client';
import ControlsDashboard from '@/components/ControlsDashboard';

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
        <ControlsDashboard />
      </ThemeProvider>
    </ApolloProvider>
  );
}
