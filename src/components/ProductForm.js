import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ProductForm = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{
        productName: '',
        supplierID: '',
        categoryID: '',
        unit: '',
        price: ''
      }}
      validationSchema={Yup.object().shape({
        productName: Yup.string().required('Product Name is required'),
        supplierID: Yup.number().required('Supplier ID is required'),
        categoryID: Yup.number().required('Category ID is required'),
        unit: Yup.string().required('Unit is required'),
        price: Yup.number().required('Price is required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="productName">Product Name</label>
            <Field type="text" name="productName" />
            <ErrorMessage name="productName" component="div" />
          </div>
          <div>
            <label htmlFor="supplierID">Supplier ID</label>
            <Field type="number" name="supplierID" />
            <ErrorMessage name="supplierID" component="div" />
          </div>
          <div>
            <label htmlFor="categoryID">Category ID</label>
            <Field type="number" name="categoryID" />
            <ErrorMessage name="categoryID" component="div" />
          </div>
          <div>
            <label htmlFor="unit">Unit</label>
            <Field type="text" name="unit" />
            <ErrorMessage name="unit" component="div" />
          </div>
          <div>
            <label htmlFor="price">Price</label>
            <Field type="number" name="price" />
            <ErrorMessage name="price" component="div" />
          </div>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;
