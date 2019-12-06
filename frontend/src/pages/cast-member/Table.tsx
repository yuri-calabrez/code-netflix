import * as React from 'react'
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import castMemberHttp from '../../util/http/cast-member-http'

type castMemberType = {
    [key: number]: string
}

const castType: castMemberType = {
    1: 'Diretor',
    2: 'Ator'
}

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: 'name',
        label: 'Nome'
    },
    {
        name: 'type',
        label: 'Tipo',
        options: {
            customBodyRender(value, tableMeta, updateValue) {   
            return castType[value] !== undefined ? <span>{castType[value]}</span> : '-'
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
        castMemberHttp
            .list()
            .then(({data}) => setData(data.data))
    }, [])

    return (
        <MUIDataTable 
            columns={columnsDefinition}
            title="Listagem de membros de elenco"
            data={data}
        />
    )
}

export default Table