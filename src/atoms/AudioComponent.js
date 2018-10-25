import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

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
					flatDOM: dom.audio(),
					portalDOM: dom.audio()
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
