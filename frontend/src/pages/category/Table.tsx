import * as React from 'react'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import categoryHttp from '../../util/http/category-http'
import { BadgeYes, BadgeNo } from '../../components/Badge'
import { ListResponse, Category } from '../../util/models'
import DefaultTable, { TableColumn, MuiDataTableRefComponent } from '../../components/Table'
import { useSnackbar } from 'notistack'
import { IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { FilterResetButton } from '../../components/Table/FilterResetButton'
import { Link } from 'react-router-dom'
import useFilter from '../../hooks/useFilter'
import useDeleteCollection from '../../hooks/useDeleteCollection'
import DeleteDialog from '../../components/DeleteDialog'
import LoadingContext from '../../components/loading/LoadigContext'
import { useKeycloak } from '@react-keycloak/web'

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

const debounceTime = 300
const debouncedSearchTime = 300
const rowsPerPage = 15
const rowsPerPageOptions =  [10, 25, 50]

const Table = () => {

    const {enqueueSnackbar} = useSnackbar()
    const subscribed = React.useRef(true)
    const [data, setData] = React.useState<Category[]>([])
    const loading = React.useContext(LoadingContext)
    const {openDeleteDialog, setOpenDeleteDialog, rowsToDelete, setRowsToDelete} = useDeleteCollection()
    const tableRef = React.useRef() as React.MutableRefObject<MuiDataTableRefComponent>

    const {
        columns,
        cleanSearchText,
        filterManager,
        filterState,
        debouncedFilterState,
        totalRecords,
        setTotalRecords} = useFilter({
            columns: columnsDefinition,
            debounceTime: debounceTime,
            rowsPerPage,
            rowsPerPageOptions,
            tableRef
        })

    const searchText = cleanSearchText(debouncedFilterState.search)
    const getData = React.useCallback(async ({search, page, per_page, sort, dir}) => {
        try {
            const {data} = await categoryHttp.list<ListResponse<Category>>({
                queryParams: {
                    search,
                    page,
                    per_page,
                    sort,
                    dir
                }
            })
            if (subscribed.current) {
                setData(data.data)
                setTotalRecords(data.meta.total)
                if (openDeleteDialog) {
                    setOpenDeleteDialog(false)
                }
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
            enqueueSnackbar('Não foi possível carregar as informações.', {
                variant: 'error'
            })
        }
    }, [enqueueSnackbar, setTotalRecords])

    React.useEffect(() => {
        subscribed.current = true
        getData({
            search: searchText,
            page: debouncedFilterState.pagination.page,
            per_page: debouncedFilterState.pagination.per_page,
            sort: debouncedFilterState.order.sort,
            dir: debouncedFilterState.order.dir,
        })
        return () => {
            subscribed.current = false
        }
    }, [
        getData,
        searchText,
        debouncedFilterState.pagination.page,
        debouncedFilterState.pagination.per_page,
        debouncedFilterState.order
    ])


    function deleteRows(confirmed: boolean) {
        if (!confirmed) {
            setOpenDeleteDialog(false)
            return
        }

        const ids = rowsToDelete
            .data
            .map(value => data[value.index].id)
            .join(',')
        
        categoryHttp
            .deleteCollection({ids})
            .then(response => {
                enqueueSnackbar('Registros excluidos com sucesso!', {
                    variant: 'success'
                })
                if (rowsToDelete.data.length === filterState.pagination.per_page && filterState.pagination.page > 1) {
                    const page = filterState.pagination.page - 2
                    filterManager.changePage(page)
                } else {
                    getData({
                        search: searchText,
                        page: debouncedFilterState.pagination.page,
                        per_page: debouncedFilterState.pagination.per_page,
                        sort: debouncedFilterState.order.sort,
                        dir: debouncedFilterState.order.dir,
                    })
                }
            })
            .catch(error => {
                console.error(error)
                enqueueSnackbar('Não foi possível excluir os registros', {
                    variant: 'error'
                })
            })
    }

    return (
        <>
            <DeleteDialog open={openDeleteDialog} handleClose={deleteRows}/>
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
                    onColumnSortChange: (changedColumn: string, direction: string) => filterManager.changeColumnSort(changedColumn, direction),
                    onRowsDelete: (rowsDeleted: any[]) => {
                        setRowsToDelete(rowsDeleted as any)
                        return false
                    }
                }}
            />
        </>
    )
}

export default Table