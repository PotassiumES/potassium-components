import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

/**
TextInputComponent shows the user a field or area in which to enter text.
*/
const TextInputComponent = class extends Component {
	/**
	@param {string} [options.text=''] initial text
	@param {string} [options.placeholder=''] text to show when the input is empty
	*/
	constructor(dataObject = null, options = {}) {
		super(
			dataObject,
			Object.assign(
				{
					flatDOM: dom.input({ type: 'text' }),
					portalDOM: dom.input({ type: 'text' })
				},
				options
			)
		)
		this.addClass('text-input-component')
		this.acceptsTextInputFocus = true

		this._handleTextInput = this._handleTextInput.bind(this)
		this._handleModelChange = this._handleModelChange.bind(this)

		this._placeholderText = options.placeholder || ''
		this.flatDOM.setAttribute('placeholder', this._placeholderText)
		this.portalDOM.setAttribute('placeholder', this._placeholderText)

		this._text = null
		this._shifted = false

		this.flatDOM.addEventListener('change', ev => {
			this.text = this.flatDOM.value
		})
		this.portalDOM.addEventListener('change', ev => {
			this.text = this.portalDOM.value
		})

		// Make changes to this.text based on Component.TextInputEvents
		this.addListener(this._handleTextInput, Component.TextInputEvent)

		const placeholderMaterial = som.meshLambertMaterial({ color: 0xdddddd })
		const textMaterial = som.meshLambertMaterial({ color: 0x999999 })

		this._portalBracket = som.obj('/static/potassium-components/models/TextInputBracket.obj')
		this.portalSOM.add(this._portalBracket)
		this._portalCursor = som.obj('/static/potassium-components/models/TextInputCursor.obj')
		this._portalCursor.position.set(0.04, 0.04, 0)
		this.portalSOM.add(this._portalCursor)
		this._portalText = som.text(this._text || this._placeholderText, placeholderMaterial, null, {
			size: 0.12
		})
		this._portalText.position.set(0.05, 0.05, 0)
		this.portalSOM.add(this._portalText)
		this.portalSOM.name = 'text-input'

		this._immersiveBracket = som.obj('/static/potassium-components/models/TextInputBracket.obj')
		this.immersiveSOM.add(this._immersiveBracket)
		this._immersiveCursor = som.obj('/static/potassium-components/models/TextInputCursor.obj')
		this._immersiveCursor.position.set(0.04, 0.04, 0)
		this.immersiveSOM.add(this._immersiveCursor)
		this._immersiveText = som.text(this._text || this._placeholderText, placeholderMaterial, null, {
			size: 0.12
		})
		this._immersiveText.position.set(0.05, 0.05, 0)
		this.immersiveSOM.add(this._immersiveText)
		this.immersiveSOM.name = 'text-input'

		if (this.dataObject && this.options.dataField) {
			this.text = this.dataObject.get(this.options.dataField) || this.options.text || ''
			this.dataObject.addListener((eventName, model, field, value) => {
				this._handleModelChange()
			}, `changed:${this.options.dataField}`)
		} else {
			this.text = options.text || ''
		}
	}
	_handleModelChange() {
		const value = this.dataObject.get(this.options.dataField, '')
		if (this.text === value) return
		this.text = value
	}
	_handleTextInput(eventName, actionParameters) {
		if (!actionParameters || typeof actionParameters.value === 'undefined') return
		let value = actionParameters.value
		// Handle control input
		switch (value) {
			case 'delete':
				if (!this._text || this._text.length == 0) return
				this.text = this._text.substring(0, this._text.length - 1)
				return
			case 'shift':
				this._shifted = !this._shifted
				return
			case 'space':
				value = ' '
				break
			case 'tab':
				value = '\t'
				break
			case 'return':
				this.trigger(TextInputComponent.TextSubmitEvent, this._text)
				this.text = ''
				return
			case 'tray':
			case 'left':
			case 'up':
			case 'right':
			case 'down':
			case 'control':
			case 'alt':
			case 'meta':
				return
		}
		// Ok, it's text
		this.text = this._text + (this._shifted ? value.toUpperCase() : value)
		this._shifted = false
	}
	get text() {
		return this._text
	}
	set text(value) {
		if (this._text !== value) {
			this._portalText.setText(value || this._placeholderText)
			this._immersiveText.setText(value || this._placeholderText)
		}
		this._text = value
		this.flatDOM.value = value
		this.portalDOM.value = value
		if (this.dataObject && this.options.dataField) {
			if (this.dataObject.get(this.options.dataField) !== this._text) {
				this.dataObject.set(this.options.dataField, this._text)
			}
		}
		this.trigger(TextInputComponent.TextChangeEvent, this._text)
	}
}
TextInputComponent.TextChangeEvent = 'text-input-change'
TextInputComponent.TextSubmitEvent = 'text-input-submit'

export default TextInputComponent
