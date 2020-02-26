import * as React from 'react'
import {Autocomplete, AutocompleteProps, UseAutocompleteSingleProps} from '@material-ui/lab'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import { CircularProgress } from '@material-ui/core'
import { useDebounce } from 'use-debounce/lib'

interface AsyncAutocompleteProps {
    fetchOptions: (searchText) => Promise<any>
    debounceTime?: number
    TextFieldProps?: TextFieldProps
    AutocompleteProps?: Omit<AutocompleteProps<any>, 'renderInput'> & UseAutocompleteSingleProps<any>
}

const AsyncAutocomplete: React.FC<AsyncAutocompleteProps> = (props) => {

    const {AutocompleteProps, debounceTime = 300} = props
    const {freeSolo, onOpen, onClose, onInputChange} = AutocompleteProps as any
    const [open, setOpen] = React.useState(false)
    const [searchText, setSearchText] = React.useState("")
    const [debouncedSearchText] = useDebounce(searchText, debounceTime)
    const [loading, setLoading] = React.useState(false)
    const [options, setOptions] = React.useState([])
    

    const textFieldProps: TextFieldProps = {
        margin: 'normal',
        variant: 'outlined',
        fullWidth: true,
        InputLabelProps: {shrink: true},
        ...(props.TextFieldProps && {...props.TextFieldProps})
    }

    const autocompleteProps: AutocompleteProps<any> = {
        loadingText: 'Carregando...',
        noOptionsText: 'Nenhum item encontrado',
        ...(AutocompleteProps && {...AutocompleteProps}),
        open,
        loading: loading,
        options,
        onOpen(){
            setOpen(true)
            onOpen && onOpen()
        },
        onClose(){
            setOpen(false)
            onClose && onClose()
        },
        onInputChange(event, value){
            setSearchText(value)
            onInputChange && onInputChange()
        },
        renderInput: params => (
            <TextField 
                {...params}
                {...textFieldProps}
                InputProps={{
                    ...params.InputProps,
                    endAdornment:(
                        <>
                            {loading && <CircularProgress color="inherit" size={20}/>}
                            {params.InputProps.endAdornment}
                        </>
                    )
                }}
            />
        )
    }

    React.useEffect(() => {
        if (!open && !freeSolo) {
            setOptions([])
        }
    }, [open])

    React.useEffect(() => {
        if (!open || debouncedSearchText === '' && freeSolo) {
            return
        }

        let isSubscribed = true;

        (async () => {
            setLoading(true)
            try {
                const data = await props.fetchOptions(debouncedSearchText)
                if (isSubscribed) {
                    setOptions(data)
                }
            } finally {
                setLoading(false)
            }
        })()

        return () => {
            isSubscribed = false
        }
    }, [freeSolo ? debouncedSearchText : open])

    return (
       <Autocomplete {...autocompleteProps}/>
    )
}

export default AsyncAutocomplete