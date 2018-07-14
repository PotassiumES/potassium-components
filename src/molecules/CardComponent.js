import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
CardComponent contains a list of Audio-, Video-, or Image- Components and a caption LabelComponent
*/
const CardComponent = class extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('card-component')

		console.error('Unimplemented')
	}
}

export default CardComponent
