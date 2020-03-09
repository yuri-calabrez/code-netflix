import * as React from 'react'
import { FormControl, Button } from '@material-ui/core'
import { FormControlProps } from '@material-ui/core/FormControl'
import InputFile, { InputFileComponent } from '../../../components/InputFile'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'

interface UploadFieldProps extends React.RefAttributes<UploadFieldComponent> {
    accept: string
    label: string
    setValue: (value) => void
    error?: any
    disabled?: boolean
    FormControlProps?: FormControlProps
}

export interface UploadFieldComponent {
    clear: () => void
}

const UploadField = React.forwardRef<UploadFieldComponent, UploadFieldProps>((props, ref) => {
    const fileRef = React.useRef() as React.MutableRefObject<InputFileComponent>
    const {accept, label, setValue, error, disabled} = props

    React.useImperativeHandle(ref, () => ({
        clear: () =>fileRef.current.clear()
    }))

    return (
        <FormControl 
            error={error !== undefined}
            disabled={disabled === true}
            fullWidth
            margin="normal"
            {...props.FormControlProps}
         >
            <InputFile
                ref={fileRef}
                TextFieldProps={{
                    label: label,
                    InputLabelProps: {shrink: true},
                    style: {backgroundColor: "#ffffff", width: "100%"}
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
                        onClick={() => fileRef.current.openWindow()}
                    >
                        Adicionar
                    </Button>
                }
            />
         </FormControl>
    )
})

export default UploadField