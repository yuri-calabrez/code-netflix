import * as React from 'react'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import castMemberHttp from '../../util/http/cast-member-http'
import { CastMember, ListResponse, CastMemberTypeMap } from '../../util/models'
import DefaultTable, { TableColumn, MuiDataTableRefComponent } from '../../components/Table'
import { useSnackbar } from 'notistack'
import useFilter from '../../hooks/useFilter'
import { FilterResetButton } from '../../components/Table/FilterResetButton'
import { IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { Link } from 'react-router-dom'
import * as yup from '../../util/vendor/yup'

const castMemberNames = Object.values(CastMemberTypeMap)


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
            return CastMemberTypeMap[value] !== undefined ? <span>{CastMemberTypeMap[value]}</span> : '-'
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
        width: '12%',
        options: {
            sort: false,
            customBodyRender: (value, tableMeta) => {
                return (
                    <IconButton
                        color={'secondary'}
                        component={Link}
                        to={`/cast-members/${tableMeta.rowData[0]}/edit`}
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
    const [data, setData] = React.useState<CastMember[]>([])
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
            tableRef,
            extraFilter: {
                createValidationSchema: () => {
                    return yup.object().shape({
                        type: yup.string()
                            .nullable()
                            .transform(value => !value || castMemberNames.includes(value) ? undefined : value)
                            .default(null)
                    })
                },
                formatSearchParams: (debouncedFilterState) => {
                    return debouncedFilterState.extraFilter ? {
                        ...(
                            debouncedFilterState.extraFilter.type && {
                                type: debouncedFilterState.extraFilter.type
                            }
                        ) 
                    } : undefined
                },
                getStateFromUrl: (queryParams) => {
                    return {
                        type: queryParams.get('type')
                    }
                }
            }
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
                const {data} = await castMemberHttp.list<ListResponse<CastMember>>({
                    queryParams: {
                        search: filterManager.cleanSearchText(filterState.search),
                        page: filterState.pagination.page,
                        per_page: filterState.pagination.per_page,
                        sort: filterState.order.sort,
                        dir: filterState.order.dir
                    }
                })
                if (subscribed.current) {
                    setData(data.data)
                    setTotalRecords(data.meta.total)
                }
            } catch (error) {
                console.error(error)
                if (castMemberHttp.isCancelledRequest(error)) {
                    snackbar.enqueueSnackbar('Não foi possível carregar as informações.', {
                        variant: 'error'
                    })
                }
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