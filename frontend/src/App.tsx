import React from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { Box, MuiThemeProvider, CssBaseline } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Breadcrumbs from './components/Breadcrumbs';
import theme from './theme';
import { SnackBarProvider } from './components/SnackBarProvider';
import Spinner from './components/Spinner';
import { LoadingProvider } from './components/loading/LoadigProvider';


const App: React.FC = () => {
  return (
    <React.Fragment>
      <LoadingProvider>
        <MuiThemeProvider theme={theme}>
          <SnackBarProvider>
            <CssBaseline/>
            <BrowserRouter basename="/admin">
              <Spinner/>
              <Navbar/>
              <Box paddingTop={'80px'}>
                <Breadcrumbs/>
                <AppRouter/>
              </Box>
            </BrowserRouter>
          </SnackBarProvider>
        </MuiThemeProvider>
      </LoadingProvider>
    </React.Fragment>
  );
}

export default App;
