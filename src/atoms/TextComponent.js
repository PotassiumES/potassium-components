import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
TextComponent holds a block of text which may include paragraphs but not other media.

@todo Can it be hypertext and embed images and other media?
*/
const TextComponent = class extends Component {
	/**
	options:
		text {string}: the initial text shown in the heading
		textField {string}: a field in the dataObject to bind to as the text
	*/
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('text-component')
		this._updateTextFromData = this._updateTextFromData.bind(this)

		this._text = ''

		let textMaterial = graph.meshLambertMaterial({ color: 0x999999 })

		this._portalText = graph.text(this._text, textMaterial, null, {
			size: 0.12,
			height: 0.01
		})
		this.portalGraph.add(this._portalText)

		this._immersiveText = graph.text(this._text, textMaterial, null, {
			size: 0.12,
			height: 0.01
		})
		this.immersiveGraph.add(this._immersiveText)

		if(typeof this.options.text === 'string'){
			this.text = this.options.text
		}
		if(this.dataObject && typeof this.options.textField === 'string'){
			this.dataObject.addListener(this._updateTextFromData, `changed:${this.options.textField}`)
			this._updateTextFromData()
		}
	}

	cleanup(){
		super.cleanup()
		this.dataObject.removeListener(this._updateTextFromData)
	}

	get text(){ return this._text }
	set text(value){
		if(this._text === value) return
		this._text = value || ''
		this._updateDisplayFromText()
	}

	_updateTextFromData(){
		if(!this.dataObject || !this.options.textField) return
		this.text = this.dataObject.get(this.options.textField) || ''
	}

	_updateDisplayFromText(){
		this.flatEl.innerText = this._text
		this.portalEl.innerText = this._text
		this._portalText.setText(this._text)
		this._immersiveText.setText(this._text)
	}}

export default TextComponent
