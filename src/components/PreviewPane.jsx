/*
    Copyright (c) 2020 by David Skyberg
*/
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'
import ErrorView from './ErrorView'

import mscConfig from '../store/MSC_Config'
import getViewportSize from '../util/getViewportSize'


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
});

@withStyles(styles)
class PreviewPane extends React.Component {
    static propTypes = {
        onError: PropTypes.func.isRequired,
    }
    static defaultProps = {
        inPortal: false
    }

    constructor(props) {
        super(props)
        this.svgElem = null
    }

    /**
     * Render the preview, if there is a script, when the pane loads.
     */
    componentDidMount() {
        mscConfig.render(this.props.onError)
    }

    /**
     * If auto rendering is off, render when the preview window is clicked.
     */
    handleRenderClicked = (event) => {
        event.stopPropagation()
        if(!mscConfig.autoRender){
            mscConfig.render(this.props.onError)
        }
    }

    /**
     * Look to see if the editor content has changed.  If so and of autoRender is
     * on, then re-render the SVG
     * Note, always return true for this, since returing false, disables rendering
     * altogether.
     *
     * @param {object} nextProps
     * @param {object} nextState
     */
    shouldComponentUpdate(nextProps, nextState) {
        // Don't do anything if autoRender is off
        if(mscConfig.autoRender === false){
            return true
        }

        if(nextProps.content !== this.props.content || nextProps.config !== this.props.config) {
            mscConfig.render(this.props.onError)
        }
        // Always return true, or other changes won't cause a render
        return true
    }


    render() {
        const {classes} = this.props
        const error = mscConfig.error
        const errorState = Boolean(error)
        const features = {
            left: 0,
            top: 0
        }

        return (
            <div id="svg_wrapper" className={ classes.svg_wrapper } onClick={ this.handleRenderClicked }>
              <div hidden={ errorState } ref={ mscConfig.setSvgElem } id="__svg"></div>
              <ErrorView error={error} />
            </div>
        )
    }
}
export default PreviewPane
