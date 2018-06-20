import React, { Component } from "react";
import { getPath, setPath, clone } from "./utils";
import Context from "./Context";
import Joi from "joi";

class Form extends Component {
  state = {
    initialValues: this.props.initialValues || {},
    values: this.props.initialValues || {},
    schema: this.props.schema || {}
  };

  componentDidMount() {
    const { formApi } = this.props;
    const { _internal, ...rest } = this.API;
    formApi && formApi(rest);
  }

  fields = {};
  touched = new Set();

  storeComponent = (name = "", ref) => (this.fields[name] = ref);

  updateComponent = (name = "") => this.fields[name].forceUpdate();

  getField = (name = "") => getPath(this.state.values, name);

  getFields = (names = [], path = "") => {
    if (names.length > 0) {
      return names.reduce((values, name) => {
        const fullPath = path ? `${path}.${name}` : name;
        setPath(values, fullPath, this.getField(fullPath));
        return values;
      }, {});
    }

    return this.state.values;
  };

  setField = (name = "", value = "") => {
    const values = clone(this.state.values);
    const currValue = getPath(values, name);

    return new Promise(resolve => {
      if (currValue !== value) {
        setPath(values, name, value);
        this.touched.add(name);

        this.setState({ values }, () => {
          this.updateComponent(name);
          resolve(value);
        });
      }
    });
  };

  setFields = (fields = {}) => {
    for (let path in fields) {
      this.setField(path, fields[path]);
    }
  };

  resetField = (name = "") => {
    this.setField(name, getPath(this.state.initialValues, name));
    this.touched.delete(name);
    this.updateComponent(name);
  };

  resetFields = (names = []) => {
    this.setState({ values: this.state.initialValues });
    [...this.touched].forEach(name => this.updateComponent(name));
    this.touched.clear();
  };

  _validate = (value, schema) =>
    Joi.validate(value, schema, {
      abortEarly: false
    }).error;

  validateField = (field, schema) => {
    if (typeof schema !== "undefined") {
      const err = this._validate(this.getField(field), schema);

      if (err !== null) {
        return err.details[0].message.replace("value", field);
      }
    }
  };

  validate = fields => {
    const errors = {};
    const error = this._validate(this.getFields(fields), this.state.schema);

    if (error !== null) {
      error.details.forEach(err =>
        setPath(errors, err.path.join("."), err.message)
      );
    }

    return errors;
  };

  API = {
    _internal: {
      storeComponent: this.storeComponent
    },
    values: () => this.getFields(),
    touched: () => [...this.touched],
    isTouched: name => this.touched.has(name),
    getField: this.getField,
    getFields: this.getFields,
    setField: this.setField,
    setFields: this.setFields,
    resetField: this.resetField,
    resetFields: this.resetFields,
    validateField: this.validateField,
    validate: this.validate
  };

  render() {
    return (
      <Context.Form.Provider value={this.API}>
        {this.props.children}
      </Context.Form.Provider>
    );
  }
}

export default Form;
