import * as React from 'react'
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import castMemberHttp from '../../util/http/cast-member-http'
import { CastMember, ListResponse } from '../../util/models'

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

    const [data, setData] = React.useState<CastMember[]>([])

    React.useEffect(() => {
        let isSubscribed = true;

        (async () => {
            const {data} = await castMemberHttp.list<ListResponse<CastMember>>()
            if (isSubscribed) {
                setData(data.data)
            }
        })()

        return () => {
            isSubscribed = false
        }
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