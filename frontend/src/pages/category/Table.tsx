import * as React from 'react'
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables'
import { httpVideo } from '../../util/http'

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: 'name',
        label: 'Nome'
    },
    {
        name: 'is_active',
        label: 'Ativo?'
    },
    {
        name: 'created_at',
        label: 'Criado em'
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
            .then(response => response.data.data)
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