import * as React from 'react'
import { TextField, Checkbox, FormControlLabel, Grid, Typography, useMediaQuery, useTheme, Card, CardContent, makeStyles, Theme } from '@material-ui/core'
import useForm from 'react-hook-form'
import videoHttp from '../../../util/http/video-http'
import * as yup from '../../../util/vendor/yup'
import { useParams, useHistory } from 'react-router-dom'
import {useSnackbar} from "notistack"
import { Video, VideoFileFieldsMaps } from '../../../util/models'
import SubmitActions from '../../../components/SubmitActions'
import { DefaultForm } from '../../../components/DefaultForm'
import RatingField from './RatingField'
import UploadField from './UploadField'
import AsyncAutocomplete from '../../../components/AsyncAutocomplete'
import genreHttp from '../../../util/http/genre-http'

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

const useStyles = makeStyles((theme: Theme) => ({
    cardUpload: {
        borderRadios: '14px',
        backgroundColor: '#f5f5f5',
        margin: theme.spacing(2,0)
    }
}))

const fileFields = Object.keys(VideoFileFieldsMaps)

const Form = () => {

    const styles = useStyles()

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
            
        }
    })

    const snackbar = useSnackbar()
    const history = useHistory()
    const {id} = useParams()
    const [video, setVideo] = React.useState<Video | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)
    const theme = useTheme()
    const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'))

    React.useEffect(() => {
        ['rating', 'opened', ...fileFields].forEach(name => register({name}))
    }, [register])
   

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

    const fetchOptions = (searchText) => (
        genreHttp.list({
            queryParams: {
                search: searchText,
                all: ''
            }
        })
        .then(({data}) => data.data)
    )

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
                    <AsyncAutocomplete 
                    AutocompleteProps={{
                        freeSolo: true,
                        getOptionLabel: option => option.name
                    }}
                    fetchOptions={fetchOptions}
                    TextFieldProps={{
                        label: 'Gêneros'
                    }}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <RatingField
                        value={watch('rating')}
                        setValue={(value) => setValue('rating', value, true)}
                        error={errors.rating}
                        disabled={loading}
                        FormControlProps={{
                            margin: isGreaterMd ? 'none' : 'normal'
                        }}
                    />
                    <br/>
                    <Card className={styles.cardUpload}>
                        <CardContent>
                            <Typography color="primary" variant="h6">
                                Imagens
                            </Typography>
                            <UploadField
                                accept="image/*"
                                label="Thumb"
                                setValue={(value) => setValue('thumb_file', value)}
                            />
                            <UploadField
                                accept="image/*"
                                label="Banner"
                                setValue={(value) => setValue('banner_file', value)}
                            />
                        </CardContent>
                    </Card>
                    <Card className={styles.cardUpload}>
                        <CardContent>
                            <Typography color="primary" variant="h6">
                                Vídeos
                            </Typography>
                            <UploadField
                                accept="video/mp4"
                                label="Trailer"
                                setValue={(value) => setValue('trailer_file', value)}
                            />
                            <UploadField
                                accept="video/mp4"
                                label="Principal"
                                setValue={(value) => setValue('video_file', value)}
                            />
                        </CardContent>
                    </Card>
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