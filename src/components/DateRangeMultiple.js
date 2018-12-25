import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Calendar from './Calendar.js';
import { rangeShape } from './DayCell';
import { findNextRangeIndex, generateStyles, concatRanges } from '../utils.js';
import { isBefore, differenceInCalendarDays, addDays, min, isWithinInterval, max, getTime } from 'date-fns';
import classnames from 'classnames';
import coreStyles from '../styles';

class DateRangeMultiple extends Component {
  constructor(props, context) {
    super(props, context);
    this.setSelection = this.setSelection.bind(this);
    this.destroyRange = this.destroyRange.bind(this);
    this.handleRangeFocusChange = this.handleRangeFocusChange.bind(this);
    this.updatePreview = this.updatePreview.bind(this);
    this.calcNewSelection = this.calcNewSelection.bind(this);
    this.state = {
      focusedRange: props.initialFocusedRange || [findNextRangeIndex(props.ranges), 0],
      preview: null,
      isInfinite: props.isInfinite,
      infiniteRange: [...props.ranges]
    };
    this.styles = generateStyles([coreStyles, props.classNames]);
  }
  calcNewSelection(value, isSingleValue = true) {
    const focusedRange = this.props.focusedRange || this.state.focusedRange;
    const { onChange, maxDate, moveRangeOnFirstSelection, disabledDates } = this.props;
    // const focusedRangeIndex = focusedRange[0];
    const ranges = this.state.infiniteRange;
    const selectedRange = ranges[ranges.length - 1]
    // console.log("selectedRange", selectedRange);
    if (!selectedRange || !onChange) return {};

    // console.warn("this.state.infiniteRange", this.state.infiniteRange)
    // console.warn("ranges", ranges)
    
    let { startDate, endDate } = selectedRange;
    if (!endDate) endDate = new Date(startDate);
    let nextFocusRange;
    if (!isSingleValue) {
      startDate = value.startDate;
      endDate = value.endDate;
    } else if (focusedRange[1] === 0) {
      // startDate selection
      const dayOffset = differenceInCalendarDays(endDate, startDate);
      startDate = value;
      endDate = moveRangeOnFirstSelection ? addDays(value, dayOffset) : value;
      if (maxDate) endDate = min([endDate, maxDate]);
      nextFocusRange = [focusedRange[0], 1];
    } else {
      endDate = value;
    }

    // reverse dates if startDate before endDate
    let isStartDateSelected = focusedRange[1] === 0;
    if (isBefore(endDate, startDate)) {
      isStartDateSelected = !isStartDateSelected;
      [startDate, endDate] = [endDate, startDate];
    }

    const inValidDatesWithinRange = disabledDates.filter(disabledDate =>
      isWithinInterval(disabledDate, {
        start: startDate,
        end: endDate,
      })
    );

    if (inValidDatesWithinRange.length > 0) {
      if (isStartDateSelected) {
        startDate = addDays(max(inValidDatesWithinRange), 1);
      } else {
        endDate = addDays(min(inValidDatesWithinRange), -1);
      }
    }

    if (!nextFocusRange) {
      const nextFocusRangeIndex = findNextRangeIndex(ranges, focusedRange[0]);
      nextFocusRange = [nextFocusRangeIndex, 0];
    }
    return {
      wasValid: !(inValidDatesWithinRange.length > 0),
      range: { startDate, endDate },
      nextFocusRange: nextFocusRange,
    };
  }
  setSelection(value, isSingleValue) {
    const { onChange, onRangeFocusChange } = this.props;
    const ranges = this.state.infiniteRange;
    const focusedRange = this.props.focusedRange || this.state.focusedRange;
    const newSelection = this.calcNewSelection(value, isSingleValue);
    let infRange;
    if (focusedRange[1] === 0) {
      ranges.push({...newSelection.range});
    } else if (focusedRange[1] === 1) {
      ranges[ranges.length - 1].endDate = newSelection.range.endDate;
      infRange = concatRanges(ranges, this.props.mergeRanges);
      
          this.setState({
            focusedRange: newSelection.nextFocusRange,
            preview: null,
            infiniteRange: [...infRange]
          });
          // infiniteRange: [...this.state.infiniteRange, newSelection.range]
          onChange(this.state.infiniteRange);
    }
    // newSelection.nextFocusRange = [0, 0];
    onRangeFocusChange && onRangeFocusChange(newSelection.nextFocusRange);
  }
  handleRangeFocusChange(focusedRange) {
    this.setState({ focusedRange });
    this.props.onRangeFocusChange && this.props.onRangeFocusChange(focusedRange);
  }
  updatePreview(val) {
    if (!val) {
      this.setState({ preview: null });
      return;
    }
    const { color } = this.props;
    // const ranges = this.state.infiniteRange;
    // const focusedRange = this.props.focusedRange || this.state.focusedRange;
    // const previewColor = ranges[focusedRange[0]].color || color || rangeColors[focusedRange[0]];
    this.setState({ preview: { ...val.range, color } });
  }

  destroyRange(date) {
    const { onChange } = this.props;
    let infiniteRange = this.state.infiniteRange
    let filteredRanges = infiniteRange.filter((range) => {
      return !(getTime(range.startDate) <= getTime(date)
            && getTime(range.endDate) >= getTime(date));
    })
    // removeRange(infiniteRange);
    // console.log("filteredRanges:", filteredRanges);
    this.setState({infiniteRange: [...filteredRanges] });
    onChange(this.state.infiniteRange);
  }

  render() {
    return (
      <Calendar
        focusedRange={this.state.focusedRange}
        onRangeFocusChange={this.handleRangeFocusChange}
        preview={this.state.preview}
        onPreviewChange={value => {
          this.updatePreview(value ? this.calcNewSelection(value) : null);
        }}
        {...this.props}
        ranges={this.state.infiniteRange}
        showDateDisplay={false}
        infiniteRange={this.state.infiniteRange}
        displayMode="dateRange"
        className={classnames(this.styles.dateRangeWrapper, this.props.className)}
        onChange={this.setSelection}
        removeRange={this.destroyRange}
        isInfinite={true}
        updateRange={val => this.setSelection(val, false)}
        ref={target => {
          this.calendar = target;
        }}
      />
    );
  }
}

DateRangeMultiple.defaultProps = {
  classNames: {},
  ranges: [],
  moveRangeOnFirstSelection: false,
  rangeColors: ['#3d91ff', '#3ecf8e', '#fed14c'],
  color: "#3d91ff",
  disabledDates: [],
  isInfinite: false,
  infiniteRange: [],
  mergeRanges: false,
};

DateRangeMultiple.propTypes = {
  ...Calendar.propTypes,
  onChange: PropTypes.func,
  removeRange: PropTypes.func,
  onRangeFocusChange: PropTypes.func,
  className: PropTypes.string,
  ranges: PropTypes.arrayOf(rangeShape),
  moveRangeOnFirstSelection: PropTypes.bool,
  isInfinite: PropTypes.bool,
  infiniteRange: PropTypes.array,
  mergeRanges: PropTypes.bool,
};

export default DateRangeMultiple;
