import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

/**
AudioPlayerComponent shows an {@link AudioComponent} along with play/pause and shuttle controls.
*/
const AudioPlayerComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject = null, options = {}) {
		super(dataObject, options)
		this.addClass('audio-player-component')

		console.error('Unimplemented')
	}
}

export default AudioPlayerComponent
