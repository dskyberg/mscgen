import { observable, action, computed, toJS } from "mobx"

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

export const editorDefault = `msc {
    # Options
    wordwraparcs=true;

    # Entities
    a [label="A"],
    b [label="B"],
    c [label="C"];

    # Arcs
    a => b [label="A to B"];
    b -> c [label="B to C"];
    c >> b [label="C to B"];
    b =>> a [label="B to A"];
    a box a [label="box over A"];
    b rbox b [label="rbox over B"];
    c abox c [label="abox over C"];
    a note c [label="A note spanning A to C"];

  }`;


class EditorConfig {
    @observable editor = ""
    @observable mode = 'javascript'
    @observable theme = 'xcode'
    @observable fontSize = 14
    @observable showPrintMargin = false
    @observable showGutter = true
    @observable highlightActiveLine = true

    // Options
    @observable enableBasicAutocompletion = false
    @observable enableBasicAutocompletion
    @observable enableLiveAutocompletion = false
    @observable enableSnippets = false
    @observable showLineNumbers = true
    @observable tabSize = 2

    constructor() {
        this.getStoredState()
    }

    @action
    setEditor(value) {
        this.editor = value
        localStorage.setItem('editor', value)
    }

    @computed get config() {
        return {
            mode: toJS(this.mode),
            theme: toJS(this.theme),
            fontSize: toJS(this.fontSize),
            showPrintMargin: toJS(this.showPrintMargin),
            showGutter: toJS(this.showGutter),
            highlightActiveLine: toJS(this.highlightActiveLine),
        }
    }
    @computed get options() {
        const options = {
        //    enableBasicAutocompletion: toJS(this.enableBasicAutocompletion),
        //    enableLiveAutocompletion: toJS(this.enableLiveAutocompletion),
        //    enableSnippets: toJS(this.enableSnippets),
            showLineNumbers: toJS(this.showLineNumbers),
            tabSize: toJS(this.tabSize),
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

    getStoredState() {
        const savedEditor = localStorage.getItem('editor')
        if(savedEditor !== null) {
            this.editor = savedEditor
        }

        const configStr = localStorage.getItem('editor-config')
        if(configStr !== null) {
            const config = JSON.parse(configStr)
            Object.keys(config).forEach(key => {
                this.setConfigValue(key, config[key])
            })
        }
        const optionsStr = localStorage.getItem('editor-options')
        if(optionsStr !== null) {
            const options = JSON.parse(optionsStr)
            Object.keys(options).forEach(key => {
                this.setConfigValue(key, options[key])
            })
        }
    }
}

const editorConfig = new EditorConfig()
export default editorConfig