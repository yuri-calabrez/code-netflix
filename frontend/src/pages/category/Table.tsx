import * as React from 'react'
import { MUIDataTableColumn } from 'mui-datatables'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import categoryHttp from '../../util/http/category-http'
import { BadgeYes, BadgeNo } from '../../components/Badge'
import { ListResponse, Category } from '../../util/models'
import DefaultTable, { TableColumn } from '../../components/Table'
import { useSnackbar } from 'notistack'

const columnsDefinition: TableColumn[] = [
    {
        name: "id",
        label: "ID",
        width: '30%',
        options: {
            sort: false
        }
    },
    {
        name: 'name',
        label: 'Nome',
        width: '43%'
    },
    {
        name: 'is_active',
        label: 'Ativo?',
        width: '4%',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <BadgeYes/> : <BadgeNo/>
            }
        }
    },
    {
        name: 'created_at',
        label: 'Criado em',
        width: '10%',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
            return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
            }
        }
    },
    {
        name: 'actions',
        label: 'Ações',
        width: '13%'
    }
]

const Table = () => {

    const snackbar = useSnackbar()
    const [data, setData] = React.useState<Category[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)

    React.useEffect(() => {
        let isSubscribed = true;

        (async () => {
            setLoading(true)
            try {
                const {data} = await categoryHttp.list<ListResponse<Category>>()
                if (isSubscribed) {
                    setData(data.data)
                }
            } catch (error) {
                console.error(error)
                snackbar.enqueueSnackbar('Não foi possível carregar as informações.', {
                    variant: 'error'
                })
            } finally {
                setLoading(false)
            }
        })()

        return () => {
            isSubscribed = false
        }
    }, [])

    return (
        <DefaultTable 
            columns={columnsDefinition}
            title=""
            data={data}
            loading={loading}
        />
    )
}

export default Table