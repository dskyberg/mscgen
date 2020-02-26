import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
    root:{
        display: "block",
        overflow: 'auto',
    },
    error: {
        padding: theme.spacing(2)
    }
});



export default
@withStyles(styles)
@observer
class PreviewTab extends React.Component {
    static propTypes = {
        error: PropTypes.object
    }
    static defaultProps = {
        error: null
    }

    displayError = (error) => {
        if(error === null || error === undefined) {
            return null
        }

        return (
            <Paper className={this.props.classes.error}>
                <Typography variant="h4">{error.name}</Typography>
                <Typography >Line: {error.location.start.line}</Typography>
                <Typography >{error.message}</Typography>
            </Paper>
        )
    }

    render() {
        const {classes, error} = this.props
        const errorState = error !== undefined && error !== null
        console.log('PreviewTab:', errorState)

        return (
            <div id="svg_wrapper" className={classes.root}>
                <div hidden={errorState} id="__svg" className={classes.root} ></div>
                {this.displayError(error)}
            </div>
        )
    }
}
