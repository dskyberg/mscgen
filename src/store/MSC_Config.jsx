import { observable, action, computed, toJS } from "mobx"

class MSC_Config {
    @observable elementId = "__svg"
    @observable inputType = "xu" // mscgen, mscgenny, xu, json
    @observable mirrorEntitiesOnBottom = true
    @observable additionalTemplate = 'lazy' // lazy, classic, empty
    @observable includeSource = false
    @observable regularArcTextVerticalAlignment = 'middle' // above, middle, below
    @observable styleAdditions = null
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

    @action
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