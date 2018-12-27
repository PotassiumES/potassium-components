import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import { lt, ld, ldt } from 'potassium-es/src/Localizer'

import Component from 'potassium-es/src/Component'

import AudioComponent from 'potassium-components/src/atoms/AudioComponent'
import ButtonComponent from 'potassium-components/src/atoms/ButtonComponent'

/**
AudioPlayerComponent shows an {@link AudioComponent} along with play/pause and shuttle controls.
*/
const AudioPlayerComponent = class extends Component {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	@param {string} [options.audio=null] - a URL to an audio file
	@param {HTMLElement} [options.audioDOM=null] - an HTML `audio` element to use as a source
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(dataObject, options, inheritedOptions)
		this.addClass('audio-player-component')
		this.setName('AudioPlayerComponent')
		this._updateDisplay = this._updateDisplay.bind(this)

		this._audioComponent = new AudioComponent(
			this.dataObject,
			{
				audio: this.options.audio,
				audioDOM: this.options.audioDOM
			},
			this.inheritedOptions
		).appendTo(this)

		this._toggleButton = new ButtonComponent(null, {}, this.inheritedOptions)
			.appendTo(this)
			.addClass('toggle-button-component')
			.setName('ToggleButtonComponent')
		this.listenTo(ButtonComponent.ChangedEvent, this._toggleButton, (eventName, active) => {
			if (active === false) return
			if (this.audio.paused) {
				this.audio.play()
			} else {
				this.audio.pause()
			}
		})

		this.listenTo('playing', this.audio, this._updateDisplay)
		this.listenTo('pause', this.audio, this._updateDisplay)
		this.listenTo('ended', this.audio, this._updateDisplay)

		this._updateDisplay()
	}

	get audio() {
		return this._audioComponent.audio
	}

	_updateDisplay() {
		if (this.audio.paused) {
			this._toggleButton.text = lt('Play')
		} else {
			this._toggleButton.text = lt('Pause')
		}
	}
}

export default AudioPlayerComponent
