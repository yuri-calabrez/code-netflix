import * as React from 'react'
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import castMemberHttp from '../../util/http/cast-member-http'
import { CastMember, ListResponse } from '../../util/models'
import DefaultTable, { TableColumn } from '../../components/Table'
import { useSnackbar } from 'notistack'

type castMemberType = {
    [key: number]: string
}

const castType: castMemberType = {
    1: 'Diretor',
    2: 'Ator'
}

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
        name: 'type',
        label: 'Tipo',
        width: '5%',
        options: {
            customBodyRender(value, tableMeta, updateValue) {   
            return castType[value] !== undefined ? <span>{castType[value]}</span> : '-'
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
        width: '12%'
    }
]

const Table = () => {

    const snackbar = useSnackbar()
    const [data, setData] = React.useState<CastMember[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)

    React.useEffect(() => {
        let isSubscribed = true;

        (async () => {
            setLoading(true)
            try {
                const {data} = await castMemberHttp.list<ListResponse<CastMember>>()
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