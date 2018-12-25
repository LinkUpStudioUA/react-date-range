'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _DateRangeMultiple = require('./DateRangeMultiple');

var _DateRangeMultiple2 = _interopRequireDefault(_DateRangeMultiple);

var _DefinedRange = require('./DefinedRange');

var _DefinedRange2 = _interopRequireDefault(_DefinedRange);

var _utils = require('../utils.js');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styles = require('../styles');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MultiplePicker = function (_Component) {
  _inherits(MultiplePicker, _Component);

  function MultiplePicker(props) {
    _classCallCheck(this, MultiplePicker);

    var _this = _possibleConstructorReturn(this, (MultiplePicker.__proto__ || Object.getPrototypeOf(MultiplePicker)).call(this, props));

    _this.state = {
      focusedRange: [(0, _utils.findNextRangeIndex)(props.ranges), 0]
    };
    _this.styles = (0, _utils.generateStyles)([_styles2.default, props.classNames]);
    return _this;
  }

  _createClass(MultiplePicker, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var focusedRange = this.state.focusedRange;

      return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(this.styles.dateRangePickerWrapper, this.props.className) },
        _react2.default.createElement(_DateRangeMultiple2.default, _extends({
          onRangeFocusChange: function onRangeFocusChange(focusedRange) {
            return _this2.setState({ focusedRange: focusedRange });
          },
          focusedRange: focusedRange
        }, this.props, {
          ref: function ref(t) {
            return _this2.dateRange = t;
          },
          className: undefined
        }))
      );
    }
  }]);

  return MultiplePicker;
}(_react.Component);

MultiplePicker.defaultProps = {};

MultiplePicker.propTypes = _extends({}, _DateRangeMultiple2.default.propTypes, _DefinedRange2.default.propTypes, {
  className: _propTypes2.default.string
});

exports.default = MultiplePicker;