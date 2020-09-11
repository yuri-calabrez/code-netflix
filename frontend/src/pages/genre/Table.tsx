import * as React from 'react'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import { BadgeYes, BadgeNo } from '../../components/Badge'
import genreHttp from '../../util/http/genre-http'
import { Genre, ListResponse, Category } from '../../util/models'
import DefaultTable, { TableColumn, MuiDataTableRefComponent } from '../../components/Table'
import { useSnackbar } from 'notistack'
import { IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { Link } from 'react-router-dom'
import useFilter from '../../hooks/useFilter'
import { FilterResetButton } from '../../components/Table/FilterResetButton'
import * as yup from '../../util/vendor/yup'
import categoryHttp from '../../util/http/category-http'
import useDeleteCollection from '../../hooks/useDeleteCollection'
import DeleteDialog from '../../components/DeleteDialog'
import LoadingContext from '../../components/loading/LoadigContext'



const columnsDefinition: TableColumn[] = [
    {
        name: "id",
        label: "ID",
        width: '30%',
        options: {
            sort: false,
        }
    },
    {
        name: 'name',
        label: 'Nome',
        width: '20%',
        options: {
            filter: false
        }
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
            filterType: "multiselect",
            filterOptions: {
                names: []
            },
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
            },
            filter: false
        }
    },
    {
        name: 'actions',
        label: 'Ações',
        width: '8%',
        options: {
            sort: false,
            filter: false,
            customBodyRender: (value, tableMeta) => {
                return (
                    <IconButton
                        color={'secondary'}
                        component={Link}
                        to={`/genres/${tableMeta.rowData[0]}/edit`}
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
    const [data, setData] = React.useState<Genre[]>([])
    const [categories, setCategories] = React.useState<Category[]>([])
    const loading = React.useContext(LoadingContext)
    const {openDeleteDialog, setOpenDeleteDialog, rowsToDelete, setRowsToDelete} = useDeleteCollection()
    const tableRef = React.useRef() as React.MutableRefObject<MuiDataTableRefComponent>
    const extraFilter = React.useMemo(() =>({
        createValidationSchema: () => {
            return yup.object().shape({
                categories: yup.mixed()
                    .nullable()
                    .transform(value => !value || value === '' ? undefined : value.split(','))
                    .default(null)
            })
        },
        formatSearchParams: (debouncedFilterState) => {
            return debouncedFilterState.extraFilter ? {
                ...(debouncedFilterState.extraFilter.categories &&
                    {categories: debouncedFilterState.extraFilter.categories.join(',')})
            } : undefined
        },
        getStateFromUrl: (queryParams) => {
            return {
                categories: queryParams.get('categories')
            }
        }
    }), [])

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
            tableRef,
            extraFilter
        })
    const searchText = cleanSearchText(debouncedFilterState.search)
    const indexColumnCategories = columns.findIndex(c => c.name === 'categories')
    const columnCategories = columns[indexColumnCategories]
    const categoriesFilterValue = filterState.extraFilter && filterState.extraFilter.categories;
    (columnCategories.options as any).filterList = categoriesFilterValue
        ? categoriesFilterValue
        : []
    const serverSideFilterList = columns.map(column => [])
    if (categoriesFilterValue) {
        serverSideFilterList[indexColumnCategories] = categoriesFilterValue
    }

    React.useEffect(() => {
        let isSubscribed = true;
        (async () => {
            try {
                const {data} = await categoryHttp.list({queryParams: {all: ''}})
                if (isSubscribed) {
                    setCategories(data.data);
                    (columnCategories.options as any)
                        .filterOptions.names = data.data.map(category => category.name)
                }
            } catch (error) {
                console.error(error)
                enqueueSnackbar('Não foi possível carregar as informações.', {
                    variant: 'error'
                })
            }
        })()

        return () => {
            isSubscribed = false
        }
    }, [columnCategories.options, enqueueSnackbar])

    const getData = React.useCallback(async ({search, page, per_page, sort, dir, type}) => {
        try {
            const {data} = await genreHttp.list<ListResponse<Genre>>({
                queryParams: {
                    search,
                    page,
                    per_page,
                    sort,
                    dir,
                    ...(
                        type &&
                        {
                            categories: type
                        }
                    )
                }
            })
            if (subscribed.current) {
                setData(data.data)
                setTotalRecords(data.meta.total)
                if (openDeleteDialog) {
                    setOpenDeleteDialog(false)
                }
            }
        } catch (error) {
            console.error(error)
            if (genreHttp.isCancelledRequest(error)) {
                enqueueSnackbar('Não foi possível carregar as informações.', {
                    variant: 'error'
                })
            }
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
            ...(
                debouncedFilterState.extraFilter &&
                debouncedFilterState.extraFilter.categories && {
                    categories: debouncedFilterState.extraFilter.categories.join(',')
                }
            )
        })
        return () => {
            subscribed.current = false
        }
    }, [
        getData,
        searchText,
        debouncedFilterState.pagination.page,
        debouncedFilterState.pagination.per_page,
        debouncedFilterState.order,
        debouncedFilterState.extraFilter
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
        
        genreHttp
            .deleteCollection({ids})
            .then(response => {
                enqueueSnackbar('Registros excluidos com sucesso!', {
                    variant: 'success'
                })
                if (rowsToDelete.data.length === filterState.pagination.per_page && filterState.pagination.page > 1) {
                    const page = filterState.pagination.page - 2
                    filterManager.changePage(page)
                } else {
                    //getData()
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
                    serverSideFilterList,
                    searchText: filterState.search as any,
                    page: filterState.pagination.page - 1,
                    rowsPerPage: filterState.pagination.per_page,
                    count: totalRecords,
                    onFilterChange: (column, filterList, type) => {
                        const columnIndex = columns.findIndex(c => c.name === column)
                        filterManager.changeExtraFilter({
                            [column]: filterList[columnIndex].length ? filterList[columnIndex] : null
                        })
                    },  
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