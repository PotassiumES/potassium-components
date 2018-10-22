import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import TextComponent from 'potassium-components/src/atoms/TextComponent'

/**
LabelComponent displays a single line of text
*/
const LabelComponent = class extends TextComponent {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject = null, options = {}) {
		super(
			dataObject,
			Object.assign(
				{
					flatEl: el.label(),
					portalEl: el.label()
				},
				options
			)
		)
		this.addClass('label-component')
		this.setName('LabelComponent')
	}
}

export default LabelComponent
