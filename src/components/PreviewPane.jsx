/*
    Copyright (c) 2020 by David Skyberg
*/
import React from 'react';
import PropTypes from 'prop-types';
import Portal from './Portal'
import { observer } from 'mobx-react'
import { reaction } from 'mobx'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import mscConfig from '../store/MSC_Config'
import editorConfig from '../store/EditorConfig'
import getViewportSize from '../util/getViewportSize'


/**
 * Called by App.jsx Enables toggling auto rendering
 * based on config setting.
 * @param {function} onError Error callback
 */
export function renderPreview(onError) {
    if (mscConfig.autoRender) {
        //localRenderPreview(onError)
    }
}


const styles = theme => ({
    svg_wrapper: {
        // Total hack that is NOT responsive.  But solves the problem now
        // of making the wrapper scrollable.
        height: getViewportSize().height - 64,
        overflow: 'auto',
    },
    svg_wrapper_portal: {
        // Total hack that is NOT responsive.  But solves the problem now
        // of making the wrapper scrollable.
//        height: getViewportSize().height,
        height: '100%vw',
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
        onError: PropTypes.func.isRequired,
        inPortal: PropTypes.bool
    }
    static defaultProps = {
        inPortal: false
    }

    constructor(props) {
        super(props)
        this.svgElem = null
    }

    setSvgElem = elem => {
        console.log('Setting svgElem:', elem)
        this.svgElem = elem
        this.localRenderPreview(this.props.onError)
    }

    /**
     *
     * @param {function} onError
     */
    localRenderPreview = (onError) => {
        const config = mscConfig.config
        const script = editorConfig.value
        if (!Boolean(this.svgElem)) {
            // The __svg div doesn't appear to exist.  Bale out
            // throw new Error("Can't find id of target element to render to")
            console.log('localRenderPreview: element not found:', this.svgElem)
            return
        }
        //    const elem = document.getElementById('__svg')
        const elem = this.svgElem
        const win = elem.ownerDocument.defaultView || elem.ownerDocument.parentWindow
        config['window'] = win
        console.log('localRenderPreview: element found')
        // Always clear the existing svg, or we get some strange overlay conditions
        elem.innerHTML = ''

        require('mscgenjs').renderMsc(
            script,
            config,
            (pError, pSuccess) => {
                if (Boolean(pError)) {
                    mscConfig.setSvg(null)
                    mscConfig.setError(pError)
                    if (onError) {
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
     * Render the preview, if there is a script, when the pane loads.
     */
    componentDidMount() {
        console.log('PreviewPane.componentDidMount')
        this.localRenderPreview(this.props.onError)
    }

    /**
     * If a render error occurs, show the error, instead of the svg.
     */
    displayError = (error) => {
        console.log('displayError:', error)
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

    /**
     * If auto rendering is off, render when the preview window is clicked.
     */
    handleRenderClicked = (event) => {
        console.log('handleRenderClicked')
        event.stopPropagation()
        if(!mscConfig.autoRender){
            this.localRenderPreview(this.props.onError)
        }
    }

    handlePortalOpen = () => {
        console.log('PreviewPane.handlePortalOpen: setting targetDoc')
        this.localRenderPreview(this.props.onError)
    }

    render() {
        const {classes, inPortal, height, width} = this.props
        const error = mscConfig.error
        const value = mscConfig.value // Trigger re-rendering
        const errorState = Boolean(error)
        const features = {
//            width: Boolean(height) ? height : getViewportSize(window).height,
//            height: Boolean(width) ? height : getViewportSize(window).width,
            left: 0,
            top: 0
        }

        if (inPortal) {
            return (
                <Portal url="" name="MSCGenPreview" title="MSCGen Preview" copyStyles={ true } onOpen={ this.handlePortalOpen } features={ features } onClick={this.handleRenderClicked}>
                  <div id="svg_wrapper_portal" className={ classes.svg_wrapper }  onClick={this.handleRenderClicked}>
                    <div hidden={ errorState } ref={ this.setSvgElem } id="__svg" ></div>
                    { this.displayError(error) }
                  </div>
                </Portal>
            )
        }

        return (
            <div id="svg_wrapper" className={ classes.svg_wrapper } onClick={ this.handleRenderClicked }>
              <div hidden={ errorState } ref={ this.setSvgElem } id="__svg"></div>
              { this.displayError(error) }
            </div>
        )
    }
}
export default PreviewPane
