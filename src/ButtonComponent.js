import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

const ButtonComponent = class extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, Object.assign({
			flatEl: el.button({ class: 'button' }),
			portalEl: el.button({ class: 'button' })
		}, options))
		this._text = ''

		let textMaterial = graph.meshLambertMaterial({ color: 0x999999 })

		this._portalText = graph.text('', textMaterial, null, {
			size: 0.12,
			height: 0.01
		})
		this._portalText.position.set(0.04, -0.06, 0)
		this.portalGraph.name = 'Button'

		this._immersiveText = graph.text('', textMaterial, null, {
			size: 0.12,
			height: 0.01
		})
		this._immersiveText.position.set(0.04, -0.06, 0)
		this.immersiveGraph.name = 'Button'

		if(!options.portalGraph){
			this._portalButtonObj = graph.obj('./js/components/models/Button.obj')
			this.portalGraph.add(this._portalButtonObj)
			this.portalGraph.add(this._portalText)
		}

		if(!options.immersiveGraph){
			this._immersiveButtonObj = graph.obj('./js/components/models/Button.obj')
			this.immersiveGraph.add(this._immersiveButtonObj)
			this.immersiveGraph.add(this._immersiveText)
		}

		this.addListener((eventName, actionName, value, actionParameters) => {
			switch(actionName){
				case '/action/activate':
					this.trigger(ButtonComponent.ChangedEvent, value)
					break
			}
		}, Component.ActionEvent)

		this.text = this.options.text || ''
	}

	get text(){ return this._text }

	set text(value){
		this._text = value
		this.flatEl.innerHTML = this._text
		this.portalEl.innerHTML = this._text
		this._portalText.setText(this._text)
		this._immersiveText.setText(this._text)
	}
}
ButtonComponent.ChangedEvent = 'button-changed'

export default ButtonComponent
