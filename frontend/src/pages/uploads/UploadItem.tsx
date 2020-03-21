import * as React from 'react'
import { makeStyles, Theme, ListItem, Grid, Typography } from '@material-ui/core'
import MovieIcon from "@material-ui/icons/Movie"
import ImageIcon from "@material-ui/icons/Image"
import UploadProgress from '../../components/UploadProgress'
import UploadAction from "./UploadAction"

const useStyles = makeStyles((theme: Theme) => {
    return ({
        icon: {
            color: theme.palette.error.main,
            minWidth: '40px'
        },
        gridTitle: {
            display: 'flex',
            color: '#999999'
        }
    })
})

interface UploadItemProps {

}

const UploadItem: React.FC<UploadItemProps> = (props) => {
    const classes = useStyles()

    function makeIcon() {
        if(true) {
            return <MovieIcon className={classes.icon}/>
        }
        return <ImageIcon className={classes.icon}/>
    }

    return (
       <ListItem>
           <Grid container alignItems="center">
               <Grid
                    className={classes.gridTitle}
                    item
                    xs={12}
                    md={9}
               >
                   {makeIcon()}
                   <Typography color="inherit">
                       {props.children}
                   </Typography>
               </Grid>
               <Grid item xs={12} md={3}>
                   <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justify="flex-end"
                   >
                       <UploadProgress size={48}/>
                       <UploadAction/>
                   </Grid>
               </Grid>
           </Grid>
       </ListItem>
    )
}

export default UploadItem