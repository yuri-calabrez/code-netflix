import * as React from 'react'
import { ListItem, ListItemIcon, ListItemText, Typography, Divider, makeStyles, Theme, Tooltip, CircularProgress, Fade } from '@material-ui/core'
import MovieIcon from "@material-ui/icons/Movie"
import { grey } from '@material-ui/core/colors'

interface UploadProgressProps {
    size: number
}

const useStyles = makeStyles((theme: Theme) => ({
    progressContainer: {
       position: 'relative'
    },
    progressBackground: {
        color: grey["300"]
    },
    progress: {
        position: 'absolute',
        left: 0
    }
}))

const UploadProgress: React.FC<UploadProgressProps> = (props) => {
    const classes = useStyles()
    const {size} = props
    return (
        <Fade in={true} timeout={{enter: 2000, exit: 2000}}>
            <div className={classes.progressContainer}>
                <CircularProgress
                    variant="static"
                    value={100}
                    className={classes.progressBackground}
                    size={size}
                />
                <CircularProgress
                    variant="static"
                    value={50}
                    className={classes.progress}
                    size={size}
                />
            </div>
        </Fade>
    )
}

export default UploadProgress