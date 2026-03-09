import { ApolloProvider } from '@apollo/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { client } from '@/apollo/client';
import ControlsDashboard from '@/components/ControlsDashboard';

const theme = createTheme();

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
