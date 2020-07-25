import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import * as paths from 'potassium-es/src/Paths.js'

import CubeComponent from './CubeComponent.js'

/**
VideoComponent displays a single video.

If you want to display controls, use {@link VideoPlayerComponent}.
*/
const VideoComponent = class extends CubeComponent {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options={}]
	@param {string} [options.preview=a_default_preview_image] the URL to a still image to show until the user plays the video
	@param {string} [options.video=null] - the URL to a video
	@param {string} [options.mimeType=null] - the mimeType for the video

	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					preview: paths.Static + '/potassium-components/images/video-component-preview.png',
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

		this._heightScale = 0.01
		this._widthScale = null
		this._depthScale = null
		this._ratio = null
		this.resize(VideoComponent.RATIO_16x9)

		this._flatPreview = dom.img({ src: this.options.preview }).appendTo(this.flatDOM).addClass('preview-image')
		this._portalPreview = dom.img({ src: this.options.preview }).appendTo(this.portalDOM).addClass('preview-image')
	}

	cleanup() {
		if (this._video) this._video.removeEventListener('canplay', this._handleVideoCanPlay, false)
	}

	get source() {
		return this._source
	}

	get video() {
		return this._video
	}

	get paused() {
		if (this._videoRequested === false) return true
		return this._video.paused
	}

	get currentTime() {
		if (this._videoRequested === false) return 0
		return this._video.currentTime
	}

	set currentTime(val) {
		if (this._videoRequested === false) return
		this._video.currentTime = val
	}

	get duration() {
		if (this._videoRequested === false) return 0
		return this._video.duration
	}

	play() {
		if (this._videoRequested === false) this.loadVideo()
		// We share the video among flat and portal mode, so do the switcheroo
		switch (this.currentDisplayMode) {
			case 'flat':
				if (this._video.parentNode !== this.flatDOM) {
					this.flatDOM.appendChild(this._video)
				}
				break
			case 'portal':
				if (this._video.parentNode !== this.portalDOM) {
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

	pause() {
		if (this._videoRequested === false) this.loadVideo()
		this._video.pause()
	}

	toggle() {
		if (this._videoRequested === false) this.loadVideo()
		if (this.paused) {
			this.play()
		} else {
			this.pause()
		}
	}

	loadVideo() {
		if (this._videoRequested) return false
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

		if (this.usesSOM) {
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
		if (this._videoRequested) {
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
		this.resize(videoWidth / videoHeight)
	}

	resize(ratio) {
		this._ratio = ratio
		this._widthScale = this._heightScale * this._ratio
		this._depthScale = 0.00001
		this.setCubeSides(this._widthScale, this._heightScale, this._depthScale)
	}

	generateVideoMaterial() {
		const videoTexture = new som.videoTexture(this._video)
		videoTexture.minFilter = som.NearestFilter
		videoTexture.magFilter = som.LinearFilter
		videoTexture.format = som.RGBFormat
		return new som.meshStandardMaterial({
			color: 0xffffff,
			map: videoTexture
		})
	}
}

VideoComponent.VIDEO_INITIALIZED = 'video-component-initialized'

VideoComponent.RATIO_16x9 = 16 / 9
VideoComponent.RATIO_1x1 = 1

export default VideoComponent
