import * as React from 'react'
import { TextField, Box, Button, makeStyles, Theme, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
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
        variant: "outlined"
    }

    const [value, setValue] = React.useState()

    const handleChange = event => setValue(event.target.value)

    const {register, handleSubmit, getValues} = useForm()

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
                inputRef={register}
            />
            <FormControlLabel 
                value="2"  
                label="Ator" 
                control={<Radio/>}
                inputRef={register}
            />
        </RadioGroup>

        <Box dir="rtl">
            <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
            <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
         </Box>
     </form>
    )
}

export default Form