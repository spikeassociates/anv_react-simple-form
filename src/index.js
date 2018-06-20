import React, { Component } from "react";
import { render } from "react-dom";
import Form from "./SimpleForm/Form";
import Field from "./SimpleForm/Field";
import schema from "./schema";
import Joi from "joi";

const initialValues = {
  person0: { email: "bob@mail.com" }
};

const Input = ({ value = "", touched, onChange, error, ...rest }) => (
  <div>
    <span>{touched ? error : ""}</span>
    <input {...rest} value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

class App extends Component {
  render() {
    return (
      <Form
        schema={schema}
        initialValues={initialValues}
        formApi={formApi => (this.formApi = formApi)}
      >
        <Field
          type="text"
          name="name"
          render={Input}
          onChange={value => this.formApi.setField("testName", value)}
        />

        <Field type="text" name="surname" render={Input} />

        <Field
          type="text"
          name="testName"
          render={Input}
          validate={Joi.string()
            .min(3)
            .required()}
        />

        <Field type="text" name="person0.name" render={Input} />

        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {[...Array(50).keys()].map(i => (
            <Field
              key={i}
              type="text"
              name={`person${i}.email`}
              render={Input}
            />
          ))}
        </div>

        <div
          onClick={() => {
            console.log(this.formApi.getFields());
            console.log(this.formApi.touched());
          }}
        >
          Submit
        </div>

        <div onClick={() => console.log(this.formApi.validate())}>Validate</div>
        <div onClick={() => this.formApi.resetFields()}>Reset</div>
      </Form>
    );
  }
}

render(<App />, document.getElementById("root"));
