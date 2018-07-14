import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
ProgressComponent tracks change of a process.

@todo make it watch a field on the dataObject with a filter function that maps to 'starting'|'complete'|'failed'|[0,1]
*/
const ProgressComponent = class extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('progress-component')

		console.error('Unimplemented')
	}
}

export default ProgressComponent
