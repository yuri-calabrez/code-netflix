import * as React from 'react'
import {Autocomplete, AutocompleteProps, UseAutocompleteSingleProps} from '@material-ui/lab'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import { CircularProgress } from '@material-ui/core'

interface AsyncAutocompleteProps {
    fetchOptions: (searchText) => Promise<any>
    TextFieldProps?: TextFieldProps
    AutocompleteProps?: Omit<AutocompleteProps<any>, 'renderInput'> & UseAutocompleteSingleProps<any>
}

const AsyncAutocomplete: React.FC<AsyncAutocompleteProps> = (props) => {

    const {AutocompleteProps} = props
    const {freeSolo, onOpen, onClose, onInputChange} = AutocompleteProps as any
    const [open, setOpen] = React.useState(false)
    const [searchText, setSearchText] = React.useState("")
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
        if (!open || searchText === '' && freeSolo) {
            return
        }

        let isSubscribed = true;

        (async () => {
            setLoading(true)
            try {
                const data = await props.fetchOptions(searchText)
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
    }, [freeSolo ? searchText : open])

    return (
       <Autocomplete {...autocompleteProps}/>
    )
}

export default AsyncAutocomplete