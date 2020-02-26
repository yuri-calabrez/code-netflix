import * as React from 'react'
import AsyncAutocomplete from '../../../components/AsyncAutocomplete'
import GridSelected from '../../../components/GridSelected'
import GridSelectedItem from '../../../components/GridSelectedItem'
import { Typography, FormControlProps, FormControl, FormHelperText } from '@material-ui/core'
import useHttpHandled from '../../../hooks/useHttpHandled'
import useCollectionManager from '../../../hooks/useCollectionManager'
import { Genre } from '../../../util/models'
import categoryHttp from '../../../util/http/category-http'

interface CategoryFieldProps {
    categories: any[]
    setCategories: (categories) => void
    genres: Genre[]
    error: any
    disabled?: boolean
    FormControlProps?: FormControlProps
}

const CategoryField: React.FC<CategoryFieldProps> = (props) => {
    const {categories, setCategories, genres, error, disabled} = props
    const autocompleteHttp = useHttpHandled()
    const {addItem, removeItem} = useCollectionManager(categories, setCategories)


    function fetchOptions() {
        return autocompleteHttp(
            categoryHttp.list({
                queryParams: {
                    genres: genres.map(genre => genre.id).join(','),
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
                        categories.map((category, key) => (
                            <GridSelectedItem key={key} onClick={() => {}} xs={12}>
                                <Typography noWrap={true}> {category.name} </Typography>
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

export default CategoryField