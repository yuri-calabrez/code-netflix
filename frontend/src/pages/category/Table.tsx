import * as React from 'react'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import categoryHttp from '../../util/http/category-http'
import { BadgeYes, BadgeNo } from '../../components/Badge'
import { ListResponse, Category } from '../../util/models'
import DefaultTable, { TableColumn } from '../../components/Table'
import { useSnackbar } from 'notistack'
import { IconButton, Link } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'

interface Pagination {
    page: number
    total: number
    per_page: number
}

interface Order {
    sort: string | null
    dir: string | null
}

interface SearchState {
    search: string
    pagination: Pagination
    order: Order
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
        width: '13%',
        options: {
            sort: false,
            customBodyRender: (value, tableMeta, updateValue) => {
                /*return (
                    <IconButton
                        color='secondary'
                        component={Link}
                        to={`/categories/${tableMeta.rowData[0]}/edit`}
                    >
                        <EditIcon/>
                    </IconButton>
                )*/
                return 'botão aqui'
            }
        }
    }
]

const Table = () => {

    const snackbar = useSnackbar()
    const subscribed = React.useRef(true)
    const [data, setData] = React.useState<Category[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [searchState, setSearchState] = React.useState<SearchState>({
            search: '',
            pagination: {
                page: 1,
                total: 0,
                per_page: 10
            },
            order: {
                sort: null,
                dir: null
            }
        })

    const columns = columnsDefinition.map(column => {
        return column.name === searchState.order.sort
        ? {
            ...column,
            options: {
                ...column.options,
                sortDirection: searchState.order.dir as any
            }
        }
        : column
    })

    React.useEffect(() => {
        subscribed.current = true
        getData()
        return () => {
            subscribed.current = false
        }
    }, [
        searchState.search,
        searchState.pagination.page,
        searchState.pagination.per_page,
        searchState.order
    ])

    async function getData() {
        setLoading(true)
            try {
                const {data} = await categoryHttp.list<ListResponse<Category>>({
                    queryParams: {
                        search: searchState.search,
                        page: searchState.pagination.page,
                        per_page: searchState.pagination.per_page,
                        sort: searchState.order.sort,
                        dir: searchState.order.dir
                    }
                })
                if (subscribed.current) {
                    setData(data.data)
                    setSearchState((prevState => ({
                        ...prevState,
                        pagination: {
                            ...prevState.pagination,
                            total: data.meta.total
                        }
                    })))
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
            columns={columns}
            title=""
            data={data}
            loading={loading}
            options={{
                serverSide: true,
                searchText: searchState.search,
                page: searchState.pagination.page - 1,
                rowsPerPage: searchState.pagination.per_page,
                count: searchState.pagination.total,
                onSearchChange: (value) => setSearchState((prevState => ({
                    ...prevState,
                    search: value
                }))),
                onChangePage:(page) => setSearchState((prevState => ({
                    ...prevState,
                    pagination: {
                        ...prevState.pagination,
                        page: page + 1
                    }
                }))),
                onChangeRowsPerPage:(perPage) => setSearchState((prevState => ({
                    ...prevState,
                    pagination: {
                        ...prevState.pagination,
                        per_page: perPage
                    }
                }))),
                onColumnSortChange: (changedColumn: string, direction: string) => setSearchState((prevState => ({
                    ...prevState,
                    order: {
                       sort: changedColumn,
                        dir: direction.includes('desc') ? 'desc' : 'asc'
                    }
                })))
            }}
        />
    )
}

export default Table