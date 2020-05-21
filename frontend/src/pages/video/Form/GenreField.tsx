import * as React from 'react'
import AsyncAutocomplete, { AsyncAutocompleteComponent } from '../../../components/AsyncAutocomplete'
import GridSelected from '../../../components/GridSelected'
import GridSelectedItem from '../../../components/GridSelectedItem'
import { Typography, FormControl, FormControlProps, FormHelperText } from '@material-ui/core'
import useHttpHandled from '../../../hooks/useHttpHandled'
import genreHttp from '../../../util/http/genre-http'
import useCollectionManager from '../../../hooks/useCollectionManager'
import { getGenresFromCategory } from '../../../util/model-filters'

interface GenreFieldProps extends React.RefAttributes<GenreFieldComponent>{
    genres: any[],
    setGenres: (genres) => void
    categories: any[]
    setCategories: (categories) => void
    error: any
    disabled?: boolean
    FormControlProps?: FormControlProps
}

export interface GenreFieldComponent {
    clear: () => void
}

const GenreField = React.forwardRef<GenreFieldComponent, GenreFieldProps>((props, ref) => {
    const autocompleteHttp = useHttpHandled()
    const {genres, setGenres, categories, setCategories, error, disabled} = props
    const {addItem, removeItem} = useCollectionManager(genres, setGenres)
    const {removeItem: removeCategory} = useCollectionManager(categories, setCategories)
    const autocompleteRef = React.useRef() as React.MutableRefObject<AsyncAutocompleteComponent>

    const fetchOptions = React.useCallback((searchText) => {
        return autocompleteHttp(
            genreHttp.list({
                queryParams: {
                    search: searchText,
                    all: ''
                }
            })
        ).then(data => data.data)
    }, [autocompleteHttp])

    React.useImperativeHandle(ref, () => ({
        clear: () => autocompleteRef.current.clear()
    }))

    return (
        <>
            <AsyncAutocomplete 
                ref={autocompleteRef}
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
                            <GridSelectedItem 
                                key={key} 
                                onDelete={() => {
                                    const categoriesWithOneGenre = categories.filter(category => {
                                        const categoryGenres = getGenresFromCategory(genres, category)
                                        return categoryGenres.length === 1 && genres[0].id == genre.id
                                    })
                                    
                                    categoriesWithOneGenre.forEach(cat => removeCategory(cat))
                                    removeItem(genre)
                                }} 
                                xs={12}>
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
})

export default GenreField