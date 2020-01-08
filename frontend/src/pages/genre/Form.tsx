import * as React from 'react'
import { TextField, MenuItem } from '@material-ui/core'
import useForm from 'react-hook-form'
import categoryHttp from '../../util/http/category-http'
import genreHttp from '../../util/http/genre-http'
import * as yup from '../../util/vendor/yup'
import { useSnackbar } from 'notistack'
import { useHistory, useParams } from 'react-router-dom'
import { Genre, Category } from '../../util/models'
import SubmitActions from '../../components/SubmitActions'
import { DefaultForm } from '../../components/DefaultForm'

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
        reset,
        triggerValidation
    } = useForm({
        validationSchema,
        defaultValues: {
            categories_id: []
        }
    })


    const snackbar = useSnackbar()
    const history = useHistory()
    const {id} = useParams()
    const [genre, setGenre] = React.useState<Genre | null>(null)
    const [categories, setCategories] = React.useState<Category[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)

    const handleChange = event => setValue('categories_id', event.target.value)

    React.useEffect(() => {
        let isSubscribed = true;

        (async () => {
            setLoading(true)
            const promises = [categoryHttp.list()]
            if (id) {
                promises.push(genreHttp.get(id))
            }

            try {
                const [categoryResponse, genreResponse] = await Promise.all(promises)
                if (isSubscribed) {
                    setCategories(categoryResponse.data.data)

                    if (id) {
                        setGenre(genreResponse.data.data)
                        reset({
                            ...genreResponse.data.data,
                            categories_id: genreResponse.data.data.categories.map(category => category.id)
                        })
                    }
                }
            } catch(error) {
                console.error(error)
                snackbar.enqueueSnackbar('Não foi possívelcarregar as iformações :(', {
                    variant: 'error'
                })
            } finally {
                setLoading(false)
            }
        })()
        
        return () => {
            isSubscribed = false
        }
    }, [])

    async function onSubmit(formData, event) {
        setLoading(true)

        try {
            const http = !genre ? genreHttp.create(formData) : genreHttp.update(genre.id, formData)
            const {data} = await http

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
        } catch(error) {
            console.error(error)
                snackbar.enqueueSnackbar('Não foi possível salvar o gênero :(', {
                    variant: 'error'
                })
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        register({name: 'categories_id'})
    }, [register])

    return (
        <DefaultForm 
            GridItemProps={{xs: 12, md: 6}}
            onSubmit={handleSubmit(onSubmit)}
        >
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


         <SubmitActions
            disabledButtons={loading}
            handleSave={() => triggerValidation().then(isValid => {
                isValid && onSubmit(getValues(), null)
            })}
        />
     </DefaultForm>
    )
}

export default Form