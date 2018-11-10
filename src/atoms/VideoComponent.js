import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import CubeComponent from './CubeComponent.js'

/**
VideoComponent displays a single video.

If you want to display controls, use {@link VideoPlayerComponent}.
*/
const VideoComponent = class extends CubeComponent {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options={}]
	@param {number} [options.height=1] the initial height of the video cube
	@param {string} [options.preview=a_default_preview_image] the URL to a still image to show until the user plays the video
	@param {string} [options.video=null] - the URL to a video
	@param {string} [options.mimeType=null] - the mimeType for the video

	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					height: 1, // meter
					preview: '/static/potassium-components/images/video-component-preview.png',
					video: null,
					mimeType: null
				},
				options
			),
			inheritedOptions
		)
		this.addClass('video-component')
		this.setName('VideoComponent')
		this._handleVideoCanPlay = this._handleVideoCanPlay.bind(this)

		this._videoRequested = false // False until the video is asked to load or play
		this._source = null
		this._video = null

		this._height = this.options.height
		this._width = null
		this._depth = null
		this._ratio = null
		this.resize(this.options.height, VideoComponent.RATIO_16x9)

		this._flatPreview = dom.img({ src: this.options.preview }).appendTo(this.flatDOM).addClass('preview-image')
		this._portalPreview = dom.img({ src: this.options.preview }).appendTo(this.portalDOM).addClass('preview-image')
	}

	cleanup() {
		if(this._video) this._video.removeEventListener('canplay', this._handleVideoCanPlay, false)
	}

	get source(){
		return this._source
	}

	get video() {
		return this._video
	}

	get paused(){
		if(this._videoRequested === false) return true
		return this._video.paused
	}

	get currentTime(){
		if(this._videoRequested === false) return 0
		return this._video.currentTime
	}

	set currentTime(val){
		if(this._videoRequested === false) return
		this._video.currentTime = val
	}

	get duration(){
		if(this._videoRequested === false) return 0
		return this._video.duration
	}

	play(){
		if(this._videoRequested === false) this.loadVideo()
		// We share the video among flat and portal mode, so do the switcheroo
		switch (this.currentDisplayMode){
			case 'flat':
				if(this._video.parentNode !== this.flatDOM){
					this.flatDOM.appendChild(this._video)
				}
				break
			case 'portal':
				if(this._video.parentNode !== this.portalDOM){
					this.portalDOM.appendChild(this._video)
				}
				break
			case 'immersive':
				// NOP
				break
			default:
				console.error('unknown display mode', this.currentDisplayMode)
				return
		}
		this._video.play()
	}

	pause(){
		if(this._videoRequested === false) this.loadVideo()
		this._video.pause()
	}

	toggle(){
		if(this._videoRequested === false) this.loadVideo()
		if(this.paused){
			this.play()
		} else {
			this.pause()
		}
	}

	loadVideo(){
		if(this._videoRequested) return false
		this._videoRequested = true

		this.flatDOM.removeChild(this._flatPreview)
		this.portalDOM.removeChild(this._portalPreview)

		this._source = dom.source({
			src: this.options.video,
			type: this.options.mimeType
		})

		this._video = dom.video(this._source)

		this._video.crossOrigin = 'anonymous'
		this._video.addEventListener('canplay', this._handleVideoCanPlay, false)
		this._video.load()

		if(this.usesSOM){
			this.material = this.generateVideoMaterial()
		}

		this.trigger(VideoComponent.VIDEO_INITIALIZED, this)
		return true
	}

	/**
	@param {string} url - the relative or full URL to the video
	@param {string} mimeType - a mime type like 'video/mp4'
	*/
	setSourceAttributes(url, mimeType) {
		this.options.video = url
		this.options.mimeType = mimeType
		if(this._videoRequested) {
			// the video elements are already created so reset video
			this._source.setAttribute('src', url)
			this._source.setAttribute('type', mimeType)
			this._video.load()
		}
	}

	_handleVideoCanPlay(ev) {
		const videoWidth = ev.target.videoWidth
		const videoHeight = ev.target.videoHeight
		if (videoWidth <= 0 || videoHeight <= 0) {
			console.error('Could not read the video dimensions', ev)
			return
		}
		this.resize(this._height, videoWidth / videoHeight)
	}

	resize(height, ratio) {
		this._height = height
		this._width = height * ratio
		this._ratio = ratio
		this._depth = 0.001
		this.setCubeSize(this._width, this._height, this._depth)
	}

	setCubeSize(width, height, depth) {
		if (this.portalCube) {
			this.portalCube.scale.set(width, height, depth)
			this.portalCube.position.set(width / 2, height / -2, 0)
		}
		if (this.immersiveCube){
			this.immersiveCube.scale.set(width, height, depth)
			this.immersiveCube.position.set(width / 2, height / -2, 0)
		}
	}

	generateVideoMaterial() {
		const videoTexture = new THREE.VideoTexture(this._video)
		videoTexture.minFilter = THREE.NearestFilter
		videoTexture.magFilter = THREE.LinearFilter
		videoTexture.format = THREE.RGBFormat
		return new THREE.MeshLambertMaterial({
			color: 0xFFFFFF,
			map: videoTexture
		})
	}
}

VideoComponent.VIDEO_INITIALIZED = 'video-component-initialized'

VideoComponent.RATIO_16x9 = 16 / 9
VideoComponent.RATIO_1x1 = 1

export default VideoComponent
