import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

/**
FileInputComponent gives the user the ability to choose a local file.

@todo implement SOM
*/
const FileInputComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					flatDOM: dom.input({ type: 'file' }),
					portalDOM: dom.input({ type: 'file' })
				},
				options
			),
			inheritedOptions
		)
		this.addClass('file-input-component')
		this.setName('FileInputComponent')
	}
}

export default FileInputComponent
