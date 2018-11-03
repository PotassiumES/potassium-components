import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

/**
TextComponent holds a string which may include paragraphs but not other media.
*/
const TextComponent = class extends Component {
	/**
	@param {Object} [options={}] see the {@link Component} options
	@param {string} [options.text=''] the initial text shown in the heading
	@param {number} [options.textSize=0.8] the size (in meters) of the text
	@param {number} [options.textColor=0x444444] = the color of the text
	@param {string} [options.textField=null] a field in the dataObject to bind to as the text
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					textSize: 0.08,
					textColor: 0x444444
				},
				options
			),
			inheritedOptions
		)
		this.addClass('text-component')
		this.setName('TextComponent')
		this._updateTextFromData = this._updateTextFromData.bind(this)

		this._text = ''

		this._textMaterial = this.usesSOM
			? som.meshLambertMaterial({
					color: this.options.textColor
			  })
			: null

		if (this.usesPortalSpatial) {
			this._portalText = som.text(this._text, {
				size: this.options.textSize,
				material: this._textMaterial
			})
			this.portalSOM.add(this._portalText)
		} else {
			this._portalText = null
		}

		if (this.usesImmersive) {
			this._immersiveText = som.text(this._text, {
				size: this.options.textSize,
				material: this._textMaterial
			})
			this.immersiveSOM.add(this._immersiveText)
		} else {
			this._immersiveText = null
		}

		if (typeof this.options.text === 'string') {
			this.text = this.options.text
		}
		if (this.dataObject && typeof this.options.textField === 'string') {
			this.dataObject.addListener(this._updateTextFromData, `changed:${this.options.textField}`)
			this._updateTextFromData()
		}
	}

	cleanup() {
		super.cleanup()
		if (this.dataObject) this.dataObject.removeListener(this._updateTextFromData)
	}

	/** @type {string} */
	get text() {
		return this._text
	}
	/** @type {string} */
	set text(value) {
		if (this._text === value) return
		this._text = value || ''
		this._updateDisplayFromText()
	}

	_updateTextFromData() {
		if (!this.dataObject || !this.options.textField) return
		this.text = this.dataObject.get(this.options.textField) || ''
	}

	_updateDisplayFromText() {
		if (this.usesFlat) this.flatDOM.innerText = this._text
		if (this.usesPortalOverlay) this.portalDOM.innerText = this._text
		if (this.usesPortalSpatial) this._portalText.setText(this._text)
		if (this.usesImmersive) this._immersiveText.setText(this._text)
	}
}

export default TextComponent
