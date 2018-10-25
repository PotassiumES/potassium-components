import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

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
					flatDOM: dom.label(),
					portalDOM: dom.label()
				},
				options
			)
		)
		this.addClass('label-component')
		this.setName('LabelComponent')
	}
}

export default LabelComponent
