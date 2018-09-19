import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
CheckboxComponent provides a UI for toggling a value on and off using activation
*/
const CheckboxComponent = class extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, Object.assign({
			flatEl: el.input({ type: 'checkbox' }),
			portalEl: el.input({ type: 'checkbox' })
		}, options))
		this.addClass('checkbox-component')
		this._checked = options.checked === true
		this._portalCheckGraph = null
		this._immersiveCheckGraph = null

		this._portalObj = graph.obj('/static/potassium-components/models/Checkbox.obj', (group, obj) => {
			this._portalCheckGraph = obj.children[0]
			this._updateCheckedDisplay(this._checked)
		})
		this.portalGraph.add(this._portalObj)
		this.portalGraph.name = 'checkbox'

		this._immersiveObj = graph.obj('/static/potassium-components/models/Checkbox.obj', (group, obj) => {
			this._immersiveCheckGraph = obj.children[0]
			this._updateCheckedDisplay(this._checked)
		})
		this.immersiveGraph.add(this._immersiveObj)
		this.immersiveGraph.name = 'checkbox'

		// We handle the clicks through Action-input, so turn off the default browser action
		this.flatEl.addEventListener('click', ev => {
			ev.preventDefault()
		})
		this.portalEl.addEventListener('click', ev => {
			ev.preventDefault()
		})

		// Toggle on activate events from Action-input
		this.addListener((eventName, actionName, value, actionParameters) => {
			switch(actionName){
				case '/action/activate':
					if(value){
						this.checked = !this.checked
					}
					break
			}
		}, Component.ActionEvent)

		this._updateCheckedDisplay(this._checked)
	}

	set checked(value){
		if(value === this._checked) return
		this._checked = value
		this._updateCheckedDisplay(value)
		this.trigger(CheckboxComponent.CheckChangedEvent, this._checked)
	}
	get checked() { return this._checked }

	_updateCheckedDisplay(checked){
		this.flatEl.checked = checked
		this.portalEl.checked = checked
		if(this._portalCheckGraph){
			this._portalCheckGraph.visible = checked
		}
		if(this._immersiveCheckGraph){
			this._immersiveCheckGraph.visible = checked
		}
	}
}
CheckboxComponent.CheckChangedEvent = 'checkbox-check-changed'

export default CheckboxComponent