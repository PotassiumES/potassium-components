import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
VideoPlayerComponent shows a {@link VideoComponent} as well as play/pause and shuttle controls.
*/
const VideoPlayerComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject = null, options = {}) {
		super(dataObject, options)
		this.addClass('video-player-component')

		console.error('Unimplemented')
	}
}

export default VideoPlayerComponent
