import * as React from 'react'
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables'
import { Chip } from '@material-ui/core'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import categoryHttp from '../../util/http/category-http'

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

const Table = () => {

    const [data, setData] = React.useState([])

    React.useEffect(() => {
        categoryHttp
            .list()
            .then(({data}) => setData(data.data))
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