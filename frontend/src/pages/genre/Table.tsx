import * as React from 'react'
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables'
import { httpVideo } from '../../util/http'
import { Chip } from '@material-ui/core'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: 'name',
        label: 'Nome'
    },
    {
        name: 'is_active',
        label: 'Ativo?',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <Chip label="Sim" color="primary"/> : <Chip label="Não" color="secondary"/>
            }
        }
    },
    {
        name: 'categories',
        label: 'Categorias',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value.map(value => value.name).join(', ')
            }
        }
    },
    {
        name: 'created_at',
        label: 'Criado em',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
            return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
            }
        }
    }
]

const Table = () => {

    const [data, setData] = React.useState([])

    React.useEffect(() => {
        httpVideo.get('genres')
            .then(response => setData(response.data.data))
    }, [])

    return (
        <MUIDataTable 
            columns={columnsDefinition}
            title="Listagem de gêneros"
            data={data}
        />
    )
}

export default Table