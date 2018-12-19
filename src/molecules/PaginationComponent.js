import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import { lt, ld, ldt } from 'potassium-es/src/Localizer'

import Component from 'potassium-es/src/Component'

import LabelComponent from 'potassium-components/src/atoms/LabelComponent'
import IconComponent from 'potassium-components/src/atoms/IconComponent'

/**
PaginationComponent shows controls for moving forward and back in a {@link ListComponent} or a {@link CollectionComponent}
*/
const PaginationComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	@param {number} [options.totalCount=1]
	@param {number} [options.currentIndex=1]
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					totalCount: 1,
					currentIndex: 1
				},
				options
			),
			inheritedOptions
		)
		this.addClass('pagination-component')
		this.setName('PaginationComponent')

		this._totalCount = this.options.totalCount
		this._currentIndex = this.options.currentIndex

		this._leftArrow = new IconComponent(
			undefined,
			{
				imageURL: '/static/potassium-components/images/left-arrow.png',
				modelURL: '/static/potassium-components/models/toggle-component.obj'
			},
			this.inheritedOptions
		)
			.appendTo(this)
			.addClass('left-arrow')
			.setName('LeftArrow')
		this.listenTo(Component.ActionEvent, this._leftArrow, (eventName, actionName, value, actionParameters) => {
			if (actionName === '/action/activate') {
				this.currentIndex = this.currentIndex - 1
			}
		})

		this._statusLabel = new LabelComponent(undefined, undefined, this.inheritedOptions).appendTo(this)

		this._rightArrow = new IconComponent(
			undefined,
			{
				imageURL: '/static/potassium-components/images/right-arrow.png',
				modelURL: '/static/potassium-components/models/toggle-component.obj'
			},
			this.inheritedOptions
		)
			.appendTo(this)
			.addClass('right-arrow')
			.setName('RightArrow')
		this.listenTo(Component.ActionEvent, this._rightArrow, (eventName, actionName, value, actionParameters) => {
			if (actionName === '/action/activate') {
				this.currentIndex = this.currentIndex + 1
			}
		})
		this._updateDisplay()
	}

	get totalCount() {
		return this._totalCount
	}
	set totalCount(val) {
		if (val === this._totalCount) return
		this._totalCount = val
		this._updateDisplay()
	}

	get currentIndex() {
		return this._currentIndex
	}
	set currentIndex(val) {
		if (val === this._currentIndex) return
		if (val < 1 || val > this._totalCount) return
		this._currentIndex = val
		this._updateDisplay()
		this.trigger(PaginationComponent.CurrentIndexChanged, this._currentIndex, this._totalCount, this)
	}

	_updateDisplay() {
		this._statusLabel.text = this._currentIndex + '\n' + lt('of') + '\n' + this._totalCount
		if (this._currentIndex === 1) {
			this._leftArrow.addClass('disabled')
		} else {
			this._leftArrow.removeClass('disabled')
		}
		if (this._currentIndex === this._totalCount) {
			this._rightArrow.addClass('disabled')
		} else {
			this._rightArrow.removeClass('disabled')
		}
	}
}

PaginationComponent.CurrentIndexChanged = Symbol('current-index-changed')

export default PaginationComponent
