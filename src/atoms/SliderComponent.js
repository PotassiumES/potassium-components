import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

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
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(dataObject, options, inheritedOptions)
		this.addClass('slider-component')
		this.setName('SliderComponent')
		this._handleMouseMove = this._handleMouseMove.bind(this)
		this._handleMouseUp = this._handleMouseUp.bind(this)

		this._minValue = 0
		this._maxValue = 1
		this._value = null

		this._barWidth = 0.08 // Set in slider-component.kss
		this._handleWidth = 0.01 // Set in slider-component.kss
		this._handleY = 0
		this._handleXStart = 0
		this._handleXEnd = this._barWidth - this._handleWidth

		this._handleComponent = new CubeComponent(null, {}, this.inheritedOptions).appendTo(this)
		this._handleComponent.addClass('slider-handle')
		this._handleComponent.setName('SliderHandle')

		this._barComponent = new CubeComponent(null, {}, this.inheritedOptions).appendTo(this)
		this._barComponent.addClass('slider-bar')
		this._barComponent.setName('SliderBar')

		this.value = this._value

		this._pointerDown = false
		this._pointerStart = 0 // page x, y
		this._handleStart = 0 // left value

		if (this.usesFlat) {
			// set up listeners for dragging of the handle
			this.listenTo('mousedown', this._handleComponent.flatDOM, ev => {
				ev.preventDefault()
				this._pointerDown = true
				this._pointerStart = ev.pageX
				this._handleStart = Number.parseFloat(this._handleComponent.flatDOM.style['left'] || '0')
				// We listen to both the handle and the base component because the browser often can't keep up
				this._handleComponent.flatDOM.addEventListener('mousemove', this._handleMouseMove)
				this.flatDOM.addEventListener('mousemove', this._handleMouseMove)
			})
			this.listenTo('mouseup', this._handleComponent.flatDOM, this._handleMouseUp)
			this.listenTo('mouseup', this.flatDOM, this._handleMouseUp)
			this.listenTo('mouseleave', this.flatDOM, this._handleMouseUp)
		}
	}

	/** @type {number} the current value */
	get value() {
		return this._value
	}

	/**
	@param {number} val - a number to set the slider value which will be clamped in the minValue and maxValue inclusive range
	*/
	set value(val) {
		this._value = Math.min(this._maxValue, Math.max(this._minValue, val))
		this._updateHandlePosition()
	}

	/**
	@return {number} The fraction between 0 and 1 inclusive that the current value is between the minValue and maxValue
	*/
	get valueFraction() {
		return this._value / (this._maxValue - this._minValue)
	}

	/**
	@param {number} fraction - a number between 0 and 1
	*/
	set valueFraction(fraction) {
		fraction = Math.min(1, Math.max(0, fraction))
		this.value = this._minValue + (this._maxValue - this._minValue) * fraction
	}

	get minValue() {
		return this._minValue
	}
	get maxValue() {
		return this._maxValue
	}

	/** @type {boolean} - true if the user is moving the handle */
	get userIsChanging() {
		return this._pointerDown
	}

	_handleMouseMove(ev) {
		const xChange = ev.pageX - this._pointerStart
		this._handleComponent.flatDOM.style['left'] = this._handleStart + xChange + 'px'
	}

	_handleMouseUp(ev) {
		ev.preventDefault()
		if (this._pointerDown === false) return
		this._pointerDown = false
		this._handleComponent.flatDOM.removeEventListener('mousemove', this._handleMouseMove)
		this.flatDOM.removeEventListener('mousemove', this._handleMouseMove)
		this.valueFraction = this._getValueFractionFromHandlePosition(
			this._handleComponent.flatDOM,
			this._barComponent.flatDOM
		)
		this.trigger(SliderComponent.VALUE_CHANGE_VIA_INPUT, this.valueFraction)
	}

	_getValueFractionFromHandlePosition(handleDOM, barDOM) {
		const handleLeft = Number.parseFloat(handleDOM.style['left'] || '0')
		if (barDOM.clientWidth === 0 || handleDOM.clientWidth === 0) return 0
		if (handleLeft < 0) return 0
		if (handleLeft >= barDOM.clientWidth) return 1
		return handleLeft / (barDOM.clientWidth - handleDOM.clientWidth)
	}

	_updateFlatHandlePosition(barDOM, handleDOM) {
		const barWidth = barDOM.clientWidth
		const handleWidth = handleDOM.clientWidth
		if (barWidth === 0 || handleWidth === 0) return // Not on the page yet
		const startX = 0
		const endX = barWidth - handleWidth
		const x = startX + (endX - startX) * this.valueFraction
		handleDOM.style['left'] = `${x}px`
	}

	_updateHandlePosition() {
		this._updateFlatHandlePosition(this._barComponent.flatDOM, this._handleComponent.flatDOM)
		this._updateFlatHandlePosition(this._barComponent.portalDOM, this._handleComponent.portalDOM)

		// set som positions
		const newPosition = [
			this._handleXStart + (this._handleXEnd - this._handleXStart) * this.valueFraction,
			this._handleY,
			0
		]
		this._handleComponent.portalSOM.position.set(...newPosition)
		this._handleComponent.immersiveSOM.position.set(...newPosition)
	}
}

SliderComponent.VALUE_CHANGE_VIA_INPUT = 'value-changed-via-input'

export default SliderComponent
