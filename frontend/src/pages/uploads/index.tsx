import * as React from 'react'
import { makeStyles, Theme, Card, CardContent, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid, List, Divider } from '@material-ui/core'
import UploadItem from "./UploadItem"
import { Page } from '../../components/Page'
import ExpandMoreIcon from "@material-ui/icons/ExpandMore" 

const useStyles = makeStyles((theme: Theme) => {
    return ({
        panelSummary: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
        },
        expendedIcon: {
            color: theme.palette.primary.contrastText
        }
    })
})

const Uploads = () => {
    const classes = useStyles()

    return (
        <Page title="Uploads">
            <Card elevation={5}>
                <CardContent>
                    <UploadItem>
                        Vídeo aqui
                    </UploadItem>
                    <ExpansionPanel style={{margin: 0}}>
                        <ExpansionPanelSummary
                            className={classes.panelSummary}
                            expandIcon={<ExpandMoreIcon className={classes.expendedIcon}/>}
                        >
                            <Typography>Ver detalhes</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <Grid item xs={12}>
                                <List dense={true} style={{padding: '0px'}}>
                                    <Divider/>
                                    <UploadItem>
                                        Principal
                                    </UploadItem>
                                </List>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </CardContent>
            </Card>
        </Page>
    )
}

export default Uploads