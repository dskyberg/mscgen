import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import msc_config from '../store/MSC_Config'
import editorConfig from '../store/EditorConfig'

const styles = theme => ({
    root:{
        display: "block",
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
        error: PropTypes.object
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

    renderPreview = () => {
        const config = msc_config.config
        const script = editorConfig.editor
        document.getElementById('__svg').innerHTML = ''
        require('mscgenjs').renderMsc(
          script,
          config,
          this.handleRenderMscResult
        );
      }

      handleRenderMscResult = (pError, pSuccess) => {
        if (Boolean(pError)) {
            // pError holds the error info
          return;
        }
        if (Boolean(pSuccess)) {
            // pSuccess holds the svg
          return;
        // the svg is in the pSuccess argument
        }
        console.log('Wat! Error nor success?');
      }

    render() {
        const {classes, error} = this.props
        const errorState = Boolean(error)
        return (
            <div id="svg_wrapper" className={classes.root}>
                <div hidden={errorState} id="__svg" className={classes.root} ></div>
                {this.displayError(error)}
            </div>
        )
    }
}
export default PreviewTab