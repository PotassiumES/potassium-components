import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import { lt, ld, ldt } from 'potassium-es/src/Localizer'

import LabelComponent from 'potassium-components/src/atoms/LabelComponent'

/**
WaitComponent shows a spinner, to ensure the user that a process is happening.
*/
const WaitComponent = class extends LabelComponent {
	/**
	@param {DataObject} [dataObject=null]
	@param {Object} [options=null]
	*/
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(dataObject, options, inheritedOptions)
		this.addClass('wait-component')
		this.setName('WaitComponent')

		this._state = WaitComponent.NOTHING_HAPPENING
		this._animationInterval = null
		this._animationIndex = 0

		if (this.usesPortalSpatial) {
			this._portalObj = som
				.obj('/static/potassium-components/models/wait-component.obj', () => {
					this.portalSOM.styles.geometryIsDirty = true
				})
				.appendTo(this.portalSOM)
			this._portalObj.addClass('icon')
			this._portalObj.name = 'Icon'
		} else {
			this._portalObj = null
		}

		if (this.usesImmersive) {
			this._immersiveObj = som
				.obj('/static/potassium-components/models/wait-component.obj', () => {
					this.immersiveSOM.styles.geometryIsDirty = true
				})
				.appendTo(this.immersiveSOM)
			this._immersiveObj.addClass('icon')
			this._immersiveObj.name = 'Icon'
		} else {
			this._immersiveObj = null
		}

		this._updateDisplay()
	}

	get state() {
		return this._state
	}

	set state(val) {
		if (this._state === val) return
		if (_states.includes(val) === false) {
			console.error('unknown state', val)
			return
		}
		this._state = val
		this._updateDisplay()
	}

	_startAnimation() {
		if (this._animationInterval !== null) return
		this._animationIndex = 0
		this._animationInterval = setInterval(() => {
			this.flatDOM.removeClass(..._animationClassNames)
			this.portalDOM.removeClass(..._animationClassNames)
			this.flatDOM.addClass(_animationClassNames[this._animationIndex])
			this.portalDOM.addClass(_animationClassNames[this._animationIndex])
			this._animationIndex = (this._animationIndex + 1) % _animationClassNames.length
		}, _animationTicks)
	}

	_stopAnimation() {
		if (this._animationInterval !== null) {
			clearInterval(this._animationInterval)
			this._animationInterval = null
		}
		this._animationIndex = 0
		this.removeClass(..._animationClassNames)
	}

	_updateDisplay() {
		switch (this._state) {
			case WaitComponent.NOTHING_HAPPENING:
				this._stopAnimation()
				this.removeClass('processing', 'failed', 'succeeded')
				this.addClass('nothing-happening')
				this.text = lt('')
				break
			case WaitComponent.PROCESSING:
				this._startAnimation()
				this.removeClass('nothing-happening', 'failed', 'succeeded')
				this.addClass('processing')
				this.text = lt('Processing...')
				break
			case WaitComponent.FAILED:
				this._stopAnimation()
				this.removeClass('nothing-happening', 'processing', 'succeeded')
				this.addClass('failed')
				this.text = lt('Failed')
				break
			case WaitComponent.SUCCEEDED:
				this._stopAnimation()
				this.removeClass('nothing-happening', 'processing', 'failed')
				this.addClass('succeeded')
				this.text = lt('Succeeded')
				break
		}
	}
}

WaitComponent.NOTHING_HAPPENING = 'nothing-happening'
WaitComponent.PROCESSING = 'processing'
WaitComponent.FAILED = 'failed'
WaitComponent.SUCCEEDED = 'succeeded'

const _animationTicks = 1500

const _animationClassNames = ['wait-top', 'wait-right', 'wait-bottom', 'wait-left']

const _states = [
	WaitComponent.NOTHING_HAPPENING,
	WaitComponent.PROCESSING,
	WaitComponent.FAILED,
	WaitComponent.SUCCEEDED
]

export default WaitComponent
