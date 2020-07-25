import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

import CubeComponent from 'potassium-components/src/atoms/CubeComponent'

/**
ProgressComponent tracks change of a process.

@todo make it watch a field on the dataObject with a filter function that maps to 'starting'|'complete'|'failed'|[0,1]
*/
const ProgressComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	@param {number} [options.initialValue=0]
	@param {string} [options.dataField=null] - a DataModel field to track with this progress readout
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					initialValue: 0,
					dataField: null
				},
				options
			),
			inheritedOptions
		)
		this._updateFromData = this._updateFromData.bind(this)
		this.addClass('progress-component')
		this.setName('ProgressComponent')

		this._trackComponent = new CubeComponent(null, {}, this.inheritedOptions)
			.appendTo(this)
			.addClass('track-component')
			.setName('TrackComponent')
		this._fillComponent = new CubeComponent(null, {}, this.inheritedOptions)
			.appendTo(this._trackComponent)
			.addClass('fill-component')
			.setName('FillComponent')

		this._value = -1 // ranges from 0 to 1
		this.value = this.options.initialValue
		if (this.dataObject && this.options.dataField) {
			this.listenTo(`changed:${this.options.dataField}`, this.dataObject, this._updateFromData)
			this._updateFromData()
		}
	}

	/**
	value - float from 0 to 1
	*/
	get value() {
		return this._value
	}

	/**
	value - float from 0 to 1
	*/
	set value(val) {
		val = parseFloat(val)
		if (Number.isNaN(val)) return
		if (val < 0) val = 0
		if (val > 1) val = 1
		if (this._value === val) return
		this._value = val
		this._updateDisplay()
	}

	_updateFromData() {
		if (!this.dataObject || !this.options.dataField) return
		this.value = this.dataObject.get(this.options.dataField, 0)
	}

	_updateDisplay() {
		this._fillComponent.flatDOM.style['width'] = this.value * 100 + '%'
		this._fillComponent.portalDOM.style['width'] = this.value * 100 + '%'
		this._fillComponent.portalSOM.styles.assignedStyles.set('scale', `${this.value} 1 1`)
		this._fillComponent.immersiveSOM.styles.assignedStyles.set('scale', `${this.value} 1 1`)
	}
}

export default ProgressComponent
