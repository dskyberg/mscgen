import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
});



export default
@withStyles(styles)
@observer
class PreviewTab extends React.Component {
    static propTypes = {
        pos: PropTypes.number,
        active: PropTypes.number,      
    }

    render() {
        const {pos, active} = this.props
        return (
            <div id="__svg" hidden={ pos !== active } ></div>
        )
    }
}
