import * as React from 'react'
import AsyncAutocomplete, { AsyncAutocompleteComponent } from '../../../components/AsyncAutocomplete'
import GridSelected from '../../../components/GridSelected'
import GridSelectedItem from '../../../components/GridSelectedItem'
import { Typography, FormControlProps, FormControl, FormHelperText, makeStyles, Theme } from '@material-ui/core'
import useHttpHandled from '../../../hooks/useHttpHandled'
import useCollectionManager from '../../../hooks/useCollectionManager'
import { Genre } from '../../../util/models'
import categoryHttp from '../../../util/http/category-http'
import { getGenresFromCategory } from '../../../util/model-filters'
import { grey } from '@material-ui/core/colors'

interface CategoryFieldProps extends React.RefAttributes<CategoryFieldComponent>{
    categories: any[]
    setCategories: (categories) => void
    genres: Genre[]
    error: any
    disabled?: boolean
    FormControlProps?: FormControlProps
}

export interface CategoryFieldComponent {
    clear: () => void
}


const useStyles = makeStyles((theme: Theme) => ({
    genresSubtitle: {
        fontSize: '0.8rem',
        color: grey["800"]
    }
}))

const CategoryField = React.forwardRef<CategoryFieldComponent, CategoryFieldProps>((props, ref) => {
    const {categories, setCategories, genres, error, disabled} = props
    const autocompleteHttp = useHttpHandled()
    const {addItem, removeItem} = useCollectionManager(categories, setCategories)
    const classes = useStyles()
    const autocompleteRef = React.useRef() as React.MutableRefObject<AsyncAutocompleteComponent>

    const fetchOptions = React.useCallback(() => {
        return autocompleteHttp(
            categoryHttp.list({
                queryParams: {
                    genres: genres.map(genre => genre.id).join(','),
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
                    freeSolo: false,
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value),
                    getOptionSelected: (option, value) => option.id === value.id,
                    disabled: disabled === true || !genres.length
                }}
                fetchOptions={fetchOptions}
                TextFieldProps={{
                    label: 'Categorias',
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
                        categories.map((category, key) => {
                            const genreFromCategories = getGenresFromCategory(genres, category)
                                .map(genre => genre.name).join(', ')
                            return (
                                <GridSelectedItem key={key} onDelete={() => removeItem(category)} xs={12}>
                                    <Typography noWrap={true}> {category.name} </Typography>
                                    <Typography noWrap={true} className={classes.genresSubtitle}> {genreFromCategories} </Typography>
                                </GridSelectedItem>
                            )
                        })
                    }
                </GridSelected>
                {
                    error && <FormHelperText>{error.message}</FormHelperText>
                }
            </FormControl>
        </>
    )
})

export default CategoryField