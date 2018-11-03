import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import CubeComponent from './CubeComponent.js'

const _textureLoader = new THREE.TextureLoader()

const _blankTexture = _textureLoader.load('/static/potassium-components/images/blank2x2.png')

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
		const needsMaterial = options.usesPortalSpatial !== false || options.usesImmersive !== false
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
			this.material.map = _textureLoader.load(this._imageURL)
			this.material.needsUpdate = true
		}
	}

	_updateFromData() {
		if (!this.dataObject || !this.options.imageField) return
		this.imageURL = this.dataObject.get(this.options.imageField) || ''
	}

	static GenerateCubeMaterial(url) {
		return new som.meshLambertMaterial({
			map: url ? _textureLoader.load(url) : _blankTexture
		})
	}
}

export default ImageComponent
