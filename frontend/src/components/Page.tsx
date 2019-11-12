import * as React from 'react'
import { Container, Typography, makeStyles } from '@material-ui/core'

type PageProps = {
    title: string
}

const useStyles = makeStyles({
    title: {
        color: '#999999'
    }
})

export const Page: React.FC<PageProps> = (props) => {
    const classes = useStyles()

    return (
        <div>
            <Container>
                <Typography className={classes.title} component="h1" variant="h5">
                    {props.title}
                </Typography>
                {props.children}
            </Container>
        </div>
    )
}