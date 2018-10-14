import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
AudioComponent contains a sound source

If you want to display controls, use {AudioPlayerComponent}.
*/
const AudioComponent = class extends Component {
	/**
	@param {DataObject} [dataObject]
	@param {Object} [options]
	*/
	constructor(dataObject = null, options = {}) {
		super(
			dataObject,
			Object.assign(
				{
					flatEl: el.audio(),
					portalEl: el.audio()
				},
				options
			)
		)
		this.addClass('audio-component')
		this.setName('AudioComponent')
		console.error('Unimplemented')
	}
}

export default AudioComponent
