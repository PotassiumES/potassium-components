import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

const ToggleComponent = class extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, Object.assign({
			flatEl: el.input({ type: 'checkbox' }),
			portalEl: el.input({ type: 'checkbox' })
		}, options))
		this.addClass('toggle-component')

		this._checked = false

		this._portalObj = graph.obj('/static/potassium-components/models/Chevron.obj')
		this.portalGraph.add(this._portalObj)
		this.portalGraph.name = 'chevron'

		this._immersiveObj = graph.obj('/static/potassium-components/models/Chevron.obj')
		this.immersiveGraph.add(this._immersiveObj)
		this.immersiveGraph.name = 'chevron'

		// Listen for action-input updates
		this.addListener((eventName, actionName, value, actionParameters) => {
			switch(actionName){
				case '/action/activate':
					if(!value) return
					this.checked = !this.checked
					this.trigger(ToggleComponent.ChangedEvent, this.checked)
					break
			}
		}, Component.ActionEvent)

		this._updateDisplay()
	}

	get checked(){ return this._checked}
	set checked(value){
		if(value === this._checked) return
		this._checked = value
		this._updateDisplay()
	}

	_updateDisplay(){
		this._flatEl.checked = this._checked
		this._portalEl.checked = this._checked
	}
}
ToggleComponent.ChangedEvent = 'toggle-changed'

export default ToggleComponent