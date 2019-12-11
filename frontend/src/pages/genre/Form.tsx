import * as React from 'react'
import { TextField, Checkbox, Box, Button, makeStyles, Theme, MenuItem } from '@material-ui/core'
import { ButtonProps } from '@material-ui/core/Button'
import useForm from 'react-hook-form'
import categoryHttp from '../../util/http/category-http'
import genreHttp from '../../util/http/genre-http'

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

    const [categories, setCategories] = React.useState<any[]>([])

    const {register, handleSubmit, getValues, setValue, watch} = useForm({
        defaultValues: {
            is_active: true,
            categories_id: []
        }
    })

    const handleChange = event => setValue('categories_id', event.target.value)

    function onSubmit(formData, event) {
        genreHttp
            .create(formData)
            .then(response => console.log(response.data.data))
    }
    

    React.useEffect(() => {
        categoryHttp
            .list()
            .then(response => setCategories(response.data.data))
    }, [])

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
            inputRef={register}
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
         >
            {
              categories.map((category, index) => (
                  <MenuItem key={index} value={category.id}>{category.name}</MenuItem>
              ))
            }
         </TextField>

         <Checkbox
            name="is_active"
            inputRef={register}
            defaultChecked
         /> 
         Ativo?

         <Box dir="rtl">
            <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
            <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
         </Box>
     </form>
    )
}

export default Form