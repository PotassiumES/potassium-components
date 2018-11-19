import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

/**
ModalComponent shows another Component in front of other content.
*/
const ModalComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options={}]
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					columns: ['key', 'value'],
					classes: 'modal-component',
					name: 'ModalComponent'
				},
				options
			),
			inheritedOptions
		)
	}
}

export default ModalComponent
