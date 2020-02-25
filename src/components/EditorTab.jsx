import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react'
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-xcode";
import editorConfig from '../store/EditorConfig'

/*
const editorConfig = {
  mode: 'javascript',
  theme: 'xcode',
  fontSize: 14,
  showPrintMargin: true,
  showGutter: true,
  highlightActiveLine: true
}
const editorOptions = {
  enableBasicAutocompletion: false,
  enableLiveAutocompletion: false,
  enableSnippets: false,
  showLineNumbers: true,
  tabSize: 2,
}
*/


export default @observer class EditorTab extends React.Component {

    static propTypes = {
      onChange: PropTypes.func,
      onLoad: PropTypes.func,
      markers: PropTypes.array,
    }

    render() {
    const {onChange, onLoad, markers} = this.props
    const content = editorConfig.editor
    const options = editorConfig.options
    const config = editorConfig.config
    return (
        <div  >
          <AceEditor width="1200" maxLines={Infinity} onChange={ onChange } onLoad={onLoad} value={ content } markers={ markers } setOptions={ options } {...config}/>
        </div>
    )
  }
}
