import * as React from 'react'
import { TextField, Checkbox, FormControlLabel, Grid, Typography, useMediaQuery, useTheme, Card, CardContent, makeStyles, Theme, FormHelperText } from '@material-ui/core'
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
import GenreField, { GenreFieldComponent } from './GenreField'
import CategoryField, { CategoryFieldComponent } from './CategoryField'
import CastMemberField, { CastMemberFieldComponent } from './CastMemberField'
import {omit, zipObject} from 'lodash'
import { InputFileComponent } from '../../../components/InputFile'
import useSnackbarFormError from '../../../hooks/useSnackbarFormError'
import SnackbarUpload from '../../../components/SnackbarUpload'
import { useSelector, useDispatch } from 'react-redux'
import { UploadState, Upload, UploadModule } from '../../../store/upload/types'
import { Creators } from '../../../store/upload'

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
    cast_members: yup.array()
        .label('Elenco')
        .required(),
    genres: yup.array()
        .label('Gêneros')
        .required()
        .test({
            message: 'Cada gênero escolhido precisa ter pelo menos uma categoria selecionada',
            test(value) {
                return value.every(
                    v => v.categories.filter(
                        cat => this.parent.categories.map(c => c.id).includes(cat.id)
                    ).length !== 0
                )
            }
        }),
    categories: yup.array()
        .label('Categorias')
        .required(),
    rating: yup.string()
        .label('Classificação')
        .required()
})

const useStyles = makeStyles((theme: Theme) => ({
    cardUpload: {
        borderRadios: '14px',
        backgroundColor: '#f5f5f5',
        margin: theme.spacing(2,0)
    },
    cardOpened: {
        borderRadius: '4px',
        backgroundColor: '#f5f5f5'
    },
    cardContentOpened: {
        paddingBottom: theme.spacing(2) + 'px !important'
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
        triggerValidation,
        formState
    } = useForm({
        validationSchema,
        defaultValues: {
            genres: [],
            categories: [],
            cast_members: [],
            rating: null,
            opened: false
        }
    })

    useSnackbarFormError(formState.submitCount, errors)

    const snackbar = useSnackbar()
    const history = useHistory()
    const {id} = useParams()
    const [video, setVideo] = React.useState<Video | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)
    const theme = useTheme()
    const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'))
    const uploadsRef = React.useRef(
        zipObject(fileFields, fileFields.map(() => React.createRef()))
    ) as React.MutableRefObject<{[key: string]: React.MutableRefObject<InputFileComponent>}>
    const castMemberRef = React.useRef() as React.MutableRefObject<CastMemberFieldComponent>
    const categoryRef = React.useRef() as React.MutableRefObject<CategoryFieldComponent>
    const genreRef = React.useRef() as React.MutableRefObject<GenreFieldComponent>

    const uploads = useSelector<UploadModule, Upload[]>((state) => state.upload.uploads)
    const dispatch = useDispatch()

    React.useMemo(() => {
        setTimeout(() => {
            const obj: any = {
                video: {
                    id: '4cee7870-12eb-43f0-bd44-1d1a053a4b0e',
                    title: 'teste'
                },
                files: [
                    {
                        file: new File([""], "teste.mp4"),
                        fileField: 'trailer_file'
                    },
                    {
                        file: new File([""], "teste.mp4"),
                        fileField: 'video_file'
                    }
                ]
            }
            dispatch(Creators.addUpload(obj))
            const progress1 = {
                fileField: 'trailer_file',
                progress: 10,
                video: {id: '1'}
            } as any
    
            dispatch(Creators.updateProgress(progress1))
    
            const progress2 = {
                fileField: 'video_file',
                progress: 20,
                video: {id: '1'}
            } as any 
            dispatch(Creators.updateProgress(progress2))
        }, 1000)
    }, [true])

    console.log(uploads)

    React.useEffect(() => {
        ['rating', 'opened', 'genres', 'categories', 'cast_members', ...fileFields].forEach(name => register({name}))
    }, [register])
   

    React.useEffect(() => {
        let isSubscribed = true;

        snackbar.enqueueSnackbar('', {
            key: 'snackbar-upload',
            persist: true,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right'
            },
            content: (key, message) => {
                const id = key as any
                return <SnackbarUpload id={id}/>
            }
        })

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
        const sendData = omit(formData, ['cast_members', 'genres', 'categories'])
        sendData['cast_members_id'] = formData['cast_members'].map(cast_member => cast_member.id)
        sendData['categories_id'] = formData['categories'].map(category => category.id)
        sendData['genres_id'] = formData['genres'].map(genre => genre.id)
        setLoading(true)
        try {
            const http = !video 
                ? videoHttp.create(sendData) 
                : videoHttp.update(video.id, {...sendData, _method: 'PUT'}, {http: {usePost: true}})
            const {data} = await http

            snackbar.enqueueSnackbar('Vídeo salvo com sucesso!', {
                variant: 'success'
            })
            id && resetForm(video)

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

    function resetForm(data) {
        Object.keys(uploadsRef.current).forEach(
            field => uploadsRef.current[field].current.clear()
        )
        castMemberRef.current.clear()
        categoryRef.current.clear()
        genreRef.current.clear()
        reset(data)
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
                    <CastMemberField
                        castMembers={watch('cast_members')}
                        setCastMembers={(value) => setValue('cast_members', value, true)}
                        error={errors.cast_members}
                        disabled={loading}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <GenreField
                                genres={watch('genres')}
                                setGenres={(value) => setValue('genres', value, true)}
                                categories={watch('categories')}
                                setCategories={(value) => setValue('categories', value, true)}
                                error={errors.genres}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CategoryField
                                categories={watch('categories')}
                                setCategories={(value) => setValue('categories', value, true)}
                                genres={watch('genres')}
                                error={errors.categories}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormHelperText>
                                Escolha os gêneros do vídeo
                            </FormHelperText>
                            <FormHelperText>
                                Escolha pelo menos uma categoria de cada gênero
                            </FormHelperText>
                        </Grid>
                    </Grid>
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
                                ref={uploadsRef.current['thumb_file']}
                                accept="image/*"
                                label="Thumb"
                                setValue={(value) => setValue('thumb_file', value)}
                            />
                            <UploadField
                                ref={uploadsRef.current['banner_file']}
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
                                ref={uploadsRef.current['trailer_file']}
                                accept="video/mp4"
                                label="Trailer"
                                setValue={(value) => setValue('trailer_file', value)}
                            />
                            <UploadField
                                ref={uploadsRef.current['video_file']}
                                accept="video/mp4"
                                label="Principal"
                                setValue={(value) => setValue('video_file', value)}
                            />
                        </CardContent>
                    </Card>
                    <br/>
                    <Card className={styles.cardOpened}>
                        <CardContent className={styles.cardContentOpened}>
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
                        </CardContent>
                    </Card>
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