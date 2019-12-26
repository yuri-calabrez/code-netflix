import * as React from 'react'
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import { BadgeYes, BadgeNo } from '../../components/Badge'
import genreHttp from '../../util/http/genre-http'
import { Genre, ListResponse } from '../../util/models'

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
                return value ? <BadgeYes/> : <BadgeNo/>
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

    const [data, setData] = React.useState<Genre[]>([])

    React.useEffect(() => {
        let isSubscribed = true;

        (async () => {
            const {data} = await genreHttp.list<ListResponse<Genre>>()
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
            title="Listagem de gêneros"
            data={data}
        />
    )
}

export default Table