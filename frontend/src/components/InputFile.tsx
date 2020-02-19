import * as React from 'react'
import { TextField, InputAdornment } from '@material-ui/core'
import {useRef, MutableRefObject, useState} from 'react'
import { TextFieldProps } from '@material-ui/core/TextField'

interface InputFileProps {
    ButtonFile: React.ReactNode
    InputFileProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
    TextFieldProps?: TextFieldProps
}

const InputFile: React.FC<InputFileProps> = (props) => {
    const fileRef = useRef() as MutableRefObject<HTMLInputElement>
    const [filename, setFilename] = useState("")

    const textFieldProps: TextFieldProps = {
        variant: "outlined",
        ...props.TextFieldProps,
        InputProps: {
            ...(
                props.TextFieldProps && props.TextFieldProps.inputProps &&
                {...props.TextFieldProps.InputProps} 
            ),
            readOnly: true,
            endAdornment: (
                <InputAdornment position="end">
                    {props.ButtonFile}
                    {/* <Button
                        endIcon={<CloudUploadIcon/>}
                        variant="contained"
                        color="primary"
                        onClick={() => fileRef.current.click()}
                    >
                        Adicionar
                    </Button> */}
                </InputAdornment>
            )
        },
        value: filename 
    }

    const inputFileProps = {
        ...props.InputFileProps, 
        hidden: true,
        ref: fileRef,
        onChange(event) {
            const files = event.target.files
            if (files.length) {
                setFilename(Array.from(files).map((file: any) => file.name).join(', '))
            }
            if (props.InputFileProps && props.InputFileProps.onChange) {
                props.InputFileProps.onChange(event)
            }
        }
    }
    
    return (
        <div>
            <input type="file" {...inputFileProps}/>

            <TextField {...textFieldProps}/>
        </div>
    )
}

export default InputFile