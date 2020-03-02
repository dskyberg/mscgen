/*
    Copyright (c) 2020 by David Skyberg
*/
import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import msc_config from '../store/MSC_Config'
import editorConfig from '../store/EditorConfig'


function localRenderPreview(onError) {
    const config = msc_config.config
    const script = editorConfig.editor
    document.getElementById('__svg').innerHTML = ''
    require('mscgenjs').renderMsc(
        script,
        config,
        (pError, pSuccess) => {
            if (Boolean(pError)) {
                msc_config.setSvg(null)
                msc_config.setError(pError)
                if(onError){
                    onError(pError)
                }
                return;
            }
            if (Boolean(pSuccess)) {
                // pSuccess holds the svg
                msc_config.setError(null)
                msc_config.setSvg(pSuccess)
                return;
            }
            console.log('Wat! Error nor success?');
        }
    );
}
export function renderPreview(onError) {
    if(msc_config.autoRender){
        localRenderPreview(onError)
    }
}


const styles = theme => ({
    root: {
        overflow: 'auto',
    },
    error: {
        padding: theme.spacing(2)
    }
});

@withStyles(styles)
@observer
class PreviewTab extends React.Component {
    static propTypes = {
        onError: PropTypes.func.isRequired
    }

    componentDidMount() {
        localRenderPreview(this.props.onError)
    }

    displayError = (error) => {
        if (error === null || error === undefined) {
            return null
        }

        return (
            <Paper className={ this.props.classes.error }>
              <Typography variant="h4">
                { error.name }
              </Typography>
              <Typography>Line:
                { error.location.start.line }
              </Typography>
              <Typography>
                { error.message }
              </Typography>
            </Paper>
        )
    }

    handleRenderClicked = (event) => {
        event.stopPropagation()
        if(!msc_config.autoRender){
            localRenderPreview(this.props.onError)
        }
    }

    render() {
        const {classes} = this.props
        const error = msc_config.error
        const errorState = Boolean(error)
        return (
            <div id="svg_wrapper" className={ classes.root } onClick={this.handleRenderClicked}>
              <div hidden={ errorState } id="__svg" className={ classes.root }></div>
              { this.displayError(error) }
            </div>
        )
    }
}
export default PreviewTab