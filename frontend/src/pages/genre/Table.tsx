import * as React from 'react'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import { BadgeYes, BadgeNo } from '../../components/Badge'
import genreHttp from '../../util/http/genre-http'
import { Genre, ListResponse } from '../../util/models'
import DefaultTable, { TableColumn } from '../../components/Table'
import { useSnackbar } from 'notistack'

interface SearchState {
    search: string
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
        width: '20%'
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
        name: 'categories',
        label: 'Categorias',
        width: '30%',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value.map(value => value.name).join(', ')
            }
        }
    },
    {
        name: 'created_at',
        label: 'Criado em',
        width: '7%',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
            return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
            }
        }
    },
    {
        name: 'actions',
        label: 'Ações',
        width: '8%'
    }
]

const Table = () => {

    const snackbar = useSnackbar()
    const subscribed = React.useRef(true)
    const [data, setData] = React.useState<Genre[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [searchState, setSearchState] = React.useState<SearchState>({search: ''})

    React.useEffect(() => {
        subscribed.current = true
        getData()
        return () => {
            subscribed.current = false
        }
    }, [searchState])

    async function getData() {
        setLoading(true)
            try {
                const {data} = await genreHttp.list<ListResponse<Genre>>({
                    queryParams: {
                        search: searchState.search
                    }
                })
                if (subscribed.current) {
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
    }

    return (
        <DefaultTable 
            columns={columnsDefinition}
            title=""
            data={data}
            loading={loading}
            options={{
                searchText: searchState.search,
                onSearchChange: (value) => setSearchState({search: value})
            }}
        />
    )
}

export default Table