import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'
import Component from 'potassium-es/src/Component'
import {Localizer, lt, ld, ldt, ldo} from 'potassium-es/src/Localizer'

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
	constructor(dataObject=null, options={}){
		super(dataObject, Object.assign({
			pickTime: true
		}, options))
		this.addClass('date-time-picker-component')

		if(this.dataObject && this.options.dataField){
			this._date = null
		} else {
			this._date = new Date()
		}

		// Month picker
		this._monthSelectionComponent = new SelectionComponent(null, {
			items: Localizer.Singleton.monthNames.map((name, index) => [name, index])
		}).appendTo(this)
		this._monthSelectionComponent.addClass('month-component')
		if(this.options.pickDate === false) this._monthSelectionComponent.hide()

		// Date input
		this._dateInputComponent = new TextInputComponent(null, {
			placeholder: 'date'
		}).appendTo(this)
		this._dateInputComponent.addClass('date-component')
		if(this.options.pickDate === false) this._dateSelectionComponent.hide()

		// Year input
		this._yearInputComponent = new TextInputComponent(null, {
			placeholder: 'year'
		}).appendTo(this)
		this._yearInputComponent.addClass('year-component')
		if(this.options.pickDate === false) this._yearInputComponent.hide()

		// Time input
		this._timeInputComponent = new TextInputComponent(null, {
			placeholder: 'time'
		}).appendTo(this)
		this._timeInputComponent.addClass('time-component')
		if(this.options.pickTime === false) this._timeInputComponent.hide()


		if(this.dataObject && this.options.dataField){
			this.dataObject.addListener((eventName, model, field, value) => {
				this.updateFromModel()
			}, `changed:${this.options.dataField}`)
			this.updateFromModel()
		}
	}
	get date(){
		if(this.dataObject && this.options.dataField){
			return this.dataObject.get(this.options.dataField, null)
		}
		return this._date
	}
	saveInputToModel(){
		if(
			this._monthSelectionComponent.selectedIndex === 0
			&& this._dateInputComponent.text === ''
			&& this._yearInputComponent.text === ''
		){
			this.dataObject.set(this.options.dataField, null)
			return null
		}
		const date = this.parseInput()
		if(date === null){
			console.error('invalid input', this._monthSelectionComponent.selectedIndex, this._dateInputComponent.text, this._yearInputComponent.text, this._timeInputComponent.text)
			return null
		}
		this.dataObject.set(this.options.dataField, date)
		return date
	}
	parseInput(){
		const date = Number.parseInt(this._dateInputComponent.text)
		const year = Number.parseInt(this._yearInputComponent.text)
		if(Number.isNaN(date) || Number.isNaN(year)) return null
		const timeTokens = this._timeInputComponent.text.split(':')
		if(timeTokens.length !== 2) return null
		const hours = Number.parseInt(timeTokens[0])
		const minutes = Number.parseInt(timeTokens[1])
		if(Number.isNaN(hours) || Number.isNaN(minutes)) return

		const result = new Date()
		result.setYear(year)
		result.setMonth(this._monthSelectionComponent.selectedIndex)
		result.setDate(date)
		result.setHours(hours)
		result.setMinutes(minutes)
		result.setSeconds(0)
		return result
	}
	updateFromModel(){
		const date = this.date
		if(date === null){
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
