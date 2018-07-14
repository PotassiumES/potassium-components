import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

const AudioComponent = class extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, Object.assign({
			flatEl: el.audio(),
			portalEl: el.audio()
		}, options))
		this.addClass('audio-component')
		console.error('Unimplemented')
	}
}

export default AudioComponent
