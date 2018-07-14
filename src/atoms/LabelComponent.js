import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/*
* LabelComponent displays a single line of text
*/
export default class LabelComponent extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, Object.assign({
			flatEl: el.label(),
			portalEl: el.label()
		}, options))
		this.addClass('label-component')
		this._text = ''

		let textMaterial = graph.meshLambertMaterial({ color: 0x999999 })

		this._portalText = graph.text('', textMaterial, null, {
			size: 0.12,
			height: 0.01
		})
		this.portalGraph.add(this._portalText)
		this.portalGraph.name = 'label'

		this._immersiveText = graph.text('', textMaterial, null, {
			size: 0.12,
			height: 0.01
		})
		this.immersiveGraph.add(this._immersiveText)
		this.immersiveGraph.name = 'label'

		this.text = options.text || ''
	}
	get text(){ return this._text }
	set text(value){
		if(this._text === value) return
		this._text = value
		this.flatEl.innerText = value
		this.portalEl.innerText = value
		this._portalText.setText(value)
		this._immersiveText.setText(value)
	}
}
