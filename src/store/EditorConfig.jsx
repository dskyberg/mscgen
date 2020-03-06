/*
    Copyright (c) 2020 by David Skyberg
*/
import { observable, action, computed, toJS } from "mobx"
import { saveAs } from 'file-saver'
import parsePath from 'parse-filepath'
import mscConfig from './MSC_Config'


export const modes = [
    'ABAP',
    'ABC',
    'ActionScript',
    'ADA',
    'Apache_Conf',
    'AsciDoc',
    'Assembly_x86',
    'AutoHotKey',
    'BatchFile',
    'C9Search',
    'C_Cpp',
    'Cirru',
    'Clojure',
    'Cobol',
    'coffee',
    'ColdFusion',
    'CSharp',
    'CSS',
    'Curly',
    'D',
    'Dart',
    'Diff',
    'Dockerfile',
    'Dot',
    'Dummy',
    'DummySyntax',
    'Eiffel',
    'EJS',
    'Elixir'
]

const mscDefault = `msc {
        # Options
        wordwraparcs=true,
        width=auto;

        # Entities
        a [label="A"],
        b [label="B"],
        c [label="C"];

        # Arcs
        a => b [label="A to B"];
        b -> c [label="B to C"];
        c >> b [label="C to B"];
        b =>> a [label="B to A"];
        |||; // Throw in a break
        a box a [label="box over A"];
        b rbox b [label="rbox over B"];
        c abox c [label="abox over C"];
        a note c [label="A note spanning A to C"];

        // alt, opt, loop, par, exc, break, seq, strict,
        // neg, ignore, consider, and assert
        a loop c [label="3 times"]{
         a => b [label="A to B"];

        };
  }`;

const msgennyDefault = `a -> b : ab();
  a => c : automatically declares entities used in arcs;
  c =>> c : process(1);
  b <<= c : Has all mscgen arc types... ;
  b note b: ...notes + boxes ...;
  |||;
  --- : Labels usually don't need enclosing quotes;
  --- : "except when they contain , or ;";
  ...;
  `

class EditorConfig {
    @observable editor = null
    @observable value = ""
    @observable mode = 'javascript'
    @observable theme = 'xcode'
    @observable fontSize = 14
    @observable showPrintMargin = false
    @observable showGutter = true
    @observable highlightActiveLine = true
    @observable enableBasicAutocompletion = false
    @observable enableBasicAutocompletion
    @observable enableLiveAutocompletion = false
    @observable enableSnippets = false
    @observable tabSize = 2

    // Options
   @observable showLineNumbers = true

    constructor() {
        this.getStoredState()
    }

    @action
    setEditor(editor) {
        this.editor = editor
    }

    @action
    setValue(value) {
        this.value = value
        localStorage.setItem('value', value)
    }

    @action
    resetEditor() {
        const inputType = mscConfig.inputType
        switch(inputType) {
            case 'msgenny': this.setValue(msgennyDefault); break;
            default: this.setValue(mscDefault); break;
        }
    }

    @computed get config() {
        return {
            mode: toJS(this.mode),
            theme: toJS(this.theme),
            fontSize: toJS(this.fontSize),
            showPrintMargin: toJS(this.showPrintMargin),
            showGutter: toJS(this.showGutter),
            highlightActiveLine: toJS(this.highlightActiveLine),
            enableBasicAutocompletion: toJS(this.enableBasicAutocompletion),
            enableLiveAutocompletion: toJS(this.enableLiveAutocompletion),
            enableSnippets: toJS(this.enableSnippets),
            tabSize: toJS(this.tabSize),
        }
    }
    @computed get options() {
        const options = {
            showLineNumbers: toJS(this.showLineNumbers),
        }
        return options
    }

    @action
    setConfigValue(name, value) {
        switch(name) {
            case 'mode': this.mode = value; break;
            case 'theme': this.theme = value; break;
            case 'fontSize': this.fontSize = value; break;
            case 'showPrintMargin': this.showPrintMargin = value; break;
            case 'showGutter': this.showGutter = value; break;
            case 'highlightActiveLine': this.highlightActiveLine = value; break;
            case 'enableBasicAutocompletion': this.enableBasicAutocompletion = value; break;
            case 'enableLiveAutocompletion': this.enableLiveAutocompletion = value; break;
            case 'enableSnippets': this.enableSnippets = value; break;
            case 'showLineNumbers': this.showLineNumbers = value; break;
            case 'tabSize': this.tabSize = value; break;
            default: console.log('Unknown value', value); throw new Error('Unknown value');
        }
    }

    @action
    setConfig(name, value) {
        try {
            this.setConfigValue(name,value)
        } catch(err) {
            return
        }

        localStorage.setItem('editor-config', JSON.stringify(this.config))
        localStorage.setItem('editor-options', JSON.stringify(this.options))
    }

    /**
     * Loads the saved value and config from localStorage.
     * As a quick hack, if there is no saved state, then load
     * the msc/xu default doc.
     */
    getStoredState() {
        const savedValue = localStorage.getItem('value')
        if(Boolean(savedValue)) {
            this.value = savedValue
        } else {
            this.setValue(mscDefault)
        }

        const configStr = localStorage.getItem('editor-config')
        if(Boolean(configStr)) {
            const config = JSON.parse(configStr)
            Object.keys(config).forEach(key => {
                this.setConfigValue(key, config[key])
            })
        } else {
            localStorage.setItem('editor-config', JSON.stringify(this.config))
        }
        const optionsStr = localStorage.getItem('editor-options')
        if(Boolean(optionsStr)) {
            const options = JSON.parse(optionsStr)
            Object.keys(options).forEach(key => {
                this.setConfigValue(key, options[key])
            })
        } else {
            localStorage.setItem('editor-options', JSON.stringify(this.options))
        }
    }

    /**
     * Save the editor contents to a file.
     * The extension will match the script type.
     * If a name is provided, the file is saved as `${name}.${type}`
     * If no name is provided, the current time stamp is used.
     */
    saveToFile(name) {

        const blob = new Blob([this.value], {
          type: "text/plain;charset=utf-8"
        });
        // Save the blob to a local file
        const ext = mscConfig.fileType()
        const fileName = Boolean(name) ? `${name}.${ext}` : `${Math.floor(Date.now() / 1000)}.${ext}`
        saveAs(blob, `${Math.floor(Date.now() / 1000)}.${ext}`);
      }

      openFile(file, onClose) {
          if(!Boolean(file)){
              if(Boolean(onClose)){
                  onClose()
              }
              console.log('Error: No filename to open')
              return
          }

        const fileReader = new FileReader()
        fileReader.onloadend = (e) => {
            const content = fileReader.result
            const ext =  parsePath(file.name).ext.slice(1)
            mscConfig.setError(null)
            mscConfig.setSvg(null)
            mscConfig.setConfig('inputType', ext)
            this.setValue(content)
            onClose(file);
          }

        try {
          fileReader.readAsText(file)
        } catch (error) {
          console.log(error)
        }
      }

     transpile(outputType, setPreviewInputType) {
      try {

        let lResult = require('mscgenjs').translateMsc(
            this.value,{inputType: mscConfig.inputType, outputType: outputType })
        mscConfig.setError(null)
        mscConfig.setSvg(null)
        if(Boolean(setPreviewInputType)) {
            mscConfig.setConfig('inputType', outputType)
        }
        this.setValue(lResult)
        console.log(lResult);
      } catch (pError) {
        console.error(pError);
      }
    }
}

const editorConfig = new EditorConfig()
export default editorConfig