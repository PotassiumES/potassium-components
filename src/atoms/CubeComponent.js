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
			this.options.material = new som.meshStandardMaterial({
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

	setCubeSides(x, y, z) {
		if (this._portalCube) {
			if (x === CubeGeometrySideSize && y === CubeGeometrySideSize && z == CubeGeometrySideSize) {
				if (this._portalCube.geometry !== _sharedGeometry) {
					this._portalCube.geometry.dispose()
					this._portalCube.geometry = _sharedGeometry
					this._portalCube.position.set(CubeGeometrySideSize / 2, CubeGeometrySideSize / -2, CubeGeometrySideSize / 2)
					this._portalCube.styles.setAncestorsLayoutDirty()
					this._portalCube.styles.geometryIsDirty = true
				}
			} else {
				if (this._portalCube.geometryIsDirty !== _sharedGeometry) {
					this._portalCube.geometry.dispose()
				}
				this._portalCube.geometry = new som.boxBufferGeometry(x, y, z)
				this._portalCube.position.set(x / 2, y / -2, z / 2)
				this._portalCube.styles.setAncestorsLayoutDirty()
				this._portalCube.styles.geometryIsDirty = true
			}
		}
		if (this._immersiveCube) {
			if (x === CubeGeometrySideSize && y === CubeGeometrySideSize && z == CubeGeometrySideSize) {
				if (this._immersiveCube.geometry !== _sharedGeometry) {
					this._immersiveCube.geometry.dispose()
					this._immersiveCube.geometry = _sharedGeometry
					this._immersiveCube.position.set(
						CubeGeometrySideSize / 2,
						CubeGeometrySideSize / -2,
						CubeGeometrySideSize / 2
					)
					this._immersiveCube.styles.geometryIsDirty = true
					this._immersiveCube.styles.setAncestorsLayoutDirty()
				}
			} else {
				if (this._immersiveCube.geometry !== _sharedGeometry) {
					this._immersiveCube.geometry.dispose()
				}
				this._immersiveCube.geometry = new som.boxBufferGeometry(x, y, z)
				this._immersiveCube.position.set(x / 2, y / -2, z / 2)
				this._immersiveCube.styles.setAncestorsLayoutDirty()
				this._immersiveCube.styles.geometryIsDirty = true
			}
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
		this.options.material = mat
	}
}

// All CubeComponents share a BoxBufferGeometry and are scaled using KSS
const _sharedGeometry = new som.boxBufferGeometry(CubeGeometrySideSize, CubeGeometrySideSize, CubeGeometrySideSize)

export { CubeComponent, CubeGeometrySideSize }

export default CubeComponent
