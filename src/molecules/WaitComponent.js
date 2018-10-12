import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
WaitComponent shows a spinner, to ensure the user that a process is happening.
*/
const WaitComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('wait-component')

		console.error('Unimplemented')
	}
}

export default WaitComponent
