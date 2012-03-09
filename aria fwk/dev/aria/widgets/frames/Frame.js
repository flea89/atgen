/*
 * Copyright Amadeus
 */
/**
 * The Frame class is a base class used by widgets which need a border.
 * @class aria.widgets.container.Frame
 */
Aria.classDefinition({
	$classpath : 'aria.widgets.frames.Frame',
	$dependencies : ['aria.utils.Dom'],
	/**
	 * @param {aria.widgets.frames.CfgBeans.FrameCfg} cfg Frame configuration.
	 */
	$constructor : function (cfg) {
		cfg.stateObject = cfg.skinObject.states[cfg.state];
		/**
		 * CSS prefix for the current skin class and state
		 * @type {String}
		 * @protected
		 */
		this._cssPrefix = ['x', cfg.skinnableClass, '_', cfg.sclass, '_', cfg.state, "_"].join("");
		/**
		 * Frame configuration.
		 * @type aria.widgets.frames.CfgBeans.FrameCfg
		 * @protected
		 */
		this._cfg = cfg;
		/**
		 * The width available for the client area. This value is set at the Frame creation time and may change when the
		 * state changes. A value of -1 means that the content of the frame can have any width, the size of the frame
		 * will be adapted.
		 * @type Number
		 * @public
		 */
		this.innerWidth = cfg.width;
		/**
		 * The width available for the client area. This value is set at the Frame creation time and may change when the
		 * state changes. A value of -1 means that the content of the frame can have any height, the size of the frame
		 * will be adapted.
		 * @type Number
		 * @public
		 */
		this.innerHeight = cfg.height;
		/**
		 * The root element of the DOM structure generated by this frame. Is only available after the linkToDom method
		 * have been called.
		 * @type HTMLElement
		 * @protected
		 */
		this._domElt = null;
		/**
		 * The last open DOM element generated by writeMarkupBegin (which directly contains child elements). have been
		 * called.
		 * @type HTMLElement
		 * @protected
		 */
		this._childRootElt = null;
		/**
		 * The number of root dom elements generated by this frame (in writeMarkupBegin and writeMarkupEnd).
		 * @type Number
		 * @public
		 */
		this.domElementNbr = 1;
	},
	$destructor : function () {
		this._domElt = null;
		this._childRootElt = null;
	},
	$statics : {
		// ERROR MESSAGE:
		FRAME_INVALID_STATE : "Invalid state (%1) for the frame in this skinnable class (%2)."
	},
	$prototype : {
		/**
		 * Generate the begining of the markup for this frame.
		 * @param {aria.templates.MarkupWriter} out
		 */
		writeMarkupBegin : function (out) {},

		/**
		 * Generate the end of the markup for this frame.
		 * @param {aria.templates.MarkupWriter} out
		 */
		writeMarkupEnd : function (out) {},

		/**
		 * Link this frame to a DOM element after the markup has been inserted in the DOM.
		 * @param {HTMLElement} domElt The DOM element which corresponds to the first item inserted by the
		 * writeMarkupBegin method.
		 */
		linkToDom : function (domElt) {
			this.$assert(57, this._domElt == null);
			this._domElt = domElt;
		},

		/**
		 * Return one of the DOM elements inside the frame. Must not be called before linkToDom has been called.
		 * @param {Number} idx index of the child to retrieve. 0 means the first HTML element written after
		 * writeMarkupBegin has returned.
		 * @return {HTMLElement} the requested DOM element inside the frame
		 */
		getChild : function (idx) {
			return aria.utils.Dom.getDomElementChild(this._childRootElt, idx);
		},

		/**
		 * Checks if a state exists
		 * @param {String} stateName
		 * @return {Boolean}
		 */
		checkState : function (stateName) {
			return !!this._cfg.skinObject.states[stateName];
		},

		/**
		 * Change the state of the frame. Must not be called before linkToDom has been called.
		 * @param {String} stateName name of the state
		 */
		changeState : function (stateName) {
			var cfg = this._cfg;
			var newState = cfg.skinObject.states[stateName];
			if (newState == null) {
				this.$logError(this.FRAME_INVALID_STATE, [stateName, cfg.skinnableClass]);
				return;
			}
			cfg.state = stateName;
			cfg.stateObject = newState;
			this._cssPrefix = ['x', cfg.skinnableClass, '_', cfg.sclass, '_', cfg.state, "_"].join("");
		},

		/**
		 * Return the skin class object for this frame.
		 * @return {Object} skin class object
		 */
		getSkinObject : function () {
			return this._cfg.skinObject;
		},

		/**
		 * Return the current state object inside the skin class.
		 * @return {String} current state name
		 */
		getStateName : function () {
			return this._cfg.state;
		},

		/**
		 * Return the current state object inside the skin class.
		 * @return {Object} state object (could also be retrieved with getSkinObject().states[getStateName()])
		 */
		getStateObject : function () {
			return this._cfg.stateObject;
		},

		/**
		 * Resize the frame to new dimensions.
		 * @param {Number} width New width, or -1 to fit the content width
		 * @param {Number} height New height, or -1 to fit the content height
		 */
		resize : function (width, height) {
			var cfg = this._cfg;
			cfg.width = width;
			cfg.height = height;
		},

		/**
		 * Method intended to be used by classes which extend this class. It reads the frame configuration (this._cfg),
		 * the inner width (this.innerWidth) and appends width info (actual width and also CSS classes for
		 * scrollbars...) to the obj parameter, so that it is easier for each frame to set this in the DOM (both at
		 * markup generation time and when updating the state of the frame).
		 * @param {Object} obj object with style and className properties. This method sets the width property on this
		 * object (e.g. "100px"), and appends to the className property the CSS classes (e.g. " xOverflowXAuto").
		 * Moreover, if the style property is not null, the width is appended to it (e.g. "width:100px;").
		 */
		_appendInnerWidthInfo : function (obj) {
			if (this.innerWidth > -1) {
				obj.width = this.innerWidth + "px";
				if (obj.style != null) {
					obj.style += "width:" + obj.width + ";";
				}
				if (this._cfg.scrollBarX) {
					obj.className += " xOverflowXAuto";
				} else {
					obj.className += " xOverflowXHidden";
				}
				if (this._cfg.printOptions == "adaptX" || this._cfg.printOptions == "adaptXY") {
					obj.className += " xPrintAdaptX";
				}
			} else {
				obj.width = "";
			}
		},

		/**
		 * Method intended to be used by classes which extend this class. It reads the frame configuration (this._cfg),
		 * the inner height (this.innerHeight) and appends height info (actual height and also CSS classes for
		 * scrollbars...) to the obj parameter, so that it is easier for each frame to set this in the DOM (both at
		 * markup generation time and when updating the state of the frame).
		 * @param {Object} obj object with style and className properties. This method sets the height property on this
		 * object (e.g. "100px"), and appends to the className property the CSS classes (e.g. " xOverflowYAuto").
		 * Moreover, if the style property is not null, the height is appended to it (e.g. "height:100px;").
		 */
		_appendInnerHeightInfo : function (obj) {
			if (this.innerHeight > -1) {
				obj.height = this.innerHeight + "px";
				if (obj.style != null) {
					obj.style += "height:" + obj.height + ";";
				}
				if (this._cfg.scrollBarY) {
					obj.className += " xOverflowYAuto";
				} else {
					obj.className += " xOverflowYHidden";
				}
				if (this._cfg.printOptions == "adaptY" || this._cfg.printOptions == "adaptXY") {
					obj.className += " xPrintAdaptY";
				}
			} else {
				obj.height = "";
			}
		}
	}
});
