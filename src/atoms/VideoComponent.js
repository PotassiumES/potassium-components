import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import CubeComponent from './CubeComponent.js'

/**
VideoComponent displays a single video.

If you want to display controls, use {@link VideoPlayerComponent}.
*/
const VideoComponent = class extends CubeComponent {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options={}]
	@param {number} [options.height=1] the intial height of the video cube
	*/
	constructor(dataObject = null, options = {}) {
		if(typeof options.material === 'undefined'){
			options.material = VideoComponent.GenerateVideoMaterial()
		}
		super(dataObject, Object.assign({
			height: 1 // meter
		}, options))
		this.addClass('video-component')
		this.setName('VideoComponent')
		this._handleVideoCanPlay = this._handleVideoCanPlay.bind(this)
		this.video.addEventListener('canplay', this._handleVideoCanPlay, false);

		this._height = this.options.height
		this._width = null
		this._depth = null
		this._ratio = null
		this.resize(this.options.height, VideoComponent.RATIO_16x9)
	}

	cleanup(){
		const video = this.video
		video.removeEventListener('canplay', this._handleVideoCanPlay, false);
	}

	get video(){ return this.options.material.map.image }

	_handleVideoCanPlay(ev){
		const videoWidth = this.video.videoWidth
		const videoHeight = this.video.videoHeight
		if(videoWidth <= 0 || videoHeight <= 0){
			console.error('Could not read the video dimensions', ev)
			return
		}
		this.resize(this._height, videoWidth / videoHeight)
	}

	resize(height, ratio){
		this._height = height
		this._width = height * ratio
		this._ratio = ratio
		this._depth = 0.001
		this.setCubeSize(this._width, this._height , this._depth)
	}

	setCubeSize(width, height, depth){
		this.portalCube.scale.set(width, height, depth)
		this.immersiveCube.scale.set(width, height, depth)
	}

	static GenerateVideoMaterial(url=null, mimeType=null){
		const video = el.video(el.source({
			src: url,
			type: mimeType
		}))
		const videoTexture = new THREE.VideoTexture(video)
		videoTexture.minFilter = THREE.NearestFilter
		videoTexture.magFilter = THREE.LinearFilter
		videoTexture.format = THREE.RGBFormat
		return new THREE.MeshLambertMaterial({
			color: 0xAAAAAA,
			map: videoTexture
		})
	}
}

VideoComponent.RATIO_16x9 = 16 / 9
VideoComponent.RATIO_1x1 = 1

export default VideoComponent
