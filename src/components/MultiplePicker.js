import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateRangeMultiple from './DateRangeMultiple';
import DefinedRange from './DefinedRange';
import { findNextRangeIndex, generateStyles } from '../utils.js';
import classnames from 'classnames';
import coreStyles from '../styles';

class MultiplePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedRange: [findNextRangeIndex(props.ranges), 0],
    };
    this.styles = generateStyles([coreStyles, props.classNames]);
  }
  render() {
    const { focusedRange } = this.state;
    return (
      <div className={classnames(this.styles.dateRangePickerWrapper, this.props.className)}>
        <DefinedRange
          focusedRange={focusedRange}
          onPreviewChange={value => this.dateRange.updatePreview(value)}
          {...this.props}
          range={this.props.ranges[focusedRange[0]]}
          className={undefined}
        />
        <DateRangeMultiple
          onRangeFocusChange={focusedRange => this.setState({ focusedRange })}
          focusedRange={focusedRange}
          {...this.props}
          ref={t => (this.dateRange = t)}
          className={undefined}
        />
      </div>
    );
  }
}

MultiplePicker.defaultProps = {};

MultiplePicker.propTypes = {
  ...DateRangeMultiple.propTypes,
  ...DefinedRange.propTypes,
  className: PropTypes.string,
};

export default MultiplePicker;
