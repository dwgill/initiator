import React, { PureComponent } from "react";
import styles from "./NumberField.module.scss";
import PropTypes from "prop-types";
import computeDynamicNumber from "../../../logic/computeDynamicNumber";
import AutosizeInput from "react-input-autosize";
import cls from "classnames";
import delay from "lodash/fp/delay";
import { flashDurationMilliseconds } from "../../../logic/flashDuration";
import existy from "../../../logic/existy";

class NumberField extends PureComponent {
  static propTypes = {
    value: PropTypes.number,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      hasFocus: false,
      value: "",
      isFlashing: false
    };

    this.inputRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    const { value } = props;
    if (!state.hasFocus) {
      return {
        value: !value && value !== 0 ? "" : String(value)
      };
    }

    return null;
  }

  flash() {
    this.setState({ isFlashing: true }, () => {
      delay(flashDurationMilliseconds, () =>
        this.setState({ isFlashing: false })
      );
    });
  }

  handleFocus = (event, shouldSelect = true) => {
    if (!this.state.hasFocus) {
      this.setState({ hasFocus: true });
      if (this.inputRef.current) {
        this.inputRef.current.focus();
        if (shouldSelect) {
          this.inputRef.current.select();
        }
      }
    }
  };

  handleBlur = event => {
    this.setState({ hasFocus: false });
    const { onChange, value: propsValue } = this.props;
    const { value } = this.state;
    if (String(propsValue || "") === value || !onChange) {
      return;
    }

    if (!existy(value)) {
      onChange(null);
      return;
    }

    if (value === '') {
      onChange('');
      return;
    }

    try {
      const [newValue, wasDynamic] = computeDynamicNumber(propsValue, value);
      onChange(newValue);
      if (wasDynamic) {
        this.flash();
      }
    } catch (e) {}
  };

  handleChange = event => {
    if (!this.state.hasFocus) {
      this.handleFocus(event, false);
    }

    const newValue = event.target.value;

    this.setState({ value: !newValue ? "" : String(newValue) });
  };

  handleKeyDown = event => {
    if (event.key === "Enter") {
      this.handleBlur(event);
    }
  };

  render() {
    const { value, hasFocus, isFlashing } = this.state;
    const { label, className } = this.props;
    const placeholder = hasFocus ? "" : "N/A";
    return (
      <span
        className={cls(styles.field, className, { [styles.flash]: isFlashing })}
        onClick={this.handleFocus}
      >
        <label className={styles.label}>
          {label}
          <AutosizeInput
            inputClassName={styles.fieldInput}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onKeyDown={this.handleKeyDown}
            placeholder={placeholder}
            ref={this.inputRef}
            value={value}
          />
        </label>
      </span>
    );
  }
}

export default NumberField;
