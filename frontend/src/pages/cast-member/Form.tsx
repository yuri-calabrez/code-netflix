import * as React from 'react'
import { TextField, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, FormHelperText } from '@material-ui/core'
import useForm from 'react-hook-form'
import castMemberHttp from '../../util/http/cast-member-http'
import * as yup from '../../util/vendor/yup'
import { useSnackbar } from 'notistack'
import { useHistory, useParams } from 'react-router-dom'
import { CastMember } from '../../util/models'
import SubmitActions from '../../components/SubmitActions'


const validationSchema = yup.object().shape({
    name: yup.string()
            .label('Nome')
            .required()
            .max(255),
    type: yup.number()
            .label('Tipo')
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
        validationSchema
    })

    const snackbar = useSnackbar()
    const history = useHistory()
    const {id} = useParams()
    const [castMember, setCastMember] = React.useState<CastMember | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)


    React.useEffect(() => {
        register({name: 'type'})
    }, [register])

    React.useEffect(() => {
        let isSubscribed = true;

        if (!id) {
            return
        }

        (async () => {
            setLoading(true)

            try {
                const {data} = await castMemberHttp.get(id)
                if (isSubscribed) {
                    setCastMember(data.data)
                    reset(data.data)
                }
            } catch(error) {
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

    const handleChange = event => setValue('type', parseInt(event.target.value))

    async function onSubmit(formData, event) {
        setLoading(true)

        try {
            const http = !castMember ? castMemberHttp.create(formData) : castMemberHttp.update(castMember.id, formData)
            const {data} = await http

            snackbar.enqueueSnackbar('Membro de elenco salvo com sucesso!', {
                variant: 'success'
            })

            setTimeout(() => {
                event 
                ? (
                    id 
                        ? history.replace(`/cast-members/${data.data.id}/edit`)
                        : history.push(`/cast-members/${data.data.id}/edit`)
                ) : history.push('/cast-members') 
            })

        } catch(error) {
            console.error(error)
            snackbar.enqueueSnackbar('Não foi possível salvar o membro de elenco :(', {
                variant: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

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
         <FormControl 
            margin="normal"
            error={errors.type !== undefined}
            disabled={loading}
         >
            <FormLabel component="legend">Tipo</FormLabel>
            <RadioGroup 
                defaultValue="1" 
                aria-label="type" 
                name="type"
                onChange={handleChange}
                value={watch('type') + ""}
            >
                <FormControlLabel 
                    value="1" 
                    label="Diretor" 
                    control={<Radio/>}
                />
                <FormControlLabel 
                    value="2"  
                    label="Ator" 
                    control={<Radio/>}
                />
            </RadioGroup>
            {
                errors.type && <FormHelperText id="type-helper-text">{errors.type.message}</FormHelperText>
            }
         </FormControl>

         <SubmitActions
            disabledButtons={loading}
            handleSave={() => triggerValidation().then(isValid => {
                isValid && onSubmit(getValues(), null)
            })}
        />
     </form>
    )
}

export default Form