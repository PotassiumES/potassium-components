import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

/**
PaginationComponent shows controls for moving forward and back in a {@link ListComponent} or a {@link CollectionComponent}
*/
const PaginationComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(dataObject, options, inheritedOptions)
		this.addClass('pagination-component')
		this.setName('PaginationComponent')
	}
}

export default PaginationComponent
