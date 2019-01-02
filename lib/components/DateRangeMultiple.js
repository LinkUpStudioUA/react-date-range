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

var _Calendar = require('./Calendar.js');

var _Calendar2 = _interopRequireDefault(_Calendar);

var _DayCell = require('./DayCell');

var _utils = require('../utils.js');

var _getTime = require('date-fns/getTime');

var _getTime2 = _interopRequireDefault(_getTime);

var _max = require('date-fns/max');

var _max2 = _interopRequireDefault(_max);

var _isWithinInterval = require('date-fns/isWithinInterval');

var _isWithinInterval2 = _interopRequireDefault(_isWithinInterval);

var _min = require('date-fns/min');

var _min2 = _interopRequireDefault(_min);

var _addDays = require('date-fns/addDays');

var _addDays2 = _interopRequireDefault(_addDays);

var _differenceInCalendarDays = require('date-fns/differenceInCalendarDays');

var _differenceInCalendarDays2 = _interopRequireDefault(_differenceInCalendarDays);

var _isBefore = require('date-fns/isBefore');

var _isBefore2 = _interopRequireDefault(_isBefore);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styles = require('../styles');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DateRangeMultiple = function (_Component) {
  _inherits(DateRangeMultiple, _Component);

  function DateRangeMultiple(props, context) {
    _classCallCheck(this, DateRangeMultiple);

    var _this = _possibleConstructorReturn(this, (DateRangeMultiple.__proto__ || Object.getPrototypeOf(DateRangeMultiple)).call(this, props, context));

    _this.setSelection = _this.setSelection.bind(_this);
    _this.destroyRange = _this.destroyRange.bind(_this);
    _this.handleRangeFocusChange = _this.handleRangeFocusChange.bind(_this);
    _this.updatePreview = _this.updatePreview.bind(_this);
    _this.calcNewSelection = _this.calcNewSelection.bind(_this);
    _this.state = {
      focusedRange: props.initialFocusedRange || [(0, _utils.findNextRangeIndex)(props.ranges), 0],
      preview: null,
      isInfinite: props.isInfinite,
      infiniteRange: [].concat(_toConsumableArray(props.ranges))
    };
    _this.styles = (0, _utils.generateStyles)([_styles2.default, props.classNames]);
    return _this;
  }

  _createClass(DateRangeMultiple, [{
    key: 'calcNewSelection',
    value: function calcNewSelection(value) {
      var isSingleValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var focusedRange = this.props.focusedRange || this.state.focusedRange;
      var _props = this.props,
          onChange = _props.onChange,
          maxDate = _props.maxDate,
          moveRangeOnFirstSelection = _props.moveRangeOnFirstSelection,
          disabledDates = _props.disabledDates;
      // const focusedRangeIndex = focusedRange[0];

      var ranges = this.state.infiniteRange;
      var selectedRange = ranges[ranges.length - 1];
      // console.log("selectedRange", selectedRange);
      if (!selectedRange || !onChange) return {};

      // console.warn("this.state.infiniteRange", this.state.infiniteRange)
      // console.warn("ranges", ranges)

      var startDate = selectedRange.startDate,
          endDate = selectedRange.endDate;

      if (!endDate) endDate = new Date(startDate);
      var nextFocusRange = void 0;
      if (!isSingleValue) {
        startDate = value.startDate;
        endDate = value.endDate;
      } else if (focusedRange[1] === 0) {
        // startDate selection
        var dayOffset = (0, _differenceInCalendarDays2.default)(endDate, startDate);
        startDate = value;
        endDate = moveRangeOnFirstSelection ? (0, _addDays2.default)(value, dayOffset) : value;
        if (maxDate) endDate = (0, _min2.default)([endDate, maxDate]);
        nextFocusRange = [focusedRange[0], 1];
      } else {
        endDate = value;
      }

      // reverse dates if startDate before endDate
      var isStartDateSelected = focusedRange[1] === 0;
      if ((0, _isBefore2.default)(endDate, startDate)) {
        isStartDateSelected = !isStartDateSelected;
        var _ref = [endDate, startDate];
        startDate = _ref[0];
        endDate = _ref[1];
      }

      var inValidDatesWithinRange = disabledDates.filter(function (disabledDate) {
        return (0, _isWithinInterval2.default)(disabledDate, {
          start: startDate,
          end: endDate
        });
      });

      if (inValidDatesWithinRange.length > 0) {
        if (isStartDateSelected) {
          startDate = (0, _addDays2.default)((0, _max2.default)(inValidDatesWithinRange), 1);
        } else {
          endDate = (0, _addDays2.default)((0, _min2.default)(inValidDatesWithinRange), -1);
        }
      }

      if (!nextFocusRange) {
        var nextFocusRangeIndex = (0, _utils.findNextRangeIndex)(ranges, focusedRange[0]);
        nextFocusRange = [nextFocusRangeIndex, 0];
      }
      return {
        wasValid: !(inValidDatesWithinRange.length > 0),
        range: { startDate: startDate, endDate: endDate },
        nextFocusRange: nextFocusRange
      };
    }
  }, {
    key: 'setSelection',
    value: function setSelection(value, isSingleValue) {
      var _props2 = this.props,
          onChange = _props2.onChange,
          onRangeFocusChange = _props2.onRangeFocusChange;

      var ranges = this.state.infiniteRange;
      var focusedRange = this.props.focusedRange || this.state.focusedRange;
      var newSelection = this.calcNewSelection(value, isSingleValue);
      var infRange = void 0;
      if (focusedRange[1] === 0) {
        ranges.push(_extends({}, newSelection.range));
      } else if (focusedRange[1] === 1) {
        ranges[ranges.length - 1].endDate = newSelection.range.endDate;
        infRange = (0, _utils.concatRanges)(ranges, this.props.mergeRanges);

        this.setState({
          focusedRange: newSelection.nextFocusRange,
          preview: null,
          infiniteRange: [].concat(_toConsumableArray(infRange))
        });
        // infiniteRange: [...this.state.infiniteRange, newSelection.range]
        onChange(this.state.infiniteRange);
      }
      // newSelection.nextFocusRange = [0, 0];
      onRangeFocusChange && onRangeFocusChange(newSelection.nextFocusRange);
    }
  }, {
    key: 'handleRangeFocusChange',
    value: function handleRangeFocusChange(focusedRange) {
      this.setState({ focusedRange: focusedRange });
      this.props.onRangeFocusChange && this.props.onRangeFocusChange(focusedRange);
    }
  }, {
    key: 'updatePreview',
    value: function updatePreview(val) {
      if (!val) {
        this.setState({ preview: null });
        return;
      }
      var color = this.props.color;
      // const ranges = this.state.infiniteRange;
      // const focusedRange = this.props.focusedRange || this.state.focusedRange;
      // const previewColor = ranges[focusedRange[0]].color || color || rangeColors[focusedRange[0]];

      this.setState({ preview: _extends({}, val.range, { color: color }) });
    }
  }, {
    key: 'destroyRange',
    value: function destroyRange(date) {
      var onChange = this.props.onChange;

      var infiniteRange = this.state.infiniteRange;
      var filteredRanges = infiniteRange.filter(function (range) {
        return !((0, _getTime2.default)(range.startDate) <= (0, _getTime2.default)(date) && (0, _getTime2.default)(range.endDate) >= (0, _getTime2.default)(date));
      });
      // removeRange(infiniteRange);
      // console.log("filteredRanges:", filteredRanges);
      this.setState({ infiniteRange: [].concat(_toConsumableArray(filteredRanges)) });
      onChange(this.state.infiniteRange);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.ranges != this.props.ranges) {
        var infiniteRange = (0, _utils.concatRanges)(this.props.ranges, this.props.mergeRanges);
        this.setState({ infiniteRange: infiniteRange });
        // this.setState({
        //   infiniteRange: [...this.props.ranges]
        // })
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(_Calendar2.default, _extends({
        focusedRange: this.state.focusedRange,
        onRangeFocusChange: this.handleRangeFocusChange,
        preview: this.state.preview,
        onPreviewChange: function onPreviewChange(value) {
          _this2.updatePreview(value ? _this2.calcNewSelection(value) : null);
        }
      }, this.props, {
        ranges: this.state.infiniteRange,
        showDateDisplay: false,
        infiniteRange: this.state.infiniteRange,
        displayMode: 'dateRange',
        className: (0, _classnames2.default)(this.styles.dateRangeWrapper, this.props.className),
        onChange: this.setSelection,
        removeRange: this.destroyRange,
        isInfinite: true,
        updateRange: function updateRange(val) {
          return _this2.setSelection(val, false);
        },
        ref: function ref(target) {
          _this2.calendar = target;
        }
      }));
    }
  }]);

  return DateRangeMultiple;
}(_react.Component);

DateRangeMultiple.defaultProps = {
  classNames: {},
  ranges: [],
  moveRangeOnFirstSelection: false,
  rangeColors: ['#3d91ff', '#3ecf8e', '#fed14c'],
  color: "#3d91ff",
  disabledDates: [],
  isInfinite: false,
  infiniteRange: [],
  mergeRanges: false
};

DateRangeMultiple.propTypes = _extends({}, _Calendar2.default.propTypes, {
  onChange: _propTypes2.default.func,
  removeRange: _propTypes2.default.func,
  onRangeFocusChange: _propTypes2.default.func,
  className: _propTypes2.default.string,
  ranges: _propTypes2.default.arrayOf(_DayCell.rangeShape),
  moveRangeOnFirstSelection: _propTypes2.default.bool,
  isInfinite: _propTypes2.default.bool,
  infiniteRange: _propTypes2.default.array,
  mergeRanges: _propTypes2.default.bool
});

exports.default = DateRangeMultiple;