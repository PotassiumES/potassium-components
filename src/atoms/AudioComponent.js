import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

import ImageComponent from 'potassium-components/src/atoms/ImageComponent'

/**
AudioComponent contains a sound source

If you want to display controls, use {AudioPlayerComponent}.
*/
const AudioComponent = class extends Component {
	/**
	@param {DataObject} [dataObject]
	@param {Object} [options]
	@param {string} [options.audio=null] - a URL to an audio file
	@param {HTMLElement} [options.audioDOM=null] - an HTML `audio` element to use as a source
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					audio: null,
					audioDOM: null
				},
				options
			),
			inheritedOptions
		)
		this.addClass('audio-component')
		this.setName('AudioComponent')

		if (this.options.audioDOM) {
			this._audioDOM = this.options.audioDOM
		} else {
			this._audioDOM = dom.audio(dom.source({
				src: this.options.audio || '/static/potassium-components/audio/primary-alert.m4a'
			}))
		}

		if (this.usesDOM) {
			this._domImage = new ImageComponent(
				null,
				{
					image: '/static/potassium-components/images/audio.png',
					usesPortalSpatial: false,
					usesImmersive: false
				},
				this.inheritedOptions
			).appendTo(this)
			this._domImage.addClass('audio-image')
			this._domImage.setName('AudioImage')
		} else {
			this._domImage = null
		}

		if (this.usesPortalSpatial) {
			this._portalObj = som.obj('/static/potassium-components/models/Audio.obj').appendTo(this.portalSOM)
			this._portalObj.addClass('icon')
			this._portalObj.name = 'icon'
		} else {
			this._portalObj = null
		}

		if (this.usesImmersive) {
			this._immersiveObj = som.obj('/static/potassium-components/models/Audio.obj').appendTo(this.immersiveSOM)
			this._immersiveObj.addClass('icon')
			this._immersiveObj.name = 'icon'
		} else {
			this._immersiveObj = null
		}
	}

	get audio() {
		return this._audioDOM
	}
}

export default AudioComponent
