import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

import CubeComponent from 'potassium-components/src/atoms/CubeComponent'

/**
SliderComponent gives the user the ability to choose from a range of values.
*/
const SliderComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject = null, options = {}) {
		super(dataObject, options)
		this.addClass('slider-component')
		this.setName('SliderComponent')

		this._minValue = 0
		this._maxValue = 1
		this._value = null

		this._barWidth = 1 // Set in slider-component.kss
		this._handleWidth = 0.05 // Set in slider-component.kss
		this._handleY = 0.015
		this._handleXStart = 0
		this._handleXEnd = 0

		this._handleComponent = new CubeComponent().appendTo(this)
		this._handleComponent.addClass('slider-handle')
		this._handleComponent.setName('SliderHandle')

		this._barComponent = new CubeComponent().appendTo(this)
		this._barComponent.addClass('slider-bar')
		this._barComponent.setName('SliderBar')

		this._calculatePositions()
		this.value = this._value
	}

	/** @type {number} the current value */
	get value(){ return this._value }

	/**
	@param {number} val - a number to set the slider value which will be clamped in the minValue and maxValue inclusive range
	*/
	set value(val){
		this._value = Math.min(this._maxValue, Math.max(this._minValue, val))
		this._updateHandlePosition()
	}

	/**
	@return {number} The fraction between 0 and 1 inclusive that the current value is between the minValue and maxValue
	*/
	get valueFraction(){ return this._value / (this._maxValue - this._minValue) }

	/**
	@param {number} fraction - a number between 0 and 1
	*/
	set valueFraction(fraction){
		fraction = Math.min(1, Math.max(0, fraction))
		this.value = this._minValue + ((this._maxValue - this._minValue) * fraction)
	}

	get minValue(){ return this._minValue }
	get maxValue(){ return this._maxValue }

	_calculatePositions(){
		this._handleXStart = (this._barWidth / -2) + (this._handleWidth / 2)
		this._handleXEnd = this._handleXStart * -1
	}

	_updateHandlePosition(){
		const newPosition = [
			this._handleXStart + ((this._handleXEnd - this._handleXStart) * this.valueFraction),
			this._handleY,
			0
		]
		this._handleComponent.portalGraph.position.set(...newPosition)
		this._handleComponent.immersiveGraph.position.set(...newPosition)
	}
}

export default SliderComponent
