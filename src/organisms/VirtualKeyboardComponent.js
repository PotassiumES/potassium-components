import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import Component from 'potassium-es/src/Component'

import ButtonComponent from '../atoms/ButtonComponent'

/**
VirtualKeyboardComponent routes button activations to the Component.TextInputReceiver.sendTextCommand(...) which routes it into the action-input system.
*/
const VirtualKeyboardComponent = class extends Component {
	/**
	@param {DataObject} [dataObject]
	@param {Object} options
	@param {Object} options.keyboardLayout
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					usesFlat: false,
					usesPortalOverlay: false,
					usesPortalSpatial: false,
					keyboardLayout: new USEnglishLayout() // TODO set this from locale
				},
				options
			),
			inheritedOptions
		)
		this.addClass('virtual-keyboard-component')
		this.setName('VirtualKeyboardComponent')

		this._keyboardLayout = null
		this._keysComponent = null

		this.keyboardLayout = this.options.keyboardLayout
	}

	get keyboardLayout() {
		return this._keyboardLayout
	}

	set keyboardLayout(keyboardLayout) {
		if (this._keyboardLayout === keyboardLayout) return
		this._keyboardLayout = keyboardLayout
		if (this._keysComponent) {
			this.removeComponent(this._keysComponent)
			this._keysComponent.cleanup()
		}
		this._keysComponent = new Component(undefined, {}, this.inheritedOptions).appendTo(this)
		this._keysComponent.addClass('keys-component')
		for (const line of this._keyboardLayout.keyLines) {
			const lineComponent = new Component(undefined, {}, this.inheritedOptions).appendTo(this._keysComponent)
			lineComponent.addClass('line-component')
			for (const key of line) {
				new KeyComponent(key, this.inheritedOptions).appendTo(lineComponent)
			}
		}
	}
}

class KeyComponent extends ButtonComponent {
	constructor(key, inheritedOptions) {
		super(
			undefined,
			{
				text: key.display
			},
			inheritedOptions
		)
		this.addClass('key-component')
		this.setName('KeyComponent')
		this.key = key
		this.listenTo(ButtonComponent.ChangedEvent, this, (eventName, active) => {
			if (active === false) return
			Component.TextInputReceiver.sendTextCommand(this.key.command)
		})
	}
}

class KeyboardLayout {
	constructor() {
		this._keyLines = []
		for (const line of this.characters) {
			this._keyLines.push(line.map((char) => new Key(char)))
		}
		this._keyLines.push([new Key('delete'), new Key('shift'), new Key('space'), new Key('enter')])
	}
	get keyLines() {
		return this._keyLines
	}
	get characters() {
		throw new Error('Not implemented')
	}
}

class Key {
	constructor(command, display = null) {
		this.command = command
		this.display = display === null ? command : display
	}
}

class USEnglishLayout extends KeyboardLayout {
	get characters() {
		return [
			['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
			['k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
			['u', 'v', 'w', 'x', 'y', 'z'],
			['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
		]
	}
}

export default VirtualKeyboardComponent
