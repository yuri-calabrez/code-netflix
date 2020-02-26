import * as React from 'react'
import AsyncAutocomplete from '../../../components/AsyncAutocomplete'
import GridSelected from '../../../components/GridSelected'
import GridSelectedItem from '../../../components/GridSelectedItem'
import { Typography, FormControl, FormControlProps, FormHelperText } from '@material-ui/core'
import useHttpHandled from '../../../hooks/useHttpHandled'
import genreHttp from '../../../util/http/genre-http'
import useCollectionManager from '../../../hooks/useCollectionManager'

interface GenreFieldProps {
    genres: any[],
    setGenres: (genres) => void
    error: any
    disabled?: boolean
    FormControlProps?: FormControlProps
}

const GenreField: React.FC<GenreFieldProps> = (props) => {
    const autocompleteHttp = useHttpHandled()
    const {genres, setGenres, error, disabled} = props
    const {addItem, removeItem} = useCollectionManager(genres, setGenres)

    function fetchOptions(searchText) {
        return autocompleteHttp(
            genreHttp.list({
                queryParams: {
                    search: searchText,
                    all: ''
                }
            })
        ).then(data => data.data)
    }

    return (
        <>
            <AsyncAutocomplete 
                AutocompleteProps={{
                    //autoSelect: true,
                    clearOnEscape: true,
                    freeSolo: true,
                    getOptionLabel: option => option.name,
                    getOptionSelected: (option, value) => option.id === value.id,
                    onChange: (event, value) => addItem(value),
                    disabled
                }}
                fetchOptions={fetchOptions}
                TextFieldProps={{
                    label: 'Gêneros',
                    error: error !== undefined
                }}
            />
            <FormControl
                margin="normal"
                fullWidth 
                error={error !== undefined}
                disabled={disabled === true}
                {...props.FormControlProps}
            >
                <GridSelected>
                    {
                        genres.map((genre, key) => (
                            <GridSelectedItem key={key} onClick={() => {}} xs={12}>
                                <Typography noWrap={true}> {genre.name} </Typography>
                            </GridSelectedItem>
                        ))
                    }
                </GridSelected>
                {
                    error && <FormHelperText>{error.message}</FormHelperText>
                }
            </FormControl>
        </>
    )
}

export default GenreField