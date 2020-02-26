import * as React from 'react'
import AsyncAutocomplete from '../../../components/AsyncAutocomplete'
import GridSelected from '../../../components/GridSelected'
import GridSelectedItem from '../../../components/GridSelectedItem'
import { Typography } from '@material-ui/core'
import useHttpHandled from '../../../hooks/useHttpHandled'
import genreHttp from '../../../util/http/genre-http'
import useCollectionManager from '../../../hooks/useCollectionManager'

interface GenreFieldProps {
    genres: any[],
    setGenres: (genres) => void
}

const GenreField: React.FC<GenreFieldProps> = (props) => {
    const autocompleteHttp = useHttpHandled()
    const {genres, setGenres} = props
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
                    freeSolo: true,
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value)
                }}
                fetchOptions={fetchOptions}
                TextFieldProps={{
                    label: 'Gêneros'
                }}
            />
            <GridSelected>
                {
                    genres.map((genre, key) => (
                        <GridSelectedItem key={key} onClick={() => {}} xs={12}>
                            <Typography noWrap={true}> {genre.name} </Typography>
                        </GridSelectedItem>
                    ))
                }
            </GridSelected>
        </>
    )
}

export default GenreField