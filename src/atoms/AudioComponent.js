import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import * as paths from 'potassium-es/src/Paths.js'

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
			this._audioDOM = dom.audio(
				dom.source({
					src: this.options.audio || ''
				})
			)
		}

		if (this.usesDOM) {
			this._domImage = new ImageComponent(
				undefined,
				{
					image: paths.Static + '/potassium-components/images/audio.png',
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
			this._portalObj = som
				.obj(paths.Static + '/potassium-components/models/audio-component.obj', () => {
					this.portalSOM.styles.geometryIsDirty = true
				})
				.appendTo(this.portalSOM)
			this._portalObj.addClass('icon')
			this._portalObj.name = 'Icon'
		} else {
			this._portalObj = null
		}

		if (this.usesImmersive) {
			this._immersiveObj = som
				.obj(paths.Static + '/potassium-components/models/audio-component.obj', () => {
					this.immersiveSOM.styles.geometryIsDirty = true
				})
				.appendTo(this.immersiveSOM)
			this._immersiveObj.addClass('icon')
			this._immersiveObj.name = 'Icon'
		} else {
			this._immersiveObj = null
		}
	}

	get audio() {
		return this._audioDOM
	}
}

export default AudioComponent
