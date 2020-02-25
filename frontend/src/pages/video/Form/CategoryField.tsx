import * as React from 'react'
import AsyncAutocomplete from '../../../components/AsyncAutocomplete'
import GridSelected from '../../../components/GridSelected'
import GridSelectedItem from '../../../components/GridSelectedItem'
import { Typography } from '@material-ui/core'
import useHttpHandled from '../../../hooks/useHttpHandled'
import genreHttp from '../../../util/http/genre-http'

interface CategoryFieldProps {

}

const CategoryField: React.FC<CategoryFieldProps> = (props) => {
    const autocompleteHttp = useHttpHandled()

    const fetchOptions = (searchText) => autocompleteHttp(
        genreHttp.list({
            queryParams: {
                search: searchText,
                all: ''
            }
        })
    ).then(data => data.data)

    return (
        <>
            <AsyncAutocomplete 
                AutocompleteProps={{
                    freeSolo: true,
                    getOptionLabel: option => option.name
                }}
                fetchOptions={fetchOptions}
                TextFieldProps={{
                    label: 'Categorias'
                }}
            />
            <GridSelected>
                <GridSelectedItem onClick={() => {}} xs={6}>
                    <Typography> teste </Typography>
                </GridSelectedItem>
            </GridSelected>
        </>
    )
}

export default CategoryField