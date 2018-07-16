import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import TextComponent from 'potassium-components/src/atoms/TextComponent'

/**
HeadingComponent represents a title or heading made up only of text.
*/
const HeadingComponent = class extends TextComponent {
	/**
	options:
		text {string}: the initial text shown in the heading
		textField {string}: a field in the dataObject to bind to as the text
	@param {DataObject} dataObject
	@param {Object} options
	*/
	constructor(dataObject=null, options={}){
		super(dataObject, Object.assign({
			flatEl: el.h1(),
			portalEl: el.h1()
		}, options))
		this.addClass('heading-component')
	}
}

export default HeadingComponent
