import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
VideoComponent displays a single video.

If you want to display controls, use {@link VideoPlayerComponent}.
*/
const VideoComponent = class extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.addClass('video-component')

		console.error('Unimplemented')
	}
}

export default VideoComponent
