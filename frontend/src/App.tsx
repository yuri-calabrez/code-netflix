import React from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { Page } from './components/Page';
import { Box } from '@material-ui/core';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Navbar/>
      <Box paddingTop={'80px'}>
        <Page title={'Categorias'}>Conteúdo aqui</Page>
      </Box>
    </React.Fragment>
  );
}

export default App;
