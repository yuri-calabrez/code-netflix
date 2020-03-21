import * as React from 'react'
import { Card, CardActions, Typography, IconButton, Collapse, List, makeStyles, Theme } from '@material-ui/core'
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import CloseIcon from "@material-ui/icons/Close"
import { useSnackbar } from 'notistack'
import classNames from 'classnames'
import UploadItem from './UploadItem'

interface SnackbarUploadInterface {
    id: string | number
}

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        width: '450px'
    },
    cardActionRoot: {
        padding: '8px 8px 8px 16px',
        backgroundColor: theme.palette.primary.main
    },
    title: {
        fontWeight: 'bold',
        color: theme.palette.primary.contrastText
    },
    icons: {
        marginLeft: 'auto !important',
        color: theme.palette.primary.contrastText
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        })
    },
    expandOpen: {
        transform: 'rotate(180deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        })
    },
    list: {
        paddingTop: "0px",
        paddingBottom: "0px"
    }
}))

const SnackbarUpload = React.forwardRef<any, SnackbarUploadInterface>((props, ref) => {
    const {id}  = props
    const {closeSnackbar} = useSnackbar()
    const classes = useStyles()
    const [expanded, setExpanded] = React.useState(true)

    return (
        <Card ref={ref} className={classes.card}>
            <CardActions classes={{root: classes.cardActionRoot}}>
                <Typography variant="subtitle2" className={classes.title}>
                    Fazendo upload de 10 video(s)
                </Typography>
                <div className={classes.icons}>
                    <IconButton 
                        color="inherit"
                        onClick={() => setExpanded(!expanded)}
                        className={classNames(classes.expand, {[classes.expandOpen]: !expanded})}
                    >
                        <ExpandMoreIcon/>
                    </IconButton>
                    <IconButton 
                        color="inherit"
                        onClick={() => closeSnackbar(id)}
                    >
                        <CloseIcon/>
                    </IconButton>
                </div>
            </CardActions>
            <Collapse in={expanded}>
                <List className={classes.list}>
                    <UploadItem/>
                </List>
            </Collapse>
        </Card>
    )
})

export default SnackbarUpload