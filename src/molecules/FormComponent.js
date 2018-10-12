import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'
import { lt, ld } from 'potassium-es/src/Localizer'
import Component from 'potassium-es/src/Component'

import ButtonComponent from 'potassium-components/src/atoms/ButtonComponent'
import LabelComponent from 'potassium-components/src/atoms/LabelComponent'
import HeadingComponent from 'potassium-components/src/atoms/HeadingComponent'
import TextInputComponent from 'potassium-components/src/atoms/TextInputComponent'

import WaitComponent from './WaitComponent.js'
import DateTimePickerComponent from './DateTimePickerComponent.js'

const EditIcon = '✏️'
const SaveIcon = '✓'
const CancelIcon = '✕'

/**
FormComponent holds a set of sub-Components related to filling out information in a form.
It also handles marshalling and unmarshalling data for communication with the server.
It also handles input checking and the display of per-field and form-wide error messages.
*/
const FormComponent = class extends Component {
	/**
	@param {DataObject} [dataObject]
	@param {Object} [options] see the {@Component} for inherited options
	@param {string} [options.heading] the heading text for this form
	*/
	constructor(dataObject = null, options = {}) {
		super(dataObject, options)
		this.addClass('form-component')

		this._headingComponent = new HeadingComponent(null, {
			flatEl: el.h2(),
			portalEl: el.h2(),
			text: options.heading || ''
		}).appendTo(this)
		if (!options.heading) {
			this._headingComponent.hide()
		}

		this._fieldsComponent = new Component().appendTo(this)

		this._waitComponent = new WaitComponent().appendTo(this)
	}

	/** @type {Component} in which you should place your field Components */
	get fieldsComponent() {
		return this._fieldsComponent
	}
}

/**
FormFieldComponent is the base Component for fields in a FormComponent
*/
const FormFieldComponent = class extends Component {
	/**
	@param {string}   [options.label] the display text for this input field
	@param {string}   [options.dataField] the field name for the {@link DataModel} in this.dataObject
	*/
	constructor(dataObject = null, options = {}) {
		super(
			dataObject,
			Object.assign(
				{
					label: null,
					dataField: null
				},
				options
			)
		)
		this.addClass('form-field-component')

		this._label = new LabelComponent(null, {
			text: this.options.label || ''
		}).appendTo(this)
		if (!this.options.label) this._label.hide()
	}
}

/**
DateFieldComponent
*/
const DateFieldComponent = class extends FormFieldComponent {
	/**
	@param {DataModel} [dataObject]
	@param {Object}    [options] see {@link FormFieldComponent} for more options
	*/
	constructor(dataObject = null, options = {}) {
		super(dataObject, options)
		this.addClass('date-field-component')

		this._labelComponent = new LabelComponent().appendTo(this)
		if (this.dataObject && this.options.dataField) {
			this.dataObject.addListener((eventName, model, fieldName, value) => {
				if (!value) {
					this._labelComponent.text = ''
					return
				}
				this._labelComponent.text = ld(value)
			}, `changed:${this.options.dataField}`)
			const date = this.dataObject.get(this.options.dataField)
			if (date) {
				this._labelComponent.text = ld(date)
			}
		}

		this._startEditComponent = new LabelComponent(null, { text: EditIcon }).appendTo(this)
		this._startEditComponent.addClass('start-edit-component')
		this._startEditComponent.addListener((eventName, action, active, options) => {
			if (action === '/action/activate' && active) {
				this.startEdit()
			}
		}, Component.ActionEvent)

		this._datePickerComponent = new DateTimePickerComponent(this.dataObject, {
			dataField: this.options.dataField,
			pickTime: false
		}).appendTo(this)

		this._saveEditComponent = new LabelComponent(null, { text: SaveIcon }).appendTo(this)
		this._saveEditComponent.addClass('save-edit-component')
		this._saveEditComponent.addListener((eventName, action, active, options) => {
			if (action === '/action/activate' && active) {
				this.saveEdit()
			}
		}, Component.ActionEvent)

		this._cancelEditComponent = new LabelComponent(null, { text: CancelIcon }).appendTo(this)
		this._cancelEditComponent.addClass('cancel-edit-component')
		this._cancelEditComponent.addListener((eventName, action, active, options) => {
			if (action === '/action/activate' && active) {
				this.cancelEdit()
			}
		}, Component.ActionEvent)

		this.stopEdit()
	}

	startEdit() {
		this._labelComponent.hide()
		this._startEditComponent.hide()
		this._datePickerComponent.show()
		this._saveEditComponent.show()
		this._cancelEditComponent.show()
	}

	stopEdit() {
		this._labelComponent.show()
		this._startEditComponent.show()
		this._datePickerComponent.hide()
		this._saveEditComponent.hide()
		this._cancelEditComponent.hide()
	}

	cancelEdit() {
		this.stopEdit()
		this._datePickerComponent.updateFromModel()
	}

	saveEdit() {
		if (this._datePickerComponent.saveInputToModel() === null) {
			console.error('Could not save date')
			return
		}
		this.stopEdit()
	}
}

/**
TextInputFieldComponent provides a text field, natch
*/
const TextInputFieldComponent = class extends FormFieldComponent {
	/**
	@param {DataModel} [dataObject]
	@param {Object}    [options] see {@link FormFieldComponent} for more options
	@param {string}    [options.placeholder] the text displayed in the field when there is no value text
	*/
	constructor(dataObject = null, options = {}) {
		super(
			dataObject,
			Object.assign(
				{
					placeholder: null
				},
				options
			)
		)
		this.addClass('text-input-field-component')

		this._textInputComponent = new TextInputComponent(dataObject, {
			placeholder: this.options.placeholder,
			dataField: this.options.dataField
		}).appendTo(this)
		this._textInputComponent.addListener((eventName, value) => {
			this._handleInputChange(value)
		}, TextInputComponent.TextChangeEvent)

		if (this.dataObject && this.options.dataField) {
			this.dataObject.addListener((eventName, model, fieldName, value) => {
				this._handleModelChange(value)
			}, `changed:${this.options.dataField}`)
		}
	}

	_handleInputChange(value) {
		if (!this.dataObject || !this.options.dataField) return
		if (this.dataObject.get(this.options.dataField) === value) return
		this.dataObject.set(this.options.dataField, value)
	}

	_handleModelChange(value) {
		if (this._textInputComponent.text === value) return
		this._textInputComponent.text = value
	}
}

export default FormComponent
export { DateFieldComponent, FormComponent, TextInputFieldComponent }
