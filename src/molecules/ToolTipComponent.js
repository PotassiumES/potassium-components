import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
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
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(dataObject, options, inheritedOptions)
		this.addClass('tool-tip-component')
		this.setName('ToolTipComponent')

		this._closeComponent = new LabelComponent(null, { text: 'X' }, this.inheritedOptions).appendTo(this)
		this._closeComponent.addClass('close-component')
		this._closeComponent.addListener((eventName, action, active, options) => {
			if (action === '/action/activate' && active) {
				this.hide()
			}
		}, Component.ActionEvent)

		this.appendComponent(options.component)
	}

	show(target = null) {
		super.show()
		if (target === null) return
		this.flatDOM.style.position = 'relative'
		this.flatDOM.style.left = 0
		this.flatDOM.style.top = 0
		const targetPosition = target.flatDOM.documentPosition()
		const position = this.flatDOM.documentPosition()
		this.flatDOM.style.left = targetPosition[0] - position[0]
		this.flatDOM.style.top = targetPosition[1] - position[1]
	}
}

export default ToolTipComponent
