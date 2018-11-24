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
	@param {number} [options.textSize=0.8] the size (in meters) of the text
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					text: '',
					placeholder: '',
					flatDOM: dom.input({ type: 'text' }),
					portalDOM: dom.input({ type: 'text' }),
					name: 'TextInputComponent'
				},
				options
			),
			inheritedOptions
		)
		this.addClass('text-input-component')
		this._handleTextInput = this._handleTextInput.bind(this)
		this._handleModelChange = this._handleModelChange.bind(this)

		this.acceptsTextInputFocus = true

		this._placeholderText = this.options.placeholder
		if (this._placeholderText) {
			this.flatDOM.setAttribute('placeholder', this._placeholderText)
			this.portalDOM.setAttribute('placeholder', this._placeholderText)
		}

		this._text = null
		this._shifted = false

		this.listenTo('input', this.flatDOM, ev => {
			this.text = this.flatDOM.value
		})
		this.listenTo('input', this.portalDOM, ev => {
			this.text = this.portalDOM.value
		})

		// Listen for changes to this.text based on Component.TextInputEvents
		this.listenTo(Component.TextInputEvent, this, this._handleTextInput)

		this._placeholderMaterial = this.usesSOM
			? som.meshLambertMaterial({
					side: THREE.DoubleSide
			  })
			: null

		if (this.usesPortalSpatial) {
			this._portalBracket = som.obj('/static/potassium-components/models/TextInputBracket.obj').appendTo(this.portalSOM)
			this._portalBracket.addClass('bracket')
			this._portalBracket.name = 'Bracket'
			this._portalCursor = som.obj('/static/potassium-components/models/TextInputCursor.obj').appendTo(this.portalSOM)
			this._portalCursor.addClass('cursor')
			this._portalCursor.name = 'Cursor'
			this._portalText = som
				.text('', {
					material: this._placeholderMaterial,
					size: this.options.textSize
				})
				.appendTo(this.portalSOM)
		} else {
			this._portalBracket = null
			this._portalCursor = null
			this._portalText = null
		}

		if (this.usesImmersive) {
			this._immersiveBracket = som
				.obj('/static/potassium-components/models/TextInputBracket.obj')
				.appendTo(this.immersiveSOM)
			this._immersiveBracket.addClass('bracket')
			this._immersiveBracket.name = 'Bracket'
			this._immersiveCursor = som
				.obj('/static/potassium-components/models/TextInputCursor.obj')
				.appendTo(this.immersiveSOM)
			this._immersiveCursor.addClass('cursor')
			this._immersiveCursor.name = 'Cursor'
			this._immersiveText = som
				.text('', {
					material: this._placeholderMaterial,
					size: this.options.textSize
				})
				.appendTo(this.immersiveSOM)
		} else {
			this._immersiveBracket = null
			this._immersiveCursor = null
			this._immersiveText = null
		}

		if (this.dataObject && this.options.dataField) {
			this.text = this.dataObject.get(this.options.dataField, '')
			this.listenTo(`changed:${this.options.dataField}`, this.dataObject, this._handleModelChange)
		} else {
			this.text = this.options.text
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
		if (this._text === value) return
		if (!value) value = ''
		this._text = value
		const usingPlaceholder = !value
		if (usingPlaceholder) {
			this.addClass('placeholder')
		} else {
			this.removeClass('placeholder')
		}
		if (this.usesPortalSpatial) this._portalText.setText(value || this._placeholderText)
		if (this.usesImmersive) this._immersiveText.setText(value || this._placeholderText)
		if (this.usesFlat) this.flatDOM.value = value
		if (this.usesPortalOverlay) this.portalDOM.value = value
		if (this.dataObject && this.options.dataField && this.dataObject.get(this.options.dataField) !== this._text) {
			this.dataObject.set(this.options.dataField, this._text)
		}
		this.trigger(TextInputComponent.TextChangeEvent, this._text)
	}
}
TextInputComponent.TextChangeEvent = 'text-input-change'
TextInputComponent.TextSubmitEvent = 'text-input-submit'

export default TextInputComponent
