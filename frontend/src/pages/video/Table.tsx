import * as React from 'react'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import categoryHttp from '../../util/http/category-http'
import { BadgeYes, BadgeNo } from '../../components/Badge'
import { ListResponse, Category, Video } from '../../util/models'
import DefaultTable, { TableColumn, MuiDataTableRefComponent } from '../../components/Table'
import { useSnackbar } from 'notistack'
import { IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { FilterResetButton } from '../../components/Table/FilterResetButton'
import { Link } from 'react-router-dom'
import useFilter from '../../hooks/useFilter'
import videoHttp from '../../util/http/video-http'

const columnsDefinition: TableColumn[] = [
    {
        name: "id",
        label: "ID",
        width: '30%',
        options: {
            sort: false,
            filter: false
        }
    },
    {
        name: 'title',
        label: 'Título',
        width: '20%'
    },
    {
        name: 'genres',
        label: 'Gêneros',
        width: '13%',
        options: {
            sort:false,
            filter: false,
            customBodyRender(value, tableMeta, updateValue) {
                return value.map(value => value.name).join(', ')
            }
        }
    },
    {
        name: 'categories',
        label: 'Categorias',
        width: '12%',
        options: {
            sort:false,
            filter: false,
            customBodyRender(value, tableMeta, updateValue) {
                return value.map(value => value.name).join(', ')
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
                        to={`/videos/${tableMeta.rowData[0]}/edit`}
                    >
                        <EditIcon/>
                    </IconButton>
                )
            }
        }
    }
]

const debounceTime = 300
const debouncedSearchTime = 300
const rowsPerPage = 15
const rowsPerPageOptions =  [10, 25, 50]

const Table = () => {

    const snackbar = useSnackbar()
    const subscribed = React.useRef(true)
    const [data, setData] = React.useState<Video[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const tableRef = React.useRef() as React.MutableRefObject<MuiDataTableRefComponent>

    const {
        columns,
        filterManager,
        filterState,
        debouncedFilterState,
        dispatch,
        totalRecords,
        setTotalRecords} = useFilter({
            columns: columnsDefinition,
            debounceTime: debounceTime,
            rowsPerPage,
            rowsPerPageOptions,
            tableRef
        })

    React.useEffect(() => {
        subscribed.current = true
        filterManager.pushHistory()
        getData()
        return () => {
            subscribed.current = false
        }
    }, [
        filterManager.cleanSearchText(debouncedFilterState.search),
        debouncedFilterState.pagination.page,
        debouncedFilterState.pagination.per_page,
        debouncedFilterState.order
    ])

    async function getData() {
        setLoading(true)
            try {
                const {data} = await videoHttp.list<ListResponse<Video>>({
                    queryParams: {
                        search: filterManager.cleanSearchText(debouncedFilterState.search),
                        page: debouncedFilterState.pagination.page,
                        per_page: debouncedFilterState.pagination.per_page,
                        sort: debouncedFilterState.order.sort,
                        dir: debouncedFilterState.order.dir
                    }
                })
                if (subscribed.current) {
                    setData(data.data)
                    setTotalRecords(data.meta.total)
                }
            } catch (error) {
                console.error(error)
                if (videoHttp.isCancelledRequest(error)){
                    return
                }
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
            debouncedSearchTime={debouncedSearchTime}
            ref={tableRef}
            options={{
                serverSide: true,
                searchText: filterState.search as any,
                page: filterState.pagination.page - 1,
                rowsPerPage: filterState.pagination.per_page,
                count: totalRecords,
                rowsPerPageOptions,
                customToolbar: () => (
                    <FilterResetButton
                        handleClick={() => {
                           filterManager.resetFilter()
                        }}
                    />
                ),
                onSearchChange: (value) => filterManager.changeSearch(value),
                onChangePage:(page) => filterManager.changePage(page),
                onChangeRowsPerPage:(perPage) => filterManager.changeRowsPerPage(perPage),
                onColumnSortChange: (changedColumn: string, direction: string) => filterManager.changeColumnSort(changedColumn, direction)
            }}
        />
    )
}

export default Table