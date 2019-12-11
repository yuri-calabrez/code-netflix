import * as React from 'react'
import { TextField, Box, Button, makeStyles, Theme, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@material-ui/core'
import { ButtonProps } from '@material-ui/core/Button'
import useForm from 'react-hook-form'
import castMemberHttp from '../../util/http/cast-member-http'

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
})


const Form = () => {

    const classes = useStyles()

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: 'secondary',
        variant: "contained"
    }

    const {register, handleSubmit, getValues, setValue} = useForm()

    React.useEffect(() => {
        register({name: 'type'})
    }, [register])

    const handleChange = event => setValue('type', parseInt(event.target.value))

    function onSubmit(formData, event) {
        castMemberHttp
            .create(formData)
            .then(response => console.log(response.data))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
         <TextField
            name="name"
            label="Nome"
            fullWidth
            variant="outlined"
            inputRef={register}
         />
         <FormControl margin="normal">
            <FormLabel component="legend">Tipo</FormLabel>
            <RadioGroup 
                defaultValue="1" 
                aria-label="type" 
                name="type"
                onChange={handleChange}
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
         </FormControl>

        <Box dir="rtl">
            <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
            <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
         </Box>
     </form>
    )
}

export default Form