import { observable, action, decorate, toJS } from "mobx"

class MSC_Config {
    elementId = "__svg"
    inputType = "xu" // mscgen, mscgenny, xu, json
    mirrorEntitiesOnBottom = true
    additionalTemplate = 'lazy' // lazy, classic, empty
    includeSource = false
    regularArcTextVerticalAlignment = 'middle' // above, middle, below
    styleAdditions = null

    setElementId(t) {
        this.elementId = t
    }

    setInputType(t) {
        this.inputType = t
    }

    setMirrorEntitiesOnBottom(t) {
        this.mirrorEntitiesOnBottom = t
    }

    setAdditionalTemplate(t) {
        this.additionalTemplate = t
    }

    setIncludeSource(t) {
        this.includeSource = t;
    }

    setRegularArcTextVerticalAlignment(t) {
        this.regularArcTextVerticalAlignment = t
    }

    setStyleAdditions(t) {
        this.styleAdditions = t
    }

    getConfig() {
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
}

decorate(MSC_Config, {
    inputType: observable,
    mirrorEntitiesOnBottom: observable,
    additionalTemplate: observable,
    setInputType: action,
    setMirrorEntitiesOnBottom: action,
    setAdditionalTemplate: action,
    setIncludeSource: action
})

const msc_config = new MSC_Config()
export default msc_config