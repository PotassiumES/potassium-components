import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
SliderComponent gives the user the ability to choose from a range of values.
*/
const SliderComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject = null, options = {}) {
		super(dataObject, options)
		this.addClass('slider-component')

		console.error('Unimplemented')
	}
}

export default SliderComponent
