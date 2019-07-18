import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import * as paths from 'potassium-es/src/Paths.js'

import Component from 'potassium-es/src/Component'

/** @todo Give component libraries a nice way to load a set of sounds instead of loading them in Component modules */
let _hasSetSounds = false
function _setSounds() {
	Component.AudioManager.setSound('primary-alert', paths.Static + '/potassium-components/audio/primary-alert.m4a')
	_hasSetSounds = true
}

/**
ButtonComponent displays a button, natch.
*/
const ButtonComponent = class extends Component {
	/**
	@param {DataObject} [dataObject]
	@param {Object} [options]
	@param {string} [options.text='']
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					flatDOM: dom.button({ class: 'button' }),
					portalDOM: dom.button({ class: 'button' })
				},
				options
			),
			inheritedOptions
		)
		this.addClass('button-component')
		this.setName('ButtonComponent')

		if (_hasSetSounds === false) _setSounds()

		this._text = ''

		const textMaterial = this.usesSOM
			? som.meshStandardMaterial({
					color: 0x000000,
					side: THREE.DoubleSide
			  })
			: null

		if (!this.options.portalSOM && this.options.usesPortalSpatial) {
			this._portalText = som.text('', {
				material: textMaterial
			})
			this.portalSOM.add(this._portalText)
		} else {
			this._portalText = null
		}

		if (!this.options.immersiveSOM && this.options.usesImmersive) {
			this._immersiveText = som.text('', {
				material: textMaterial
			})
			this.immersiveSOM.add(this._immersiveText)
		} else {
			this._immersiveText = null
		}

		this.listenTo(Component.ActionEvent, this, (eventName, actionName, active, value, actionParameters) => {
			switch (actionName) {
				case '/action/activate':
					this.trigger(ButtonComponent.ChangedEvent, active)
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

export default ButtonComponent
