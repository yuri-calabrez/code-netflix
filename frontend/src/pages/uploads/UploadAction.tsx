import * as React from 'react'
import { makeStyles, Theme, Fade, Divider, IconButton } from '@material-ui/core'
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import ErrorIcon from "@material-ui/icons/Error"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import { Link } from 'react-router-dom'
import { Upload, FileUpload } from '../../store/upload/types'
import { useDispatch } from 'react-redux'
import { Creators } from '../../store/upload'

const useStyles = makeStyles((theme: Theme) => {
    return ({
        successIcon: {
            color: theme.palette.success.main,
            marginLeft: theme.spacing(1)
          },
          errorIcon: {
              color: theme.palette.error.main,
              marginLeft: theme.spacing(1)
          },
          divider: {
              height: '20px',
              marginLeft: theme.spacing(1),
              marginRight: theme.spacing(1)
          }
    })
})

interface UploadActionProps {
    uploadOrFile: Upload | FileUpload
}

const UploadAction: React.FC<UploadActionProps> = (props) => {
    const classes = useStyles()
    const {uploadOrFile} = props
    const dispatch = useDispatch()
    return (
        <Fade in={true} timeout={{enter: 1000}}>
            <>
                {uploadOrFile.progress === 1 && <CheckCircleIcon className={classes.successIcon}/>}
                <ErrorIcon className={classes.errorIcon}/>
                <>
                    <Divider className={classes.divider} orientation="vertical"/>
                    <IconButton
                       onClick={() => dispatch(Creators.removeUpload({id: (uploadOrFile as any).video.id}))}
                    >
                        <DeleteIcon color="primary"/>
                    </IconButton>
                    <IconButton
                        component={Link}
                        to={'/videos/uuid/edit'}
                    >
                       <EditIcon color="primary"/> 
                    </IconButton>
                </>
            </>
        </Fade>
    )
}

export default UploadAction