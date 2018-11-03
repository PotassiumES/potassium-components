import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

/**
ButtonComponent displays a button, natch.
*/
const ButtonComponent = class extends Component {
	/**
	@param {DataObject} [dataObject]
	@param {Object} [options]
	@param {string} [options.text='']
	@param {number} [options.textSize]
	@param {number} [options.textColor]
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					flatDOM: dom.button({ class: 'button' }),
					portalDOM: dom.button({ class: 'button' }),
					textSize: 0.08,
					textColor: 0x444444,
					usesPortalSpatial: false
				},
				options
			),
			inheritedOptions
		)
		this.addClass('button-component')
		this.setName('ButtonComponent')

		this._text = ''

		const textMaterial = this.usesSOM
			? som.meshLambertMaterial({
					color: this.options.textColor
			  })
			: null

		this._portalText = this.options.usesPortalSpatial
			? som.text('', {
					material: textMaterial,
					size: this.options.textSize
			  })
			: null

		this._immersiveText = this.options.usesImmersive
			? som.text('', {
					material: textMaterial,
					size: this.options.textSize
			  })
			: null

		if (!this.options.portalSOM) {
			if (this.options.usesPortalSpatial) {
				this._portalButtonObj = som.obj('/static/potassium-components/models/Button.obj')
				this._portalButtonObj.name = 'Bracket'
				this.portalSOM.add(this._portalButtonObj)
				this.portalSOM.add(this._portalText)
			} else {
				this._portalButtonObj = null
			}
		}

		if (!this.options.immersiveSOM) {
			if (this.options.usesImmersive) {
				this._immersiveButtonObj = som.obj('/static/potassium-components/models/Button.obj')
				this._immersiveButtonObj.name = 'Bracket'
				this.immersiveSOM.add(this._immersiveButtonObj)
				this.immersiveSOM.add(this._immersiveText)
			} else {
				this._immersiveButtonObj = null
			}
		}

		this.listenTo(Component.ActionEvent, this, (eventName, actionName, value, actionParameters) => {
			switch (actionName) {
				case '/action/activate':
					this.trigger(ButtonComponent.ChangedEvent, value)
					break
			}
		})

		this.text = this.options.text || ''
	}

	/**
	Shows a visible alert for a short time and plays an audio alert
	*/
	showAlert() {
		this.addClass('primary-alert')
		Component.AudioManager.playSound('primary-alert')
		setTimeout(() => {
			this.removeClass('primary-alert')
		}, 1100)
	}

	/** @type {string} */
	get text() {
		return this._text
	}

	/** @param {string} value */
	set text(value) {
		this._text = value
		this.flatDOM.innerHTML = this._text
		this.portalDOM.innerHTML = this._text
		if (this._portalText) this._portalText.setText(this._text)
		if (this._immersiveText) this._immersiveText.setText(this._text)
	}
}
ButtonComponent.ChangedEvent = 'button-changed'

/** @todo Give component librarys a nice way to load a set of sounds instead of loading them in Component modules */
Component.AudioManager.setSound('primary-alert', '/static/potassium-components/audio/primary-alert.wav')

export default ButtonComponent
