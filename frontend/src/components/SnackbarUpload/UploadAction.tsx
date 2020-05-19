import * as React from 'react'
import { makeStyles, Theme, Fade, ListItemSecondaryAction, IconButton } from '@material-ui/core'
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import ErrorIcon from "@material-ui/icons/Error"
import DeleteIcon from "@material-ui/icons/Delete"
import { Upload } from '../../store/upload/types'
import { useDispatch } from 'react-redux'
import { Creators } from '../../store/upload'

interface UploadActionProps {
    upload: Upload
}

const useStyles = makeStyles((theme: Theme) => ({
    successIcon: {
      color: theme.palette.success.main
    },
    errorIcon: {
        color: theme.palette.error.main
    },
    deleteIcon: {
        color: theme.palette.primary.main
    }
}))

const UploadAction: React.FC<UploadActionProps> = (props) => {
    const classes = useStyles()
    const {upload} = props
    const dispatch = useDispatch()
    return (
        <Fade in={true} timeout={{enter: 1000}}>
            <ListItemSecondaryAction>
                <span>
                    {
                        upload.progress === 1 && (
                            <IconButton className={classes.successIcon} edge="end">
                                <CheckCircleIcon/>
                            </IconButton>
                        )
                    }
                    {
                         <IconButton className={classes.errorIcon} edge="end">
                         <ErrorIcon/>
                     </IconButton>
                    }
                </span>

                <span>
                    <IconButton 
                        className={classes.deleteIcon} 
                        edge="end"
                        onClick={() => dispatch(Creators.removeUpload({id: upload.video.id}))}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </span>
            </ListItemSecondaryAction>
        </Fade>
    )
}

export default UploadAction