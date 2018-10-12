import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'
import Component from 'potassium-es/src/Component'

import LabelComponent from 'potassium-components/src/atoms/LabelComponent'

/**
ToolTipComponent shows a Component next to another Component
*/
const ToolTipComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} options
	@param {Component} options.component
	*/
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('tool-tip-component')

		this._closeComponent = new LabelComponent(null, { text: 'X' }).appendTo(this)
		this._closeComponent.addClass('close-component')
		this._closeComponent.addListener((eventName, action, active, options) => {
			if(action === '/action/activate' && active){
				this.hide()
			}
		}, Component.ActionEvent)

		this.options.component.appendTo(this)
	}

	show(target=null){
		super.show()
		if(target === null) return
		this.flatEl.style.position = 'relative'
		this.flatEl.style.left = 0
		this.flatEl.style.top = 0
		const targetPosition = target.flatEl.documentPosition()
		const position = this.flatEl.documentPosition()
		this.flatEl.style.left = targetPosition[0] - position[0]
		this.flatEl.style.top = targetPosition[1] - position[1]
	}
}

export default ToolTipComponent
