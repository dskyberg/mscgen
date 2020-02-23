import { observable, action, decorate, toJS } from "mobx"

class MSC_Config {
    elementId = "__svg"
    inputType = "xu" // mscgen, mscgenny, xu, json
    mirrorEntitiesOnBottom = true
    additionalTemplate = 'lazy' // lazy, classic, empty
    includeSource = false
    regularArcTextVerticalAlignment = 'middle' // above, middle, below
    styleAdditions = null

    constructor() {
        this.getStoredState()
    }

    config() {
        const config = {
            elementId: toJS(this.elementId),
            inputType: toJS(this.inputType),
            mirrorEntitiesOnBottom: toJS(this.mirrorEntitiesOnBottom),
            additionalTemplate: toJS(this.additionalTemplate),
            includeSource: toJS(this.includeSource),
            regularArcTextVerticalAlignment: toJS(this.regularArcTextVerticalAlignment)
        }
        if (this.styleAdditions !== null) {
            config.styleAdditions = toJS(this.styleAdditions)
        }
        return config
    }

    setConfigValue(name, value) {
        switch(name) {
            case 'elementId': this.elementId = value; break;
            case 'inputType': this.inputType = value; break;
            case 'mirrorEntitiesOnBottom': this.mirrorEntitiesOnBottom = value; break;
            case 'additionalTemplate': this.additionalTemplate = value; break;
            case 'includeSource': this.includeSource = value; break;
            case 'regularArcTextVerticalAlignment': this.regularArcTextVerticalAlignment = value; break;
            default: console.log('Unknown value', value); throw new Error('Unknown value');
        }
    }

    setConfig(name, value) {
        try {
            this.setConfigValue(name,value)
        } catch(err) {
            return
        }

        localStorage.setItem('msc-config', JSON.stringify(this.config()))
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

decorate(MSC_Config, {
    elementId: observable,
    inputType: observable,
    mirrorEntitiesOnBottom: observable,
    additionalTemplate: observable,
    includeSource: observable,
    regularArcTextVerticalAlignment: observable,
    setConfigValue:action,
    setConfig:action
})

const msc_config = new MSC_Config()
export default msc_config