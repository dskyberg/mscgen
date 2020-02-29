import { observable, action, computed, toJS } from "mobx"

class MSC_Config {
    @observable elementId = "__svg"
    @observable inputType = "xu" // mscgen, mscgenny, xu, json
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
        this.svg = svg
    }

    @action setError(error) {
        this.error = error
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
            case 'inputType': this.inputType = value; break;
            case 'mirrorEntitiesOnBottom': this.mirrorEntitiesOnBottom = value; break;
            case 'additionalTemplate': this.additionalTemplate = value; break;
            case 'includeSource': this.includeSource = value; break;
            case 'regularArcTextVerticalAlignment': this.regularArcTextVerticalAlignment = value; break;
            case 'autoRender': this.autoRender = value; break;
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

        localStorage.setItem('msc-config', JSON.stringify(this.config))
    }

    getStoredState() {
        const configStr = localStorage.getItem('msc-config')
        if(configStr !== null) {
            const config = JSON.parse(configStr)
            Object.keys(config).forEach(key => {
                this.setConfigValue(key, config[key])
            })
        }
    }

}

const msc_config = new MSC_Config()
export default msc_config