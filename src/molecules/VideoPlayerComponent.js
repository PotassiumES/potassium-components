import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

import CubeComponent from 'potassium-components/src/atoms/CubeComponent'
import VideoComponent from 'potassium-components/src/atoms/VideoComponent'
import SliderComponent from 'potassium-components/src/atoms/SliderComponent'

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
		this.setName('VideoPlayerComponent')

		this._videoComponent = new VideoComponent().appendTo(this)

		this._controlsComponent = new Component().appendTo(this)
		this._controlsComponent.addClass('video-player-controls')
		this._controlsComponent.setName('VideoPlayerControls')

		this._startCube = new CubeComponent().appendTo(this._controlsComponent)
		this._startCube.addClass('video-start')
		this._startCube.setName('VideoStart')

		this._stopCube = new CubeComponent().appendTo(this._controlsComponent)
		this._stopCube.addClass('video-stop')
		this._stopCube.setName('VideoStop')

		this._sliderComponent = new SliderComponent().appendTo(this._controlsComponent)

		this._pauseCube = new CubeComponent().appendTo(this._controlsComponent)
		this._pauseCube.addClass('video-pause')
		this._pauseCube.setName('VideoPause')

	}
}

export default VideoPlayerComponent
