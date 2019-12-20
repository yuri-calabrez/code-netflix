import * as React from 'react'
import { TextField, Box, Button, makeStyles, Theme, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, FormHelperText } from '@material-ui/core'
import { ButtonProps } from '@material-ui/core/Button'
import useForm from 'react-hook-form'
import castMemberHttp from '../../util/http/cast-member-http'
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
        watch
    } = useForm({
        validationSchema
    })

    const classes = useStyles()
    const snackbar = useSnackbar()
    const history = useHistory()
    const {id} = useParams()
    const [castMember, setCastMember] = React.useState<{id: string} | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: 'secondary',
        variant: "contained"
    }

    React.useEffect(() => {
        register({name: 'type'})
    }, [register])

    React.useEffect(() => {
        if (!id) {
            return
        }
        setLoading(true)
        castMemberHttp.get(id)
            .then(({data}) => {
                setCastMember(data.data)
                reset(data.data)
            })
            .finally(() => setLoading(false))
    }, [])

    const handleChange = event => setValue('type', parseInt(event.target.value))

    function onSubmit(formData, event) {
        const http = !castMember ? castMemberHttp.create(formData) : castMemberHttp.update(castMember.id, formData)
            http
                .then(({data}) => {
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
                })
                .catch((error) => {
                    snackbar.enqueueSnackbar('Não foi possível salvar o membro de elenco :(', {
                        variant: 'error'
                    })
                })
                .finally(() => setLoading(false))
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

        <Box dir="rtl">
            <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
            <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
         </Box>
     </form>
    )
}

export default Form