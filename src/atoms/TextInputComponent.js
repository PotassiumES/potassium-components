import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import * as paths from 'potassium-es/src/Paths.js'

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

		this._textMaterial = this.usesSOM
			? som.meshStandardMaterial({
					color: 0x000000,
					side: som.DoubleSide
			  })
			: null

		if (this.usesPortalSpatial) {
			this._portalText = som
				.text('', {
					material: this._textMaterial,
					size: this.options.textSize
				})
				.appendTo(this.portalSOM)
			this._portalCursor = som
				.obj(paths.Static + '/potassium-components/models/text-input-cursor.obj')
				.appendTo(this.portalSOM)
			this._portalCursor.addClass('cursor')
			this._portalCursor.visible = false
			this._portalCursor.name = 'Cursor'
		} else {
			this._portalCursor = null
			this._portalText = null
		}

		if (this.usesImmersive) {
			this._immersiveText = som
				.text('', {
					material: this._textMaterial,
					size: this.options.textSize
				})
				.appendTo(this.immersiveSOM)
			this._immersiveCursor = som
				.obj(paths.Static + '/potassium-components/models/text-input-cursor.obj')
				.appendTo(this.immersiveSOM)
			this._immersiveCursor.addClass('cursor')
			this._immersiveCursor.visible = false
			this._immersiveCursor.name = 'Cursor'
		} else {
			this._immersiveCursor = null
			this._immersiveText = null
		}

		if (this.dataObject && this.options.dataField) {
			this.text = this.dataObject.get(this.options.dataField, '')
			this.listenTo(`changed:${this.options.dataField}`, this.dataObject, this._handleModelChange)
		} else {
			this.text = this.options.text
		}

		this.listenTo(Component.FocusEvent, this, () => {
			if (this._portalCursor) this._portalCursor.visible = true
			if (this._immersiveCursor) this._immersiveCursor.visible = true
		})
		this.listenTo(Component.BlurEvent, this, () => {
			if (this._portalCursor) this._portalCursor.visible = false
			if (this._immersiveCursor) this._immersiveCursor.visible = false
		})
	}
	_handleModelChange() {
		this.text = this.dataObject.get(this.options.dataField, '')
	}
	_handleTextInput(eventName, commands) {
		for (const command of commands) {
			this._handleTextCommand(command)
		}
	}
	_handleTextCommand(command) {
		switch (command) {
			case 'delete':
				if (!this._text || this._text.length == 0) return
				this.text = this._text.substring(0, this._text.length - 1)
				return
			case 'shift':
				this._shifted = !this._shifted
				return
			case 'space':
				command = ' '
				break
			case 'tab':
				command = '\t'
				break
			case 'enter':
				this.trigger(TextInputComponent.TextSubmitEvent, this._text)
				this.text = ''
				return
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
		this.text = this._text + (this._shifted ? command.toUpperCase() : command)
		this._shifted = false
	}
	get text() {
		return this._text
	}
	set text(value) {
		value = value || ''
		if (this._text === value) return
		this._text = value
		const usingPlaceholder = !this._text
		if (usingPlaceholder) {
			this.addClass('placeholder')
		} else {
			this.removeClass('placeholder')
		}
		if (this.usesPortalSpatial) {
			this._portalText.setText(this._text || this._placeholderText)
			this._portalText.toggleClass(usingPlaceholder, 'placeholder')
		}
		if (this.usesImmersive) {
			this._immersiveText.setText(this._text || this._placeholderText)
			this._immersiveText.toggleClass(usingPlaceholder, 'placeholder')
		}
		if (this.usesFlat) this.flatDOM.value = this._text
		if (this.usesPortalOverlay) this.portalDOM.value = this._text
		if (this.dataObject && this.options.dataField && this.dataObject.get(this.options.dataField) !== this._text) {
			this.dataObject.set(this.options.dataField, this._text)
		}
		this.trigger(TextInputComponent.TextChangeEvent, this._text)
	}
}
TextInputComponent.TextChangeEvent = 'text-input-change'
TextInputComponent.TextSubmitEvent = 'text-input-submit'

export default TextInputComponent
