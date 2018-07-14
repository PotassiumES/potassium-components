import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
FormComponent holds a set of sub-Components related to filling out information in a form.
It also handles marshalling and unmarshalling data for communication with the server.
It also handles input checking and the display of per-field and form-wide error messages. 
*/
const FormComponent = class extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('form-component')
		console.error('Unimplemented')
	}
}

export default FormComponent
