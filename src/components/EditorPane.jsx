/*
    Copyright (c) 2020 by David Skyberg
*/
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'
import {observer} from 'mobx-react'
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/theme-clouds";
import "ace-builds/src-noconflict/theme-clouds_midnight";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/theme-crimson_editor";
import "ace-builds/src-noconflict/theme-dawn";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-dreamweaver";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-gob";
import "ace-builds/src-noconflict/theme-gruvbox";
import "ace-builds/src-noconflict/theme-idle_fingers";
import "ace-builds/src-noconflict/theme-iplastic";
import "ace-builds/src-noconflict/theme-katzenmilch";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-xcode";
import {
  DropTarget,
} from 'react-dnd';

import { NativeTypes } from 'react-dnd-html5-backend';

import editorConfig from '../store/EditorConfig'

const styles = theme => ({
  wrapper: {
    height: '100%',
    overflow: 'auto',
  },
  errorMarker: {
    position: 'absolute',
    background: 'rgba(100,200,100,0.5)',
    zIndex: 20
  }
});

const spec = {
  drop(props, monitor){
    editorConfig.openFile(monitor.getItem().files[0])
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
});

@withStyles(styles)
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
    const {onChange, onLoad, classes, error, connectDropTarget} = this.props
    const content = editorConfig.value
    const options = editorConfig.options
    const config = editorConfig.config
    const markers = this.makeMarkers(classes, error)
    return connectDropTarget(
        <div  className={classes.wrapper}>
          <AceEditor width="1200" height="100%" maxLines={Infinity} onChange={ onChange } onLoad={onLoad} value={ content } markers={ markers } setOptions={ options } {...config}/>
        </div>
    )
  }
}
export default DropTarget(
  NativeTypes.FILE,
  spec,
  collect
)(EditorPane)
