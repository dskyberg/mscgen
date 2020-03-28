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
* MSC_Config.jsx
*/
import { observable, action, computed, toJS } from "mobx"
import { saveAs } from 'file-saver'
import editorConfig from './EditorConfig'

export const InputTypes = {
    xu: {display: 'Xu'},
    msc: {display: 'MSC'},
    msgenny: {display: 'Msgenny'},
    json: {display: 'JSON'}
}

export const AdditionalTemplates = {
    cygne: {display: 'Cygne'},
    lazy: {display: 'Lazy'},
    classic: {display: 'Classic'},
    pegasse: {display: 'Pegasse'},
    fountainpen: {display: 'Fountain pen'},
    empty: {display: 'No entity boxes'}
}


export const VerticalAlignments = {
    above: {display: 'Above'},
    middle :{display: 'Middle'},
    below: {display: 'Below'}
}

class MSC_Config {
    @observable elementId = "__svg"
    @observable inputType = Object.keys(InputTypes)[0]
    @observable mirrorEntitiesOnBottom = true
    @observable additionalTemplate = Object.keys(AdditionalTemplates)[0]
    @observable includeSource = false
    @observable regularArcTextVerticalAlignment = Object.keys(VerticalAlignments)[0]
    @observable styleAdditions = null
    @observable autoRender = true
    @observable error = null
    @observable svg = null
    // Playing with letting this class own rendering
    @observable svgElem = null

    constructor() {
        this.getStoredState()

    }

    @action
    setSvg = (svg) => {
        this.svg = Boolean(svg) ? svg : null
    }

    @action
    setError = (error) => {
        this.error = Boolean(error) ? error : null
    }

    @action
    setInputType = (inputType) => {
        if(!Boolean(inputType) || inputType === this.inputType){
            return
        }
        if(inputType in InputTypes) {
            if(Boolean(editorConfig) && Boolean(editorConfig.value)){
                editorConfig.transpile(inputType, false)
            }
            this.inputType = inputType
            return
        }
        throw new Error(`MSC_Config.setInputType: invalid type: ${inputType}`)
    }

    @action
    setAdditionalTemplate = (value) => {
        if(!Boolean(value)) {
            return
        }
        const val = value.toLowerCase()
        if(val === this.additionalTemplate) {
            return
        }
        if(val in AdditionalTemplates) {
            this.additionalTemplate = val
        } else {
            throw new Error(`MSC_Config.setAdditionalTemplate: invalid value: ${value}`)
        }
    }

    @action
    setVerticalAlignment = (value) => {
        if(!Boolean(value)) {
            return
        }
        const val = value.toLowerCase()
        if(val in VerticalAlignments) {
            this.regularArcTextVerticalAlignment = val
        } else {
            throw new Error(`MSC_Config.setAVerticalAlignments: invalid value: ${value}`)
        }
    }

    @action
    setConfigValue = (name, value) => {
        switch(name) {
            case 'elementId': this.elementId = value; break;
            case 'inputType': this.setInputType(value); break;
            case 'mirrorEntitiesOnBottom': this.mirrorEntitiesOnBottom = value; break;
            case 'additionalTemplate': this.setAdditionalTemplate(value); break;
            case 'includeSource': this.includeSource = value; break;
            case 'regularArcTextVerticalAlignment': this.setVerticalAlignment(value); break;
            case 'autoRender': this.autoRender = value; break;
            default: console.log('Unknown name+value', name, value); throw new Error('Unknown value');
        }
    }

    @action
    setConfig = (name, value) => {
        try {
            this.setConfigValue(name,value)
            localStorage.setItem('msc-config', JSON.stringify(this.config))
        } catch(err) {
            return
        }
    }

    @computed get config() {
        const config = {
            elementId: this.elementId,
            inputType: this.inputType,
            mirrorEntitiesOnBottom: this.mirrorEntitiesOnBottom,
            includeSource: this.includeSource,
            regularArcTextVerticalAlignment: this.regularArcTextVerticalAlignment,
            autoRender: this.autoRender,
        }
        if(Boolean(this.additionalTemplate)) {
            config.additionalTemplate = this.additionalTemplate
        }
        if (this.styleAdditions !== null) {
            config.styleAdditions = this.styleAdditions
        }
        return toJS(config)
    }

    getStoredState = () => {
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
    fileType = () => {
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
    saveToFile = () => {
        const payload = this.svg
        const blob = new Blob([payload], {
          type: "image/svg+xml"
        });
        // Save the blob to a local file
        const fileName = Boolean(editorConfig.name) ? `${editorConfig.name}.svg` : `${Math.floor(Date.now() / 1000)}.svg`
        saveAs(blob, fileName);
      }

      /**
       * Gets set during React reference initialization in PreviewPane.
       * This is necessary in order to support popout windows with createPortal.
       */
    @action
    setSvgElem = (elem) => {
        this.svgElem = elem
    }

    /**
     *
     * @param {function} onError
     */
    render = (onError) => {
        const local_config = this.config
        const script = editorConfig.value
        if (!Boolean(this.svgElem)) {
            // The __svg div doesn't appear to exist.  Bale out
            // throw new Error("Can't find id of target element to render to")
            return
        }
        //    const elem = document.getElementById('__svg')
        // If svgElem was set, then use that to render into
        let elem
        if(Boolean(this.svgElem)) {
            elem = this.svgElem
        } else {
            elem = document.getElementById('__svg')
        }
        if(!Boolean(elem)) {
            console.log('render: No element to render to')
            return
        }
        // Set the window for the element.  Not necessary unless supporting portals
        const win = elem.ownerDocument.defaultView || elem.ownerDocument.parentWindow
        local_config['window'] = win

        // Always clear the existing svg, or we get some strange overlay conditions
        elem.innerHTML = ''
        this.setSvg(null)
        this.setError(null)

        require('mscgenjs').renderMsc(
            script,
            local_config,
            (pError, pSuccess) => {
                if (Boolean(pError)) {
                    this.setError(pError)
                    if (onError) {
                        onError(pError)
                    }
                    return;
                }
                if (Boolean(pSuccess)) {
                    // pSuccess holds the svg
                    this.setSvg(pSuccess)
                    return;
                }
                console.log('Wat! Error nor success?');
            }
        );
    }


}

const mscConfig = new MSC_Config()
export default mscConfig