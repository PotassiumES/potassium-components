import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import Component from 'potassium-es/src/Component'
import { lt, ld, ldt } from 'potassium-es/src/Localizer'

import ButtonComponent from 'potassium-components/src/atoms/ButtonComponent.js'

/**
ModalComponent shows another Component in front of other content.
*/
const ModalComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options={}]
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					columns: ['key', 'value'],
					name: 'ModalComponent',
					buttons: [{ name: lt('Go'), id: 'go' }, { name: lt('Cancel'), id: 'cancel' }]
				},
				options
			),
			inheritedOptions
		)
		this.addClass('modal-component')

		for (const buttonInfo of this.options.buttons) {
			const button = new ButtonComponent(
				undefined,
				{
					id: buttonInfo.id,
					text: buttonInfo.name
				},
				this.inheritedOptions
			).appendTo(this)
			this.listenTo(ButtonComponent.ChangedEvent, button, (actionName, value) => {
				this.trigger(ModalComponent.ButtonActivatedEvent, buttonInfo.id, buttonInfo.name)
			})
		}
	}
}

ModalComponent.ButtonActivatedEvent = Symbol('button-action')

export default ModalComponent
