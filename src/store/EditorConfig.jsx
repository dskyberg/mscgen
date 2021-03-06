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
* EditorConfig.jsx
*/
import { observable, action, computed, toJS } from "mobx"
import { saveAs } from 'file-saver'
import parsePath from 'parse-filepath'
import mscConfig from './MSC_Config'


/*
  Import the Ace language support
*/
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";


/*
Import the Ace themes
*/
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
}
`;

const xuDefault = `xu {
  # Options
  wordwraparcs=true,
  width=auto;

  # Entities
  a [label="A"],
  b [label="B"],
  c [label="C"],
  d [label="D"];

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
  a loop d [label="3 times"]{
    a => b [label="A to B"];
  };
}
`;

const msgennyDefault = `a -> b : ab();
  a => c : automatically declares entities used in arcs;
  c =>> c : process(1);
  b <<= c : Has all mscgen arc types... ;
  b note b: ...notes + boxes ...;
  |||;
  --- : Labels usually don't need enclosing quotes;
  --- : "except when they contain , or ;";
  ...;
`;

const jsonDefault = `{
  "meta": {
    "extendedOptions": true,
    "extendedArcTypes": true,
    "extendedFeatures": true
  },
  "options": {
    "wordwraparcs": true,
    "width": "auto"
  },
  "entities": [
    {
      "name": "a",
      "label": "A"
    },
    {
      "name": "b",
      "label": "B"
    },
    {
      "name": "c",
      "label": "C"
    }
  ],
  "arcs": [
    [
      {
        "kind": "=>",
        "from": "a",
        "to": "b",
        "label": "A to B"
      }
    ],
    [
      {
        "kind": "->",
        "from": "b",
        "to": "c",
        "label": "B to C"
      }
    ],
    [
      {
        "kind": ">>",
        "from": "c",
        "to": "b",
        "label": "C to B"
      }
    ],
    [
      {
        "kind": "=>>",
        "from": "b",
        "to": "a",
        "label": "B to A"
      }
    ],
    [
      {
        "kind": "|||"
      }
    ],
    [
      {
        "kind": "box",
        "from": "a",
        "to": "a",
        "label": "box over A"
      }
    ],
    [
      {
        "kind": "rbox",
        "from": "b",
        "to": "b",
        "label": "rbox over B"
      }
    ],
    [
      {
        "kind": "abox",
        "from": "c",
        "to": "c",
        "label": "abox over C"
      }
    ],
    [
      {
        "kind": "note",
        "from": "a",
        "to": "c",
        "label": "A note spanning A to C"
      }
    ],
    [
      {
        "kind": "loop",
        "from": "a",
        "to": "c",
        "arcs": [
          [
            {
              "kind": "=>",
              "from": "a",
              "to": "b",
              "label": "A to B"
            }
          ]
        ],
        "label": "3 times"
      }
    ]
  ]
}
`;

export const Modes = {
  json: {display: 'json'},
  java: { display: 'java'},
  javascript: {display: 'javascript'}
}

export const Themes = {
ambiance: {display: 'ambiance'},
chaos: {display: 'chaos'},
chrome: {display: 'chrome'},
clouds: {display: 'clouds'},
clouds_midnight: {display: 'clouds_midnight'},
cobalt: {display: 'cobalt'},
crimson_editor: {display: 'crimson_editor'},
dawn: {display: 'dawn'},
dracula: {display: 'dracula'},
dreamweaver: {display: 'dreamweaver'},
eclipse: {display: 'eclipse'},
github: {display: 'github'},
gob: {display: 'gob'},
gruvbox: {display: 'gruvbox'},
idle_fingers: {display: 'idle_fingers'},
iplastic: {display: 'iplastic'},
katzenmilch: {display: 'katzenmilch'},
monokai: {display: 'monokai'},
xcode: {display: 'xcode'},
}

const arcTypes = {
    solid: 'a -- b',
    dotted: 'a .. b',
    signal: 'a -> b',
    bisignal: 'a <-> b',
    method: 'a => b',
    bimethod: 'a <=> b',
    return: 'a >> b',
    bireturn: 'a <<>> b',
    callback: 'a =>> b',
    bicallback: 'a <<=>> b',
    emphasis: 'a :> b',
    biemphasis: 'a <:> b',
    lost: 'a -x b'
}

const configAttrs = [
    'editor',
    'value',
    'mode',
    'theme',
    'fontSize',
    'showPrintMargin',
    'showGutter',
    'highlightActiveLine',
    'enableBasicAutocompletion',
    'enableBasicAutocompletion',
    'enableLiveAutocompletion',
    'enableSnippets',
    'tabSize',
    'showLineNumbers',
    'minLines',
]
class EditorConfig {
    @observable name = ''
    @observable editor = null
    @observable value = ''
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
    @observable minLines = 40

    // Options
    @observable showLineNumbers = true

    constructor() {
        this.getStoredState()
    }

    @action
    setEditor(editor) {
        this.editor = editor
    }

    @action setName(name) {
        if(Boolean(name) && name !== this.name) {
            this.name = name
            localStorage.setItem('editor-name', name)
        }
    }

    @action
    setValue(value) {
        this.value = value
        localStorage.setItem('value', value)
    }

    @action
    resetEditor() {
        const inputType = mscConfig.inputType
        switch (inputType) {
            case 'msgenny':
                this.setValue(msgennyDefault);
                this.setName('demo')
                break;
            case 'mscgen':
                this.setName('demo')
                this.setValue(mscDefault);
                break;
            case 'xu':
                this.setName('demo');
                this.setValue(xuDefault);
                break;
            case 'json':
                this.setName('demo');
                this.setValue(jsonDefault);
                break;
            default:
                console.log(`Reset Editor:  Error - unknown type: ${inputType}`)
                break;
        }
    }

    @computed
    get config() {
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
            minLines: toJS(this.minLines)
        }
    }
    @computed
    get options() {
        const options = {
            showLineNumbers: toJS(this.showLineNumbers),
        }
        return options
    }

    @action
    setConfigValue(name, value) {
        if(configAttrs.includes(name)) {
            this[name] = value
            return
        }
        console.log('Unknown value', value);
        throw new Error('Unknown value');
    }

    @action
    setConfig(name, value) {
        try {
            this.setConfigValue(name, value)
        } catch (err) {
            return
        }

        localStorage.setItem('editor-config', JSON.stringify(this.config))
        localStorage.setItem('editor-options', JSON.stringify(this.options))
    }

    @action
    addText(arcType) {
        this.editor.session.insert(this.editor.getCursorPosition(), this.getArcText(arcType))
    }

    /**
     * Loads the saved value and config from localStorage.
     * As a quick hack, if there is no saved state, then load
     * the msc/xu default doc.
     */
    getStoredState() {
        const savedValue = localStorage.getItem('value')
        if (Boolean(savedValue)) {
            this.value = savedValue
        } else {
            this.setValue(mscDefault)
        }
        const savedName = localStorage.getItem('editor-name')
        if(Boolean(savedName)) {
            this.name = savedName
        }

        const configStr = localStorage.getItem('editor-config')
        if (Boolean(configStr)) {
            const config = JSON.parse(configStr)
            Object.keys(config).forEach(key => {
                this.setConfigValue(key, config[key])
            })
        } else {
            localStorage.setItem('editor-config', JSON.stringify(this.config))
        }
        const optionsStr = localStorage.getItem('editor-options')
        if (Boolean(optionsStr)) {
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
    saveToFile() {

        const blob = new Blob([this.value], {
            type: "text/plain;charset=utf-8"
        });
        // Save the blob to a local file
        const ext = mscConfig.fileType()
        const fileName = Boolean(this.name) ? `${this.name}` : `${Math.floor(Date.now() / 1000)}`
        saveAs(blob, `${fileName}.${ext}`);
    }

    /**
     * Load a file from local drive to the editor.  This also does some work to
     * set the inputType based on the file extension.
     *
     * @param {*} file HTML5 javascript File object
     * @param {*} onClose Callback method.  Called after file ls loaded.
     */
    openFile(file, onClose) {
        if (!Boolean(file)) {
            if (Boolean(onClose)) {
                onClose()
            }
            console.log('Error: No filename to open')
            return
        }

        const fileReader = new FileReader()
        fileReader.onloadend = (e) => {
            const content = fileReader.result
            const path = parsePath(file.name)
            const ext = path.ext.slice(1)
            const name = path.name
            mscConfig.setError(null)
            mscConfig.setSvg(null)
            mscConfig.setConfig('inputType', ext)
            this.setName(name)
            this.setValue(content)
            if (Boolean(onClose)) {
                onClose()
            }
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
                this.value, {
                    inputType: mscConfig.inputType,
                    outputType: outputType
                })
            mscConfig.setError(null)
            mscConfig.setSvg(null)
            if (Boolean(setPreviewInputType)) {
                mscConfig.setConfig('inputType', outputType)
            }
            this.setValue(lResult)
        } catch (pError) {
            console.error(pError);
        }
    }

    getArcText(arcType) {
        const inputType = mscConfig.inputType
        const arcText = arcTypes[arcType]
        switch (inputType) {
            case 'msgenny':
                return `${arcText};`
            default:
                return `${arcText} [label=""];`
        }
    }
}


const editorConfig = new EditorConfig()
export default editorConfig