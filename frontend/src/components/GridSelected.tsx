import * as React from 'react'
import { makeStyles, Theme, createStyles, GridProps, Grid } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: '#f1f1f1',
            borderRadius: '4px',
            padding: theme.spacing(1, 1),
            color: theme.palette.secondary.main
        }
    })
)

interface GridSelectedProps extends GridProps {

}

const GridSelected: React.FC<GridSelectedProps> = (props) => {
    const classes = useStyles()
    return <Grid container wrap="wrap" className={classes.root} {...props}>
        {props.children}
    </Grid>
}

export default GridSelected