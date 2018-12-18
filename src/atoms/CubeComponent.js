import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

const CubeGeometrySideSize = 0.01 // 1cm

/**
CubeComponent is mostly used as a base class for Components that are some sort of cube.

For example, the VideoComponent is a cube that shows a video so it extends CubeComponent and adds its own methods for controlling the video.

The flat and portal display of this is just an unstyled div, so extending classes will need to style and populate those DOM elements.
*/
const CubeComponent = class extends Component {
	/**
	@param {DataObject} [dataObject]
	@param {Object} [options]
	@param {THREE.Material} [options.material]
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					material: null
				},
				options
			),
			inheritedOptions
		)
		this.addClass('cube-component')
		this.setName('CubeComponent')
		if (this.usesSOM && this.options.material === null) {
			this.options.material = new THREE.MeshStandardMaterial({
				transparent: true
			})
		}

		if (this.options.usesPortalSpatial) {
			this._portalCube = som.mesh([_sharedGeometry, this.options.material])
			this._portalCube.addClass('cube')
			this._portalCube.name = 'Cube'
			this._portalCube.position.set(CubeGeometrySideSize / 2, CubeGeometrySideSize / -2, CubeGeometrySideSize / 2)
			this._portalCube.appendTo(this.portalSOM)
		} else {
			this._portalCube = null
		}

		if (this.options.usesImmersive) {
			this._immersiveCube = som.mesh([_sharedGeometry, this.options.material])
			this._immersiveCube.addClass('cube')
			this._immersiveCube.name = 'Cube'
			this._immersiveCube.position.set(CubeGeometrySideSize / 2, CubeGeometrySideSize / -2, CubeGeometrySideSize / 2)
			this._immersiveCube.appendTo(this.immersiveSOM)
		} else {
			this._immersiveCube = null
		}
	}

	/** @type {THREE.BoxBufferedGeometry?} */
	get portalCube() {
		return this._portalCube
	}

	/** @type {THREE.BoxBufferedGeometry?} */
	get immersiveCube() {
		return this._immersiveCube
	}

	/** @type {THREE.Material?} */
	get material() {
		return this.options.material
	}

	/** @param {THREE.Material} mat */
	set material(mat) {
		if (this._portalCube) this._portalCube.material = mat
		if (this._immersiveCube) this._immersiveCube.material = mat
	}
}

// All CubeComponents share a BoxBufferGeometry and are scaled using KSS
const _sharedGeometry = new THREE.BoxBufferGeometry(CubeGeometrySideSize, CubeGeometrySideSize, CubeGeometrySideSize)

export default CubeComponent
