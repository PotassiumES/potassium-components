import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
HeadingComponent represents a title or heading made up only of text.
*/
const HeadingComponent = class extends Component {
	/**
	options:
		the usual options from Component
		text {string} the initial text shown in the heading 
	@param {DataObject} dataObject
	@param {Object} options
	*/
	constructor(dataObject=null, options={}){
		super(dataObject, Object.assign({
			flatEl: el.h1(),
			portalEl: el.h1()
		}, options))
		this.addClass('heading-component')
		this._text = ''

		this._portalText = graph.text(this._text)
		this.portalGraph.add(this._portalText)

		this._immersiveText = graph.text(this._text)
		this.immersiveGraph.add(this._immersiveText)

		if(typeof this.options.text === 'string'){
			this.text = this.options.text
		}
	}
	get text(){ return this._text }
	set text(value){
		if(this._text === value) return
		this._text = value || ''
		this._updateFromText()
	}

	_updateFromText(){
		this.flatEl.innerText = this._text
		this.portalEl.innerText = this._text
		this._portalText.text = this._text
		this._immersiveText.text = this._text
	}
}

export default HeadingComponent
