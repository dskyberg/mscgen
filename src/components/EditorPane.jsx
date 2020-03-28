/**
* Copyright (c) 2020 David Skyberg and Swankymutt.com
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* EditorPane.jsx
*/
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'
import {observer} from 'mobx-react'
import AceEditor from "react-ace";
import {
  DropTarget,
} from 'react-dnd';

import { NativeTypes } from 'react-dnd-html5-backend';

import editorConfig from '../store/EditorConfig'

const styles = theme => ({
  editor_pane: {
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
        <div  className={classes.editor_pane}>
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
