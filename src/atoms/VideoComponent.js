import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import CubeComponent from './CubeComponent.js'

/**
VideoComponent displays a single video.

If you want to display controls, use {@link VideoPlayerComponent}.
*/
const VideoComponent = class extends CubeComponent {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options={}]
	@param {number} [options.width=1] the intial width of the video cube
	@param {ratio}
	*/
	constructor(dataObject = null, options = {}) {
		super(dataObject, Object.assign({
			width: 1, // meter
			ratio: VideoComponent.RATIO_16x9
		}, options))
		this.addClass('video-component')
		this.immersiveGraph.name = this.portalGraph.name = 'VideoComponent'

		this._width = null
		this._height = null
		this._depth = null
		this._ratio = null
		this.resize(this.options.width, this.options.ratio)
	}

	resize(width, ratio=VideoComponent.RATIO_16x9){
		switch(ratio){
			case VideoComponent.RATIO_16x9:
				this._height = _16x9Height(width)
				break
			case VideoComponent.RATIO_1x1:
				this._height = width
				break
			default:
				console.error('Unknown ratio', ratio)
				return
		}
		this._ratio = ratio
		this._width = width
		this._depth = 0.001
		this.setCubeSize(this._width, this._height , this._depth)
	}

	setCubeSize(width, height, depth){
		this.portalCube.scale.set(width, height, depth)
		this.immersiveCube.scale.set(width, height, depth)
	}
}

VideoComponent.RATIO_16x9 = Symbol('video-16x9')
VideoComponent.RATIO_1x1 = Symbol('video-1x1')
VideoComponent.RATIOS = [
	VideoComponent.RATIO_16x9,
	VideoComponent.RATIO_1x1
]

/** @return the height that corresponds to a given width at a 16/9 ratio */
const _16x9Height = function(width){
	return (9 * width) / 16
}

export default VideoComponent
