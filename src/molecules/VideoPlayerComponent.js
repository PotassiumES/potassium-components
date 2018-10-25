import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

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
	@param {string} [options.url=''] - a URL to a video
	@param {string} [options.mimeType=''] - the MIME type for the video, like 'video/mp4'
	*/
	constructor(dataObject = null, options = {}) {
		super(
			dataObject,
			Object.assign(
				{
					url: '',
					mimeType: ''
				},
				options
			)
		)
		this.addClass('video-player-component')
		this.setName('VideoPlayerComponent')
		this._handleVideoLoadStart = this._handleVideoLoadStart.bind(this)
		this._handleVideoAbort = this._handleVideoAbort.bind(this)
		this._handleVideoError = this._handleVideoError.bind(this)
		this._handleVideoStalled = this._handleVideoStalled.bind(this)
		this._handleVideoLoadedMetadata = this._handleVideoLoadedMetadata.bind(this)
		this._handleVideoLoadedData = this._handleVideoLoadedData.bind(this)
		this._handleVideoCanPlay = this._handleVideoCanPlay.bind(this)
		this._handleVideoCanPlayThrough = this._handleVideoCanPlayThrough.bind(this)
		this._handleVideoPlaying = this._handleVideoPlaying.bind(this)
		this._handleVideoWaiting = this._handleVideoWaiting.bind(this)
		this._handleVideoPlay = this._handleVideoPlay.bind(this)
		this._handleVideoTimeUpdate = this._handleVideoTimeUpdate.bind(this)
		this._handleVideoPause = this._handleVideoPause.bind(this)
		this._handleVideoEnded = this._handleVideoEnded.bind(this)

		this._backdropComponent = new Component().appendTo(this)
		this._backdropComponent.addClass('backdrop-component')
		this._backdropComponent.setName('BackdropComponent')

		this._sourceDOM = dom.source({
			src: this.options.url,
			type: this.options.mimeType
		})
		this._videoDOM = dom.video(this._sourceDOM)

		this._videoComponent = new VideoComponent(null, {
			videoDOM: this._videoDOM
		}).appendTo(this._backdropComponent)

		this._controlsComponent = new Component().appendTo(this)
		this._controlsComponent.addClass('video-player-controls')
		this._controlsComponent.setName('VideoPlayerControls')

		this._startCube = new CubeComponent().appendTo(this._controlsComponent)
		this._startCube.addClass('video-start')
		this._startCube.setName('VideoStart')
		this._startCube.addListener((eventName, actionName, value, actionParameters) => {
			if (actionName === '/action/activate') {
				this.video.play()
			}
		}, Component.ActionEvent)

		this._stopCube = new CubeComponent().appendTo(this._controlsComponent)
		this._stopCube.addClass('video-stop')
		this._stopCube.setName('VideoStop')
		this._stopCube.addListener((eventName, actionName, value, actionParameters) => {
			if (actionName === '/action/activate') {
				this.video.pause()
			}
		}, Component.ActionEvent)

		this._sliderComponent = new SliderComponent().appendTo(this._controlsComponent)

		this._pauseCube = new CubeComponent().appendTo(this._controlsComponent)
		this._pauseCube.addClass('video-pause')
		this._pauseCube.setName('VideoPause')
		this._addEventListeners()
		this._updateSlider()
	}

	get video() {
		return this._videoDOM
	}

	/**
	@param {string} url - the relative or full URL to the video
	@param {string} mimeType - a mime type like 'video/mp4'
	*/
	setVideoSource(url, mimeType) {
		this._videoComponent.setSourceAttributes(url, mimeType)
	}

	_updateSlider() {
		if (this.video.currentTime === 0) {
			this._sliderComponent.valueFraction = 0
			return
		}
		this._sliderComponent.valueFraction =
			Math.max(0, this.video.currentTime) / Math.max(1, this.video.duration, this.video.currentTime)
	}

	_addEventListeners() {
		const video = this.video
		video.crossOrigin = 'anonymous'
		video.addEventListener('loadstart', this._handleVideoLoadStart, false)
		video.addEventListener('abort', this._handleVideoAbort, false)
		video.addEventListener('error', this._handleVideoError, false)
		video.addEventListener('stalled', this._handleVideoStalled, false)
		video.addEventListener('loadedmetadata', this._handleVideoLoadedMetadata, false)
		video.addEventListener('loadeddata', this._handleVideoLoadedData, false)
		video.addEventListener('canplay', this._handleVideoCanPlay, false)
		video.addEventListener('canplaythrough', this._handleVideoCanPlayThrough, false)
		video.addEventListener('playing', this._handleVideoPlaying, false)
		video.addEventListener('waiting', this._handleVideoWaiting, false)
		video.addEventListener('play', this._handleVideoPlay, false)
		video.addEventListener('timeupdate', this._handleVideoTimeUpdate, false)
		video.addEventListener('pause', this._handleVideoPause, false)
		video.addEventListener('ended', this._handleVideoEnded, false)
	}

	cleanup() {
		const video = this.video
		video.removeEventListener('loadstart', this._handleVideoLoadStart, false)
		video.removeEventListener('abort', this._handleVideoAbort, false)
		video.removeEventListener('error', this._handleVideoError, false)
		video.removeEventListener('stalled', this._handleVideoStalled, false)
		video.removeEventListener('loadedmetadata', this._handleVideoLoadedMetadata, false)
		video.removeEventListener('loadeddata', this._handleVideoLoadedData, false)
		video.removeEventListener('canplay', this._handleVideoCanPlay, false)
		video.removeEventListener('canplaythrough', this._handleVideoCanPlayThrough, false)
		video.removeEventListener('playing', this._handleVideoPlaying, false)
		video.removeEventListener('waiting', this._handleVideoWaiting, false)
		video.removeEventListener('play', this._handleVideoPlay, false)
		video.removeEventListener('timeupdate', this._handleVideoTimeUpdate, false)
		video.removeEventListener('pause', this._handleVideoPause, false)
		video.removeEventListener('ended', this._handleVideoEnded, false)
	}

	_handleVideoLoadStart(ev) {}

	_handleVideoAbort(ev) {}

	_handleVideoError(ev) {}

	_handleVideoStalled(ev) {}

	_handleVideoLoadedMetadata(ev) {}

	_handleVideoLoadedData(ev) {}

	_handleVideoCanPlay(ev) {}

	_handleVideoCanPlayThrough(ev) {}

	_handleVideoPlaying(ev) {}

	_handleVideoWaiting(ev) {}

	_handleVideoPlay(ev) {}

	_handleVideoTimeUpdate(ev) {
		this._updateSlider()
	}

	_handleVideoPause(ev) {}

	_handleVideoEnded(ev) {}
}

export default VideoPlayerComponent
