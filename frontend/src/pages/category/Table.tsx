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
        name: 'created_at',
        label: 'Criado em',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
            return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
            }
        }
    }
]

const data = [
    {name: 'test1', is_active: true, created_at: '2019-11-15'},
    {name: 'test2', is_active: false, created_at: '2019-11-16'},
    {name: 'test3', is_active: true, created_at: '2019-11-17'},
    {name: 'test4', is_active: false, created_at: '2019-11-18'},
]

const Table = () => {

    const [data, setData] = React.useState([])

    React.useEffect(() => {
        httpVideo.get('categories')
            .then(response => setData(response.data.data))
    }, [])

    return (
        <MUIDataTable 
            columns={columnsDefinition}
            title="Listagem de categoria"
            data={data}
        />
    )
}

export default Table