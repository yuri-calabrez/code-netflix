import * as React from 'react'
import { FormControl, Button } from '@material-ui/core'
import { FormControlProps } from '@material-ui/core/FormControl'
import InputFile from '../../../components/InputFile'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'

interface UploadFieldProps {
    accept: string
    label: string
    setValue: (value) => void
    error?: any
    disabled?: boolean
    FormControlProps?: FormControlProps
}

const UploadField: React.FC<UploadFieldProps> = (props) => {
    const {accept, label, setValue, error, disabled} = props

    return (
        <FormControl 
            error={error !== undefined}
            disabled={disabled === true}
            {...props.FormControlProps}
         >
            <InputFile
                TextFieldProps={{
                    label: label,
                    InputLabelProps: {shrink: true}
                }}
                InputFileProps={{
                    accept,
                    onChange(event){
                        const files = event.target.files as any
                        files.length &&  setValue(files[0])
                    }
                }}
                ButtonFile={
                    <Button
                        endIcon={<CloudUploadIcon/>}
                        variant="contained"
                        color="primary"
                        onClick={() => {}}
                    >
                        Adicionar
                    </Button>
                }
            />
         </FormControl>
    )
}

export default UploadField