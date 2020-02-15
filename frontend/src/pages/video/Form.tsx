import * as React from 'react'
import { TextField, Checkbox, FormControlLabel, Grid, Typography } from '@material-ui/core'
import useForm from 'react-hook-form'
import videoHttp from '../../util/http/video-http'
import * as yup from '../../util/vendor/yup'
import { useParams, useHistory } from 'react-router-dom'
import {useSnackbar} from "notistack"
import { Video } from '../../util/models'
import SubmitActions from '../../components/SubmitActions'
import { DefaultForm } from '../../components/DefaultForm'

const validationSchema = yup.object().shape({
    title: yup.string()
        .label('Título')
        .required()
        .max(255),
    description: yup.string()
        .label('Sinopse')
        .required(),
    year_launched: yup.number()
        .label('Ano de lançamento')
        .required(),
    duration: yup.number()
        .required()
        .min(1),
    rating: yup.string()
        .label('Classificação')
        .required()
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
    } = useForm({
        validationSchema,
        defaultValues: {
            is_active: true
        }
    })

    const snackbar = useSnackbar()
    const history = useHistory()
    const {id} = useParams()
    const [video, setVideo] = React.useState<Video | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)

   

    React.useEffect(() => {
        let isSubscribed = true;

        if (!id) {
            return
        }
        (async () => {
            setLoading(true)
            try {
                const {data} = await videoHttp.get(id)
                if (isSubscribed) {
                    setVideo(data.data)
                    reset(data.data)
                }
            } catch (error) {
                console.error(error)
                snackbar.enqueueSnackbar('Não foi possível carregar as informações.', {
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
            const http = !video ? videoHttp.create(formData) : videoHttp.update(video.id, formData)
            const {data} = await http

            snackbar.enqueueSnackbar('Vídeo salvo com sucesso!', {
                variant: 'success'
            })

            setTimeout(() => {
                event 
                ? (
                    id 
                        ? history.replace(`/videos/${data.data.id}/edit`)
                        : history.push(`/videos/${data.data.id}/edit`)
                ) : history.push('/videos') 
                })
        } catch(error) {
            console.error(error)
            snackbar.enqueueSnackbar('Não foi possível salvar o vídeo :(', {
                variant: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <DefaultForm 
            GridItemProps={{xs: 12}}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="title"
                        label="Título"
                        fullWidth
                        variant="outlined"
                        disabled={loading}
                        inputRef={register}
                        error={errors.title !== undefined}
                        helperText={errors.title && errors.title.message}
                        InputLabelProps={{shrink: true}}
                    />
                    <TextField
                        name="description"
                        label="Sinopse"
                        multiline
                        rows="4"
                        fullWidth
                        variant="outlined"
                        disabled={loading}
                        margin="normal"
                        inputRef={register}
                        InputLabelProps={{shrink: true}}
                        error={errors.description !== undefined}
                        helperText={errors.description && errors.description.message}
                    />

                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <TextField
                                name="year_launched"
                                label="Ano de lançamento"
                                type="number"
                                fullWidth
                                variant="outlined"
                                disabled={loading}
                                inputRef={register}
                                error={errors.year_launched !== undefined}
                                helperText={errors.year_launched && errors.year_launched.message}
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                name="duration"
                                label="Duração"
                                type="number"
                                fullWidth
                                variant="outlined"
                                disabled={loading}
                                inputRef={register}
                                error={errors.duration !== undefined}
                                helperText={errors.duration && errors.duration.message}
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                    </Grid>
                    Elenco <br/> Genero e categorias
                </Grid>

                <Grid item xs={12} md={6}>
                    Classificação
                    <br/>
                    Uploads
                    <br/>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="opened"
                                color="primary"
                                onChange={
                                    () => setValue('opened', !getValues()['opened'])
                                }
                                checked={watch('opened')}
                                disabled={loading}
                            />
                        }
                        label={
                            <Typography color="primary" variant="subtitle2">
                                Quero que este conteúdo apareça na seção lançamentos
                            </Typography>
                        }
                        labelPlacement="end"
                    />
                </Grid>
            </Grid>

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