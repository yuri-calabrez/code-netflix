import {useState, useReducer, Dispatch, Reducer} from 'react'
import reducer, { INITIAL_STATE, Creators } from '../store/filter'
import { State as FilterState, Actions as FilterActions } from '../store/filter/types'
import { MUIDataTableColumn } from 'mui-datatables'

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
    filterManager.state = filterState
    filterManager.dispatch = dispatch

    return {
        filterManager,
        filterState,
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
    debounceTime: number

    constructor(options: FilterManagerOptions) {
        const {columns, rowsPerPage, rowsPerPageOptions, debounceTime} = options
        this.columns = columns
        this.rowsPerPage = rowsPerPage
        this.rowsPerPageOptions = rowsPerPageOptions
        this.debounceTime = debounceTime
    }
}