import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

/**
ButtonGroupComponent gathers together {@link ButtonComponent}s.
*/
const ButtonGroupComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(dataObject, options, inheritedOptions)
		this.addClass('button-group-component')
		this.setName('ButtonGroupComponent')
	}
}

export default ButtonGroupComponent
