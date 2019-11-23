import * as React from 'react'
import { Page } from '../../components/Page'
import { Fab, Box } from '@material-ui/core'
import { Link } from 'react-router-dom'
import AddIcon from "@material-ui/icons/Add"
import Table from './Table'

const PageList = () => {

    return (
       <Page title="Listagem gêneros">
           <Box dir="rtl">
            <Fab 
                title="Adicionar gênero" 
                size="small" 
                component={Link} 
                to="/genres/create"
            >
                <AddIcon/>
            </Fab>
           </Box>
           <Box>
               <Table/>
           </Box>
       </Page>
    )
}

export default PageList