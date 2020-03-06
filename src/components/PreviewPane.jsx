/*
    Copyright (c) 2020 by David Skyberg
*/
import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import mscConfig from '../store/MSC_Config'
import editorConfig from '../store/EditorConfig'
import getViewportSize from '../util/getViewportSize'
import {renderMsc} from 'mscgenjs'

/**
 *
 * @param {function} onError
 */
function localRenderPreview(onError) {
    const config = mscConfig.config
    const script = editorConfig.value
    const elem = document.getElementById('__svg')
    if(!Boolean(elem)) {
        // The __svg div doesn't appear to exist.  Bale out
        throw new Error("Can't find id of target element to render to")
    }
    // Always clear the existing svg, or we get some strange overlay conditions
    elem.innerHTML = ''

    renderMsc(
        script,
        config,
        (pError, pSuccess) => {
            if (Boolean(pError)) {
                mscConfig.setSvg(null)
                mscConfig.setError(pError)
                if(onError){
                    onError(pError)
                }
                return;
            }
            if (Boolean(pSuccess)) {
                // pSuccess holds the svg
                mscConfig.setError(null)
                mscConfig.setSvg(pSuccess)
                return;
            }
            console.log('Wat! Error nor success?');
        }
    );
}

/**
 * Called by App.jsx
 * @param {function} onError Error callback
 */
export function renderPreview(onError) {
    if(mscConfig.autoRender){
        localRenderPreview(onError)
    }
}


const styles = theme => ({
    svg_wrapper: {
        // Total hack that is NOT responsive.  But solves the problem now
        // of making the wrapper scrollable.
        height: getViewportSize().height-64,
        overflow: 'auto',
    },
    svg: {
        display: 'block',
        boxSizing: 'inherit',
    },
    error: {
        padding: theme.spacing(2)
    }
});

@withStyles(styles)
@observer
class PreviewPane extends React.Component {
    static propTypes = {
        onError: PropTypes.func.isRequired
    }

    componentDidMount() {
        localRenderPreview(this.props.onError)
    }

    displayError = (error) => {
        if (!Boolean(error)) {
            return null
        }
        const name = Boolean(error.name) ? error.name : 'No name'
        const message = Boolean(error.message) ? error.message : 'No message'
        const startLine = Boolean(error.location) ? error.location.start.line : 'Unknown'
        return (
            <Paper className={ this.props.classes.error }>
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

    handleRenderClicked = (event) => {
        event.stopPropagation()
        if(!mscConfig.autoRender){
            localRenderPreview(this.props.onError)
        }
    }

    render() {
        const {classes} = this.props
        const error = mscConfig.error
        const errorState = Boolean(error)
        return (
            <div id="svg_wrapper" className={ classes.svg_wrapper } onClick={this.handleRenderClicked}>
              <div hidden={ errorState } id="__svg" ></div>
              { this.displayError(error) }
            </div>
        )
    }
}
export default PreviewPane
/*
*/