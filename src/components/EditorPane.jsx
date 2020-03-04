/*
    Copyright (c) 2020 by David Skyberg
*/
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'
import {observer} from 'mobx-react'
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-xcode";
import editorConfig from '../store/EditorConfig'

const styles = theme => ({
  wrapper: {
    height: '100%',
  },
  errorMarker: {
    position: 'absolute',
    background: 'rgba(100,200,100,0.5)',
    zIndex: 20
  }
});

@observer
class EditorPane extends React.Component {

    static propTypes = {
      onChange: PropTypes.func.isRequired,
      onLoad: PropTypes.func,
      markers: PropTypes.array,
      error: PropTypes.object,
    }

    static defaultProps = {
      error: null,
      markers: null,
    }

    makeMarkers = (classes, error) => {
      if(!(Boolean(error) && Boolean(error.location)) ) {
        return []
      }

      return [{
        startRow: error.location.start.line - 1,
        startCol: error.location.start.column - 1,
        endRow: error.location.end.line - 1,
        endCol: error.location.end.column - 1,
        className: classes.errorMarker,
      }]

    }

    render() {
    const {onChange, onLoad, classes, error} = this.props
    const content = editorConfig.editor
    const options = editorConfig.options
    const config = editorConfig.config
    const markers = this.makeMarkers(classes, error)
    return (
        <div  className={classes.wrapper}>
          <AceEditor width="1200" height="100%" maxLines={Infinity} onChange={ onChange } onLoad={onLoad} value={ content } markers={ markers } setOptions={ options } {...config}/>
        </div>
    )
  }
}
export default withStyles(styles)(EditorPane)
