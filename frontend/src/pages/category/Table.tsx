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
import { FilterResetButton } from '../../components/Table/FilterResetButton'
import reducer, { INITIAL_STATE, Creators } from '../../store/search'

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
    const [totalRecords, setTotalRecords] = React.useState<number>(0)
    const [searchState, dispatch] = React.useReducer(reducer, INITIAL_STATE)
    //const [searchState, setSearchState] = React.useState<SearchState>(initialState)

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
                        search: cleanSearchText(searchState.search),
                        page: searchState.pagination.page,
                        per_page: searchState.pagination.per_page,
                        sort: searchState.order.sort,
                        dir: searchState.order.dir
                    }
                })
                if (subscribed.current) {
                    setData(data.data)
                    setTotalRecords(data.meta.total)
                    // setSearchState((prevState => ({
                    //     ...prevState,
                    //     pagination: {
                    //         ...prevState.pagination,
                    //         total: data.meta.total
                    //     }
                    // })))
                }
            } catch (error) {
                console.error(error)
                if (categoryHttp.isCancelledRequest(error)){
                    return
                }
                snackbar.enqueueSnackbar('Não foi possível carregar as informações.', {
                    variant: 'error'
                })
            } finally {
                setLoading(false)
            }
    }

    function cleanSearchText(text) {
        let newText = text
        if (text && text.value !== undefined) {
            newText = text.value
        }

        return newText
    }

    return (
        <DefaultTable 
            columns={columns}
            title=""
            data={data}
            loading={loading}
            debouncedSearchTime={500}
            options={{
                serverSide: true,
                searchText: searchState.search as any,
                page: searchState.pagination.page - 1,
                rowsPerPage: searchState.pagination.per_page,
                count: totalRecords,
                customToolbar: () => (
                    <FilterResetButton
                        handleClick={() => {
                           dispatch(Creators.setReset())
                        }}
                    />
                ),
                onSearchChange: (value) => dispatch(Creators.setSearch({search: value})),
                onChangePage:(page) => dispatch(Creators.setPage({page: page + 1})),
                onChangeRowsPerPage:(perPage) => dispatch(Creators.setPerPage({per_page: perPage})),
                onColumnSortChange: (changedColumn: string, direction: string) => dispatch(Creators.setOrder({
                    sort: changedColumn,
                    dir: direction.includes('desc') ? 'desc' : 'asc'
                }))
            }}
        />
    )
}

export default Table