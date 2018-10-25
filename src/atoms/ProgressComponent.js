import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

/**
ProgressComponent tracks change of a process.

@todo make it watch a field on the dataObject with a filter function that maps to 'starting'|'complete'|'failed'|[0,1]
*/
const ProgressComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject = null, options = {}) {
		super(dataObject, options)
		this.addClass('progress-component')

		console.error('Unimplemented')
	}
}

export default ProgressComponent
