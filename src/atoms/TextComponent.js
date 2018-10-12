import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
TextComponent holds a string which may include paragraphs but not other media.
*/
const TextComponent = class extends Component {
	/**
	@param {Object} [options={}] see the {@link Component} options
	@param {string} [options.text=''] the initial text shown in the heading
	@param {string} [options.textField=null] a field in the dataObject to bind to as the text
	*/
	constructor(dataObject = null, options = {}) {
		super(
			dataObject,
			Object.assign(
				{
					textSize: 0.08,
					textHeight: 0.01,
					textColor: 0x444444
				},
				options
			)
		)
		this.addClass('text-component')
		this._updateTextFromData = this._updateTextFromData.bind(this)

		this._text = ''

		this._textMaterial = graph.meshLambertMaterial({
			color: this.options.textColor
		})

		this._portalText = graph.text(this._text, this._textMaterial, null, {
			size: this.options.textSize,
			height: this.options.textHeight
		})
		this.portalGraph.add(this._portalText)

		this._immersiveText = graph.text(this._text, this._textMaterial, null, {
			size: this.options.textSize,
			height: this.options.textHeight
		})
		this.immersiveGraph.add(this._immersiveText)

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
		this.flatEl.innerText = this._text
		this.portalEl.innerText = this._text
		this._portalText.setText(this._text)
		this._immersiveText.setText(this._text)
	}
}

export default TextComponent
