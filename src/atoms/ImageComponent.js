import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import CubeComponent from './CubeComponent.js'

const _textureLoader = new THREE.TextureLoader()

/**
ImageComponent handles the display of a single image.
*/
const ImageComponent = class extends CubeComponent {
	/**
	@param {Object} options see the {@link Component} options
	@param {string} [options.image=null] the URL of an image
	@param {string} [options.imageField=null] the name of the field in dataObject that holds the URL to the image
	*/
	constructor(dataObject = null, options = {}) {
		const needsMaterial = options.usesPortalSpatial !== false || options.usesImmersive !== false
		const mat = needsMaterial ? ImageComponent.GenerateCubeMaterial(options.image) : null
		super(
			dataObject,
			Object.assign(
				{
					image: null,
					imageField: null,
					material: mat
				},
				options
			)
		)
		this.addClass('image-component')
		this.setName('ImageComponent')

		this._updateFromData = this._updateFromData.bind(this)

		this._imageURL = ''

		this._flatImg = el.img().appendTo(this.flatEl)
		this._portalImg = el.img().appendTo(this.portalEl)

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
		this._flatImg.src = this._imageURL
		this._portalImg.src = this._imageURL
		if(this.usesSpatial){
			console.log('need to set the spatial material to a new image')
		}
	}

	_updateFromData() {
		if (!this.dataObject || !this.options.imageField) return
		this.imageURL = this.dataObject.get(this.options.imageField) || ''
	}

	static GenerateCubeMaterial(url){
		const texture = _textureLoader.load(
			url ? url : '/static/potassium-components/images/blank2x2.png'
		)
		return new graph.meshLambertMaterial({
			color: 0xF99,
			map: texture
		})
	}
}

export default ImageComponent
