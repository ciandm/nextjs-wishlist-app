import React from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { LoginForm } from 'components/login-form/LoginForm';
import { getLoginlayout } from 'components/layout/Layout';

const Login: NextPageWithLayout = () => {
  return <LoginForm />;
};

export default Login;

Login.getLayout = getLoginlayout({ title: 'Log in' });
