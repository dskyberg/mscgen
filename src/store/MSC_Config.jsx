/*
    Copyright (c) 2020 by David Skyberg
*/
import { observable, action, computed, toJS } from "mobx"
import { saveAs } from 'file-saver'
import editorConfig from './EditorConfig'

const InputTypes = [
    'msgenny',
    'mscgen',
    'xu',
    'json'
]

class MSC_Config {
    @observable elementId = "__svg"
    @observable inputType = "xu" // mscgen, msgenny, xu, json
    @observable mirrorEntitiesOnBottom = true
    @observable additionalTemplate = 'lazy' // lazy, classic, empty
    @observable includeSource = false
    @observable regularArcTextVerticalAlignment = 'middle' // above, middle, below
    @observable styleAdditions = null
    @observable autoRender = true
    @observable error = null
    @observable svg = null

    constructor() {
        this.getStoredState()
    }

    @action setSvg(svg) {
        this.svg = Boolean(svg) ? svg : null
    }

    @action setError(error) {
        this.error = Boolean(error) ? error : null
    }

    @action
    setInputType(inputType) {
        if(!Boolean(inputType)){
            console.log('MSCConfig.setInputType: No value')
            return
        }
        if(inputType === this.inputType) {
            return
        }
        if(InputTypes.includes(inputType)) {
            if(Boolean(editorConfig) && Boolean(editorConfig.value)){
                editorConfig.transpile(inputType, false)
            }
            this.inputType = inputType
            return
        }
        throw new Error(`MSC_Config.setInputType: invalid type: ${inputType}`)
    }


    @computed get config() {
        const config = {
            elementId: this.elementId,
            inputType: this.inputType,
            mirrorEntitiesOnBottom: this.mirrorEntitiesOnBottom,
            additionalTemplate: this.additionalTemplate,
            includeSource: this.includeSource,
            regularArcTextVerticalAlignment: this.regularArcTextVerticalAlignment,
            autoRender: this.autoRender,
        }
        if (this.styleAdditions !== null) {
            config.styleAdditions = this.styleAdditions
        }
        return toJS(config)
    }

    @action
    setConfigValue(name, value) {
        switch(name) {
            case 'elementId': this.elementId = value; break;
            case 'inputType': this.setInputType(value); break;
            case 'mirrorEntitiesOnBottom': this.mirrorEntitiesOnBottom = value; break;
            case 'fixedNamedStyle':
            case 'additionalTemplate': this.additionalTemplate = value; break;
            case 'includeSource': this.includeSource = value; break;
            case 'regularArcTextVerticalAlignment': this.regularArcTextVerticalAlignment = value; break;
            case 'autoRender': this.autoRender = value; break;
            default: console.log('Unknown name+value', name, value); throw new Error('Unknown value');
        }
    }

    @action
    setConfig(name, value) {
        try {
            this.setConfigValue(name,value)
        } catch(err) {
            return
        }

        localStorage.setItem('msc-config', JSON.stringify(this.config))
    }

    getStoredState() {
        const configStr = localStorage.getItem('msc-config')
        if(Boolean(configStr)) {
            const config = JSON.parse(configStr)
            Object.keys(config).forEach(key => {
                this.setConfigValue(key, config[key])
            })
        } else {
            localStorage.setItem('msc-config', JSON.stringify(this.config))
        }
    }

    /**
     * Provide the correct file extension by script type
     */
    fileType() {
        // mscgen, mscgenny, xu, json
        if(this.inputType === 'msgenny'){
            return 'msgenny'
        }
        if(this.inputType === 'json') {
            return 'json'
        }
        if(this.inputType === 'xu'){
            return 'xu'
        }
        return 'mscgen'
    }

    /**
     * Save the rendered SVG to a file.
     * If a name is provided, the file is saved as `${name}.svg`
     * If no name is provided, the current time stamp is used.
     */
    saveToFile(name) {
        const payload = this.svg
        const blob = new Blob([payload], {
          type: "image/svg+xml"
        });
        // Save the blob to a local file
        const fileName = Boolean(name) ? `${name}.svg` : `${Math.floor(Date.now() / 1000)}.svg`
        saveAs(blob, fileName);
      }

}

const mscConfig = new MSC_Config()
export default mscConfig