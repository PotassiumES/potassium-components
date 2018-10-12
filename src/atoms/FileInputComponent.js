import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
FileInputComponent gives the user the ability to choose a local file.
*/
const FileInputComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('file-input-component')
		console.error('Unimplemented')
	}
}

export default FileInputComponent
