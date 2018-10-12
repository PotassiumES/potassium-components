import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
SwitchComponent gives the user the ability to flip a switch.
The switch may be on/off or momentary with push-to-break or push-to-make options.
*/
const SwitchComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('switch-component')
		console.error('Unimplemented')
	}
}

export default SwitchComponent
