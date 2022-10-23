import { getLoginlayout } from 'components/layout/Layout';
import { NextPageWithLayout } from 'pages/_app';
import React from 'react';
import { RegisterForm } from 'src/register-form/RegisterForm';

const Register: NextPageWithLayout = () => {
  return <RegisterForm />;
};

Register.getLayout = getLoginlayout({ title: 'Register' });

export default Register;
