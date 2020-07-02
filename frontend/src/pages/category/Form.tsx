import * as React from 'react'
import { TextField, Checkbox, FormControlLabel } from '@material-ui/core'
import { useForm } from 'react-hook-form'
import categoryHttp from '../../util/http/category-http'
import * as yup from '../../util/vendor/yup'
import { useParams, useHistory } from 'react-router-dom'
import {useSnackbar} from "notistack"
import { Category } from '../../util/models'
import SubmitActions from '../../components/SubmitActions'
import { DefaultForm } from '../../components/DefaultForm'

const validationSchema = yup.object().shape({
    name: yup.string()
        .label('Nome')
        .required()
        .max(255)
})

const Form = () => {


    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        errors,
        reset, 
        watch,
        triggerValidation
    } = useForm<{name, is_active}>({
        validationSchema,
        defaultValues: {
            is_active: true
        }
    })

    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const {id} = useParams()
    const [category, setCategory] = React.useState<Category | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)

   

    React.useEffect(() => {
        let isSubscribed = true;

        if (!id) {
            return
        }
        (async () => {
            setLoading(true)
            try {
                const {data} = await categoryHttp.get(id)
                if (isSubscribed) {
                    setCategory(data.data)
                    reset(data.data)
                }
            } catch (error) {
                console.error(error)
                enqueueSnackbar('Não foi possível carregar as informações.', {
                    variant: 'error'
                })
            } finally {
                setLoading(false)
            }
        })()

        return () => {
            isSubscribed = false
        }
    }, [id, reset, enqueueSnackbar])

    React.useEffect(() => {
        register({name: 'is_active'})
    }, [register])

    async function onSubmit(formData, event) {
        setLoading(true)

        try {
            const http = !category ? categoryHttp.create(formData) : categoryHttp.update(category.id, formData)
            const {data} = await http

            enqueueSnackbar('Categoria salva com sucesso!', {
                variant: 'success'
            })

            setTimeout(() => {
                event 
                ? (
                    id 
                        ? history.replace(`/categories/${data.data.id}/edit`)
                        : history.push(`/categories/${data.data.id}/edit`)
                ) : history.push('/categories') 
                })
        } catch(error) {
            console.error(error)
            enqueueSnackbar('Não foi possível salvar a categoria :(', {
                variant: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

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
                name="description"
                label="Descrição"
                multiline
                rows="4"
                fullWidth
                variant="outlined"
                disabled={loading}
                margin="normal"
                inputRef={register}
                InputLabelProps={{shrink: true}}
            />
            <FormControlLabel
                disabled={loading}
                control={
                    <Checkbox
                        name="is_active"
                        onChange={
                            () => setValue('is_active', !getValues()['is_active'])
                        }
                        checked={watch('is_active')}
                    />
                }
                label="Ativo?"
                labelPlacement="end"
            />

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