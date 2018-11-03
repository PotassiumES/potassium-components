import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import Component from 'potassium-es/src/Component'
import { Localizer, lt, ld, ldt, ldo } from 'potassium-es/src/Localizer'

import LabelComponent from 'potassium-components/src/atoms/LabelComponent'
import SelectionComponent from 'potassium-components/src/atoms/SelectionComponent'
import TextInputComponent from 'potassium-components/src/atoms/TextInputComponent'

/**
DateTimePicker gives the user the ability to choose a date and optionally a time
*/
const DateTimePickerComponent = class extends Component {
	/**
	@param {Object} [options]
	@param {string} [options.dataField] the name of a {Date} field in this.dataObject
	@param {boolean} [options.pickDate] if false, hide the date picking UI
	@param {boolean} [options.pickTime] if false, hide the time picking UI
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					pickTime: true
				},
				options
			),
			inheritedOptions
		)
		this.addClass('date-time-picker-component')
		this.setName('DateTimePickerComponent')

		if (this.dataObject && this.options.dataField) {
			this._date = null
		} else {
			this._date = new Date()
		}

		this._monthFormGroup = new Component().appendTo(this).addClass('form-group')
		if (this.options.pickDate === false) this._monthFormGroup.hide()

		// Month picker
		this._monthSelectionComponent = new SelectionComponent(
			null,
			{
				items: Localizer.Singleton.monthNames.map((name, index) => [name, index])
			},
			this.inheritedOptions
		).appendTo(this._monthFormGroup)
		this._monthSelectionComponent.addClass('month-component')

		this._dateFormGroup = new Component().appendTo(this).addClass('form-group')
		if (this.options.pickDate === false) this._dateFormGroup.hide()

		// Date input
		this._dateLabelComponent = new LabelComponent(
			null,
			{
				text: lt('Date')
			},
			this.inheritedOptions
		).appendTo(this._dateFormGroup)
		this._dateInputComponent = new TextInputComponent(
			null,
			{
				placeholder: '31'
			},
			this.inheritedOptions
		).appendTo(this._dateFormGroup)
		this._dateInputComponent.addClass('date-component')

		this._yearFormGroup = new Component().appendTo(this).addClass('form-group')
		if (this.options.pickDate === false) this._yearFormGroup.hide()

		// Year input
		this._yearLabelComponent = new LabelComponent(
			null,
			{
				text: lt('Year')
			},
			this.inheritedOptions
		).appendTo(this._yearFormGroup)
		this._yearInputComponent = new TextInputComponent(
			null,
			{
				placeholder: '1999'
			},
			this.inheritedOptions
		).appendTo(this._yearFormGroup)
		this._yearInputComponent.addClass('year-component')

		this._timeFormGroup = new Component().appendTo(this).addClass('form-group')
		if (this.options.pickTime === false) this._timeFormGroup.hide()

		// Time input
		this._timeLabelComponent = new LabelComponent(
			null,
			{
				text: lt('Time')
			},
			this.inheritedOptions
		).appendTo(this._timeFormGroup)
		this._timeInputComponent = new TextInputComponent(
			null,
			{
				placeholder: '20:10'
			},
			this.inheritedOptions
		).appendTo(this._timeFormGroup)
		this._timeInputComponent.addClass('time-component')

		if (this.dataObject && this.options.dataField) {
			this.dataObject.addListener((eventName, model, field, value) => {
				this.updateFromModel()
			}, `changed:${this.options.dataField}`)
			this.updateFromModel()
		}
	}
	get date() {
		if (this.dataObject && this.options.dataField) {
			return this.dataObject.get(this.options.dataField, null)
		}
		return this._date
	}
	saveInputToModel() {
		if (
			this._monthSelectionComponent.selectedIndex === 0 &&
			this._dateInputComponent.text === '' &&
			this._yearInputComponent.text === ''
		) {
			this.dataObject.set(this.options.dataField, null)
			return null
		}
		const date = this.parseInput()
		if (date === null) {
			console.error(
				'invalid input',
				this._monthSelectionComponent.selectedIndex,
				this._dateInputComponent.text,
				this._yearInputComponent.text,
				this._timeInputComponent.text
			)
			return null
		}
		this.dataObject.set(this.options.dataField, date)
		return date
	}
	parseInput() {
		const date = Number.parseInt(this._dateInputComponent.text)
		const year = Number.parseInt(this._yearInputComponent.text)
		if (Number.isNaN(date) || Number.isNaN(year)) return null
		const timeTokens = this._timeInputComponent.text.split(':')
		if (timeTokens.length !== 2) return null
		const hours = Number.parseInt(timeTokens[0])
		const minutes = Number.parseInt(timeTokens[1])
		if (Number.isNaN(hours) || Number.isNaN(minutes)) return

		const result = new Date()
		result.setYear(year)
		result.setMonth(this._monthSelectionComponent.selectedIndex)
		result.setDate(date)
		result.setHours(hours)
		result.setMinutes(minutes)
		result.setSeconds(0)
		return result
	}
	updateFromModel() {
		const date = this.date
		if (date === null) {
			this._monthSelectionComponent.selectedIndex = 0
			this._dateInputComponent.text = ''
			this._yearInputComponent.text = ''
			this._timeInputComponent.text = ''
			return
		}
		this._monthSelectionComponent.selectedIndex = date.getMonth()
		this._dateInputComponent.text = date.getDate()
		this._yearInputComponent.text = date.getFullYear()
		this._timeInputComponent.text = `${date.getHours()}:${date.getMinutes()}`
	}
}

export default DateTimePickerComponent
