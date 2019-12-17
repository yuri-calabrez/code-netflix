import React from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { Box, MuiThemeProvider, CssBaseline } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Breadcrumbs from './components/Breadcrumbs';
import theme from './theme';
import { SnackBarProvider } from './components/SnackBarProvider';


const App: React.FC = () => {
  return (
    <React.Fragment>
      <MuiThemeProvider theme={theme}>
        <SnackBarProvider>
          <CssBaseline/>
          <BrowserRouter>
            <Navbar/>
            <Box paddingTop={'80px'}>
              <Breadcrumbs/>
              <AppRouter/>
            </Box>
          </BrowserRouter>
        </SnackBarProvider>
      </MuiThemeProvider>
    </React.Fragment>
  );
}

export default App;
