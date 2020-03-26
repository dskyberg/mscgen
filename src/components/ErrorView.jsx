import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles(theme => ({
    error: {
        padding: theme.spacing(2)
    }
}));


function ErrorView(props) {
    const {error} = props
    const classes = useStyles()

    if (!Boolean(props.error)) {
        return null
    }
    const name = Boolean(error.name) ? error.name : 'No name'
    const message = Boolean(error.message) ? error.message : 'No message'
    const startLine = Boolean(error.location) ? error.location.start.line : 'Unknown'
    return (
        <Paper id="error-view" className={ classes.error }>
          <Typography variant="h4">
            { name }
          </Typography>
          <Typography>Line:
            { startLine }
          </Typography>
          <Typography>
            { message }
          </Typography>
        </Paper>
    )
}
export default ErrorView
