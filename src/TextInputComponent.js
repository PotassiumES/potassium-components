import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

const TextInputComponent = class extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, Object.assign({
			flatEl: el.input({ type: 'text' }),
			portalEl: el.input({ type: 'text' })
		}, options))
		this._handleTextInput = this._handleTextInput.bind(this)
		this.addClass('text-input-component')
		this.acceptsTextInputFocus = true
		this._placeholderText = options.placeholder || ''
		this.flatEl.setAttribute('placeholder', this._placeholderText)
		this.portalEl.setAttribute('placeholder', this._placeholderText)

		this._text = null
		this._shifted = false

		this.flatEl.addEventListener('change', ev => {
			this.text = this.flatEl.value
		})
		this.portalEl.addEventListener('change', ev => {
			this.text = this.portalEl.value
		})

		// Make changes to this.text based on Component.TextInputEvents
		this.addListener(this._handleTextInput, Component.TextInputEvent)

		let placeholderMaterial = graph.meshLambertMaterial({ color: 0xdddddd })
		let textMaterial = graph.meshLambertMaterial({ color: 0x999999 })

		this._portalBracket = graph.obj('/static/potassium-components/models/TextInputBracket.obj')
		this.portalGraph.add(this._portalBracket)
		this._portalCursor = graph.obj('/static/potassium-components/models/TextInputCursor.obj')
		this._portalCursor.position.set(0.04, 0.04, 0)
		this.portalGraph.add(this._portalCursor)
		this._portalText = graph.text(this._text || this._placeholderText, placeholderMaterial, null, {
			size: 0.12,
			height: 0.01
		})
		this._portalText.position.set(0.05, 0.05, 0)
		this.portalGraph.add(this._portalText)
		this.portalGraph.name = 'text-input'

		this._immersiveBracket = graph.obj('/static/potassium-components/models/TextInputBracket.obj')
		this.immersiveGraph.add(this._immersiveBracket)
		this._immersiveCursor = graph.obj('/static/potassium-components/models/TextInputCursor.obj')
		this._immersiveCursor.position.set(0.04, 0.04, 0)
		this.immersiveGraph.add(this._immersiveCursor)
		this._immersiveText = graph.text(this._text || this._placeholderText, placeholderMaterial, null, {
			size: 0.12,
			height: 0.01
		})
		this._immersiveText.position.set(0.05, 0.05, 0)
		this.immersiveGraph.add(this._immersiveText)
		this.immersiveGraph.name = 'text-input'

		this.text = options.text || ''
	}
	_handleTextInput(eventName, actionParameters){
		if(!actionParameters || typeof actionParameters.value === 'undefined') return
		let value = actionParameters.value
		// Handle control input
		switch(value){
			case 'delete':
				if(!this._text || this._text.length == 0) return
				this.text = this._text.substring(0, this._text.length - 1)
				return
			case "shift":
				this._shifted = !this._shifted
				return
			case "space":
				value = ' '
				break
			case "tab":
				value = '\t'
				break
			case 'return':
				this.trigger(TextInputComponent.TextSubmitEvent, this._text)
				this.text = ''
				return
			case 'tray':
			case "left":
			case "up":
			case "right":
			case "down":
			case "control":
			case "alt":
			case "meta":
				return
		}
		// Ok, it's text
		this.text = this._text + (this._shifted ? value.toUpperCase() : value)
		this._shifted = false
	}
	get text(){ return this._text }
	set text(value){
		if(this._text !== value){
			this._portalText.setText(value || this._placeholderText)
			this._immersiveText.setText(value || this._placeholderText)
		}
		this._text = value
		this.flatEl.value = value
		this.portalEl.value = value
		this.trigger(TextInputComponent.TextChangeEvent, this._text)
	}
}
TextInputComponent.TextChangeEvent = 'text-input-change'
TextInputComponent.TextSubmitEvent = 'text-input-submit'

export default TextInputComponent
