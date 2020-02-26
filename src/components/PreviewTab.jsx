import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
    root:{
        display: "block",
        overflow: 'auto',
    }
});



export default
@withStyles(styles)
@observer
class PreviewTab extends React.Component {

    render() {
        const {classes} = this.props
        return (
            <div id="svg_wrapper" className={classes.root}>
            <div id="__svg" className={classes.root} ></div>
            </div>
        )
    }
}
