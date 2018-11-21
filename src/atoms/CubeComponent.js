import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

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
					size: [1, 1, 1], // in meters
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
			this._portalCube = new THREE.Mesh(_sharedGeometry, this.options.material)
			this._portalCube.addClass('cube')
			this._portalCube.name = 'Cube'
			// Set the top-left-middle corner of the cube at the origin
			this._portalCube.position.set(this.options.size[0] / 2, this.options.size[1] / -2, 0)
			this._portalCube.appendTo(this.portalSOM)
		} else {
			this._portalCube = null
		}

		if (this.options.usesImmersive) {
			this._immersiveCube = new THREE.Mesh(_sharedGeometry, this.options.material)
			this._immersiveCube.addClass('cube')
			this._immersiveCube.name = 'Cube'
			// Set the top-left-middle of the cube at the origin
			this._immersiveCube.position.set(this.options.size[0] / 2, this.options.size[1] / -2, 0)
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
const _sharedGeometry = new THREE.BoxBufferGeometry(1, 1, 1)

export default CubeComponent
