import * as React from 'react'
import { TextField, Checkbox, Box, Button, makeStyles, Theme, MenuItem, FormControlLabel } from '@material-ui/core'
import { ButtonProps } from '@material-ui/core/Button'
import useForm from 'react-hook-form'
import categoryHttp from '../../util/http/category-http'
import genreHttp from '../../util/http/genre-http'
import * as yup from '../../util/vendor/yup'
import { useSnackbar } from 'notistack'
import { useHistory, useParams } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
})

const validationSchema = yup.object().shape({
    name: yup.string()
        .label('Nome')
        .required()
        .max(255),
    categories_id: yup.array()
        .label('Categorias')
        .required()
})

const Form = () => {


    const {
        register, 
        handleSubmit, 
        getValues, 
        setValue, 
        watch,
        errors,
        reset
    } = useForm({
        validationSchema,
        defaultValues: {
            categories_id: []
        }
    })

    const classes = useStyles()

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: 'secondary',
        variant: "contained"
    }

    const snackbar = useSnackbar()
    const history = useHistory()
    const {id} = useParams()
    const [genre, setGenre] = React.useState<{id: string} | null>(null)
    const [categories, setCategories] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)

    const handleChange = event => setValue('categories_id', event.target.value)

    React.useEffect(() => {
        const promises = [categoryHttp.list()]
        if (id) {
            promises.push(genreHttp.get(id))
        }
        Promise.all(promises)
            .then(response => {
                setLoading(true)
                const categoryResponse = response[0]
                const genreResponse = response[1]

                setCategories(categoryResponse.data.data)
                if (id) {
                    setGenre(genreResponse.data.data)
                    reset({
                        ...genreResponse.data.data,
                        categories_id: genreResponse.data.data.categories.map(category => category.id)
                    })
                }
            })
            .catch(error => {
                snackbar.enqueueSnackbar('Não foi possívelcarregar as iformações :(', {
                    variant: 'error'
                })
            })
            .finally(() => setLoading(false))
    }, [])

    function onSubmit(formData, event) {
        const http = !genre ? genreHttp.create(formData) : genreHttp.update(genre.id, formData)
        setLoading(true)
        http
            .then(({data}) => {
                snackbar.enqueueSnackbar('Gênero salvo com sucesso!', {
                    variant: 'success'
                })

                setTimeout(() => {
                    event 
                    ? (
                        id 
                            ? history.replace(`/genres/${data.data.id}/edit`)
                            : history.push(`/genres/${data.data.id}/edit`)
                    ) : history.push('/genres') 
                    })
            })
            .catch((error) => {
                console.log(error)
                snackbar.enqueueSnackbar('Não foi possível salvar o gênero :(', {
                    variant: 'error'
                })
            })
            .finally(() => setLoading(false))
    }

    React.useEffect(() => {
        register({name: 'categories_id'})
    }, [register])

    return (
     <form onSubmit={handleSubmit(onSubmit)}>
         <TextField
            name="name"
            label="Nome"
            fullWidth
            variant="outlined"
            disabled={loading}
            inputRef={register}
            error={errors.name !== undefined}
            helperText={errors.name && errors.name.message}
            InputLabelProps={{shrink: true}}
         />

         <TextField
            name="categories_id"
            label="Categorias"
            select
            SelectProps={{
                multiple: true
            }}
            value={watch('categories_id')}
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            disabled={loading}
            error={errors.categories_id !== undefined}
            helperText={errors.categories_id && errors.categories_id.message}
            InputLabelProps={{shrink: true}}
         >
            {
              categories.map((category, index) => (
                  <MenuItem key={index} value={category.id}>{category.name}</MenuItem>
              ))
            }
         </TextField>


         <Box dir="rtl">
            <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
            <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
         </Box>
     </form>
    )
}

export default Form