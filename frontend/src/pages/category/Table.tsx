import * as React from 'react'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import categoryHttp from '../../util/http/category-http'
import { BadgeYes, BadgeNo } from '../../components/Badge'
import { ListResponse, Category } from '../../util/models'
import DefaultTable, { TableColumn } from '../../components/Table'
import { useSnackbar } from 'notistack'
import { IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { FilterResetButton } from '../../components/Table/FilterResetButton'
import { Creators } from '../../store/filter'
import { Link } from 'react-router-dom'
import useFilter from '../../hooks/useFilter'

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
            customBodyRender: (value, tableMeta) => {
                return (
                    <IconButton
                        color={'secondary'}
                        component={Link}
                        to={`/categories/${tableMeta.rowData[0]}/edit`}
                    >
                        <EditIcon/>
                    </IconButton>
                )
            }
        }
    }
]

const Table = () => {

    const snackbar = useSnackbar()
    const subscribed = React.useRef(true)
    const [data, setData] = React.useState<Category[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const {
        filterState,
        dispatch,
        totalRecords,
        setTotalRecords} = useFilter()

    const columns = columnsDefinition.map(column => {
        return column.name === filterState.order.sort
        ? {
            ...column,
            options: {
                ...column.options,
                sortDirection: filterState.order.dir as any
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
        filterState.search,
        filterState.pagination.page,
        filterState.pagination.per_page,
        filterState.order
    ])

    async function getData() {
        setLoading(true)
            try {
                const {data} = await categoryHttp.list<ListResponse<Category>>({
                    queryParams: {
                        search: cleanSearchText(filterState.search),
                        page: filterState.pagination.page,
                        per_page: filterState.pagination.per_page,
                        sort: filterState.order.sort,
                        dir: filterState.order.dir
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
                searchText: filterState.search as any,
                page: filterState.pagination.page - 1,
                rowsPerPage: filterState.pagination.per_page,
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