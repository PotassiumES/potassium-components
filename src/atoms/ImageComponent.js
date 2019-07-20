import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import * as paths from 'potassium-es/src/Paths.js'

import { CubeComponent, CubeGeometrySideSize } from './CubeComponent.js'

// Lazily loaded in ImageComponent.constructor
let _blankTexture = null

/**
ImageComponent handles the display of a single image.
*/
const ImageComponent = class extends CubeComponent {
	/**
	@param {Object} options see the {@link Component} options
	@param {string} [options.image=null] the URL of an image
	@param {string} [options.imageField=null] the name of the field in dataObject that holds the URL to the image
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		if (_blankTexture === null) {
			_blankTexture = som.textureLoader().load(paths.Static + '/potassium-components/images/blank2x2.png')
		}
		const needsMaterial = !options.material && (options.usesPortalSpatial !== false || options.usesImmersive !== false)
		const mat = needsMaterial ? ImageComponent.GenerateCubeMaterial(options.image) : null
		super(
			dataObject,
			Object.assign(
				{
					image: null,
					material: mat,
					imageField: null,
					flatDOM: dom.img(),
					portalDOM: dom.img()
				},
				options
			),
			inheritedOptions
		)
		this.addClass('image-component')
		this.setName('ImageComponent')
		this._updateFromData = this._updateFromData.bind(this)
		this._handleTextureLoaded = this._handleTextureLoaded.bind(this)
		this._handleTextureError = this._handleTextureError.bind(this)

		this._imageURL = ''

		if (this.options.image) {
			this.imageURL = this.options.image
		}
		if (this.dataObject && this.options.imageField) {
			this.dataObject.addListener(this._updateFromData, `changed:${this.options.imageField}`)
			this._updateFromData()
		}
	}

	cleanup() {
		super.cleanup()
		if (this.dataObject && this.options.imageField) {
			this.dataObject.removeListener(this._updateFromData)
		}
	}

	/** @type {string} */
	get imageURL() {
		return this._imageURL
	}

	/** @param {string} value */
	set imageURL(value) {
		if (value === this._imageURL) return
		this._imageURL = value
		this.flatDOM.src = this._imageURL
		this.portalDOM.src = this._imageURL
		if (this.usesSOM) {
			this.material.map = som.textureLoader().load(this._imageURL, this._handleTextureLoaded, this._handleTextureError)
			this.material.needsUpdate = true
		}
	}

	_handleTextureLoaded(info) {
		if (!info.image || !info.image.width || !info.image.height) {
			console.error('Loaded image but has no width and height', info)
			return
		}
		const ratio = info.image.width / info.image.height
		this.setCubeSides(CubeGeometrySideSize * ratio, CubeGeometrySideSize, CubeGeometrySideSize)
	}

	_handleTextureError(...params) {
		console.error('Error loading texture', ...params)
	}

	_updateFromData() {
		if (!this.dataObject || !this.options.imageField) return
		this.imageURL = this.dataObject.get(this.options.imageField) || ''
	}

	static GenerateCubeMaterial(url) {
		return new som.meshStandardMaterial({
			map: url ? som.textureLoader().load(url) : _blankTexture,
			transparent: true
		})
	}
}

export default ImageComponent
