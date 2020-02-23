import React from 'react';
import PropTypes from 'prop-types';
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

export default function EditorTab(props) {
    const {onChange, onLoad, content, markers, pos, active} = props

    return (
        <div hidden={ pos !== active } >
          <AceEditor width="1200" maxLines={Infinity} onChange={ onChange } onLoad={onLoad} value={ content } markers={ markers } setOptions={ editorConfig.options() } {...editorConfig.config()}/>
        </div>
    )
}

EditorTab.propTypes = {
  onChange: PropTypes.func,
  onLoad: PropTypes.func,
  content: PropTypes.any,
  markers: PropTypes.array,
  pos: PropTypes.number,
  active: PropTypes.number,
}


