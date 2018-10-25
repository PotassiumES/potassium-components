import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

/**
CheckboxComponent provides a UI for toggling a value on and off using activation
*/
const CheckboxComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject = null, options = {}) {
		super(
			dataObject,
			Object.assign(
				{
					flatDOM: dom.input({ type: 'checkbox' }),
					portalDOM: dom.input({ type: 'checkbox' })
				},
				options
			)
		)
		this.addClass('checkbox-component')
		this._checked = options.checked === true
		this._portalCheckSOM = null
		this._immersiveCheckSOM = null

		this._portalObj = som.obj('/static/potassium-components/models/Checkbox.obj', (group, obj) => {
			this._portalCheckSOM = obj.children[0]
			this._updateCheckedDisplay(this._checked)
		})
		this.portalSOM.add(this._portalObj)
		this.portalSOM.name = 'checkbox'

		this._immersiveObj = som.obj('/static/potassium-components/models/Checkbox.obj', (group, obj) => {
			this._immersiveCheckSOM = obj.children[0]
			this._updateCheckedDisplay(this._checked)
		})
		this.immersiveSOM.add(this._immersiveObj)
		this.immersiveSOM.name = 'checkbox'

		// We handle the clicks through Action-input, so turn off the default browser action
		this.flatDOM.addEventListener('click', ev => {
			ev.preventDefault()
		})
		this.portalDOM.addEventListener('click', ev => {
			ev.preventDefault()
		})

		// Toggle on activate events from Action-input
		this.addListener((eventName, actionName, value, actionParameters) => {
			switch (actionName) {
				case '/action/activate':
					if (value) {
						this.checked = !this.checked
					}
					break
			}
		}, Component.ActionEvent)

		this._updateCheckedDisplay(this._checked)
	}

	set checked(value) {
		if (value === this._checked) return
		this._checked = value
		this._updateCheckedDisplay(value)
		this.trigger(CheckboxComponent.CheckChangedEvent, this._checked)
	}
	get checked() {
		return this._checked
	}

	_updateCheckedDisplay(checked) {
		this.flatDOM.checked = checked
		this.portalDOM.checked = checked
		if (this._portalCheckSOM) {
			this._portalCheckSOM.visible = checked
		}
		if (this._immersiveCheckSOM) {
			this._immersiveCheckSOM.visible = checked
		}
	}
}
CheckboxComponent.CheckChangedEvent = 'checkbox-check-changed'

export default CheckboxComponent
