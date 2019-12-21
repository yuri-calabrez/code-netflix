import * as React from 'react'
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import categoryHttp from '../../util/http/category-http'
import { BadgeYes, BadgeNo } from '../../components/Badge'
import { ListResponse, Category } from '../../util/models'

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

    const [data, setData] = React.useState<Category[]>([])

    React.useEffect(() => {
        let isSubscribed = true;

        (async () => {
            const {data} = await categoryHttp.list<ListResponse<Category>>()
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
            title="Listagem de categoria"
            data={data}
        />
    )
}

export default Table