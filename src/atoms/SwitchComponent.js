import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

/**
SwitchComponent gives the user the ability to flip a switch.
The switch may be on/off or momentary with push-to-break or push-to-make options.
*/
const SwitchComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	@param {string} [options.dataField=null] - a field in dataObject that this switch should reflect and control
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					dataField: null
				},
				options
			),
			inheritedOptions
		)
		this.addClass('switch-component')
		this.setName('SwitchComponent')
		this._on = null

		this._flatHandle = dom
			.div({
				class: 'handle'
			})
			.appendTo(this.flatDOM)
		this._portalHandle = dom
			.div({
				class: 'handle'
			})
			.appendTo(this.portalDOM)

		if (this.options.dataField) {
			this._updateFromData()
		} else {
			this.on = true
		}

		if (this.options.usesPortalSpatial) {
			this._portalObj = som.obj('/static/potassium-components/models/switch-component.obj', () => {
				this.portalSOM.styles.geometryIsDirty = true
				this._updateDisplay()
			})
			this._portalObj.name = 'SwitchOBJ'
			this.portalSOM.add(this._portalObj)
		} else {
			this._portalObj = null
		}

		if (this.options.usesImmersive) {
			this._immersiveObj = som.obj('/static/potassium-components/models/switch-component.obj', () => {
				this.immersiveSOM.styles.geometryIsDirty = true
				this._updateDisplay()
			})
			this._immersiveObj.name = 'SwitchOBJ'
			this.immersiveSOM.add(this._immersiveObj)
		} else {
			this._immersiveObj = null
		}

		this.listenTo(Component.ActionEvent, this, (eventName, actionName, value, actionParameters) => {
			switch (actionName) {
				case '/action/activate':
					this.on = !this.on
					break
			}
		})
	}

	get on() {
		return this._on
	}

	set on(value) {
		if (this._on === value) return
		this._on = value
		this._updateDisplay()
		if (this.dataObject && this.options.dataField) {
			this.dataObject.set(this.options.dataField, this._on)
		}
	}

	_updateFromData() {
		if (!this.dataObject || !this.options.dataField) return
		this._on = !!this.dataObject.get(this.options.dataField, false)
		this._updateDisplay()
	}

	_updateDisplay() {
		if (this._on) {
			this._flatHandle.innerText = this._portalHandle.innerText = 1
			this.removeClass('off')
			this.addClass('on')
			if (this._portalObj) {
				this._portalObj.querySelector('node[name=OnFrame]').visible = true
				this._portalObj.querySelector('node[name=One]').visible = true
				this._portalObj.querySelector('node[name=OffFrame]').visible = false
				this._portalObj.querySelector('node[name=Zero]').visible = false
			}
			if (this._immersiveObj) {
				this._immersiveObj.querySelector('node[name=OnFrame]').visible = true
				this._immersiveObj.querySelector('node[name=One]').visible = true
				this._immersiveObj.querySelector('node[name=OffFrame]').visible = false
				this._immersiveObj.querySelector('node[name=Zero]').visible = false
			}
		} else {
			this._flatHandle.innerText = this._portalHandle.innerText = 0
			this.addClass('off')
			this.removeClass('on')
			if (this._portalObj) {
				this._portalObj.querySelector('node[name=OnFrame]').visible = false
				this._portalObj.querySelector('node[name=One]').visible = false
				this._portalObj.querySelector('node[name=OffFrame]').visible = true
				this._portalObj.querySelector('node[name=Zero]').visible = true
			}
			if (this._immersiveObj) {
				this._immersiveObj.querySelector('node[name=OnFrame]').visible = false
				this._immersiveObj.querySelector('node[name=One]').visible = false
				this._immersiveObj.querySelector('node[name=OffFrame]').visible = true
				this._immersiveObj.querySelector('node[name=Zero]').visible = true
			}
		}
	}
}

export default SwitchComponent
