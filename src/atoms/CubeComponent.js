import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

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
	@param {number[]} [options.size=[1, 1, 1]] the initial size in meters of the cube (leave this alone if you are styling it via KSS `scale` declarations)
	*/
	constructor(dataObject = null, options = {}) {
		super(
			dataObject,
			Object.assign({
				size: [1, 1, 1], // in meters
				material: new THREE.MeshLambertMaterial({ color: 0xAAAAAA })
			}, options)
		)
		this.addClass('cube-component')
		this.immersiveGraph.name = this.portalGraph.name = 'CubeComponent'

		this._portalCube = graph.cube(this.options.size, {
			material: this.options.material
		}).appendTo(this.portalGraph)
		this._immersiveCube = graph.cube(this.options.size, {
			material: this.options.material
		}).appendTo(this.immersiveGraph)
	}

	/** @type {} */
	get portalCube(){ return this._portalCube }
	get immersiveCube(){ return this._immersiveCube }
}

export default CubeComponent
