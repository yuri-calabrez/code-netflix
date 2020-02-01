import {useState, useReducer, Dispatch, Reducer} from 'react'
import reducer, { INITIAL_STATE, Creators } from '../store/filter'
import { State as FilterState, Actions as FilterActions } from '../store/filter/types'
import { MUIDataTableColumn } from 'mui-datatables'
import {useDebounce} from 'use-debounce'

interface FilterManagerOptions {
    columns: MUIDataTableColumn[]
    rowsPerPage: number
    rowsPerPageOptions: number[]
    debounceTime: number
}

export default function useFilter(options: FilterManagerOptions) {
    const filterManager = new FilterManager(options)
    //TODO: pegar o state da URL
    const [totalRecords, setTotalRecords] = useState<number>(0)
    const [filterState, dispatch] = useReducer<Reducer<FilterState, FilterActions>>(reducer, INITIAL_STATE)
    const [debouncedFilterState] = useDebounce(filterState, options.debounceTime)
    filterManager.state = filterState
    filterManager.dispatch = dispatch
    filterManager.applyOrderInColumns()

    return {
        columns: filterManager.columns,
        filterManager,
        filterState,
        debouncedFilterState,
        dispatch,
        totalRecords,
        setTotalRecords
    }
}

export class FilterManager {

    state: FilterState = null as any
    dispatch: Dispatch<FilterActions> = null as any
    columns: MUIDataTableColumn[]
    rowsPerPage: number
    rowsPerPageOptions: number[]

    constructor(options: FilterManagerOptions) {
        const {columns, rowsPerPage, rowsPerPageOptions, debounceTime} = options
        this.columns = columns
        this.rowsPerPage = rowsPerPage
        this.rowsPerPageOptions = rowsPerPageOptions
    }

    changeSearch(value) {
        this.dispatch(Creators.setSearch({search: value}))
    }

    changePage(page) {
        this.dispatch(Creators.setPage({page: page + 1}))
    }

    changeRowsPerPage(perPage) {
        this.dispatch(Creators.setPerPage({per_page: perPage}))
    }

    changeColumnSort(changedColumn: string, direction: string) { 
        this.dispatch(Creators.setOrder({
            sort: changedColumn,
            dir: direction.includes('desc') ? 'desc' : 'asc'
        }))
    }

    applyOrderInColumns() {
        this.columns = this.columns.map(column => {
            return column.name === this.state.order.sort
            ? {
                ...column,
                options: {
                    ...column.options,
                    sortDirection: this.state.order.dir as any
                }
            }
            : column
        })
    }

    cleanSearchText(text) {
        let newText = text
        if (text && text.value !== undefined) {
            newText = text.value
        }

        return newText
    }
}