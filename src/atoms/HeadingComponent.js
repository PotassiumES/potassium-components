import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import TextComponent from 'potassium-components/src/atoms/TextComponent'

/**
HeadingComponent represents a title or heading made up only of text.
*/
const HeadingComponent = class extends TextComponent {
	/**
	@param {DataObject} dataObject
	@param {Object} options see the {@link TextComponent} options
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					flatDOM: dom.h1(),
					portalDOM: dom.h1(),
					textSize: 0.12,
					name: 'HeadingComponent'
				},
				options
			),
			inheritedOptions
		)
		this.addClass('heading-component')
	}
}

export default HeadingComponent
