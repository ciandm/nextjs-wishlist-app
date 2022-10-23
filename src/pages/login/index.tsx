import React from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { LoginForm } from 'components/login-form/LoginForm';
import { getLoginlayout } from 'components/layout/Layout';
import { BASE_URL } from 'src/config/server';
import { UserResponse } from '@supabase/supabase-js';
import axios from 'axios';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';

const Login: NextPageWithLayout = () => {
  return <LoginForm />;
};

export default Login;

Login.getLayout = getLoginlayout({ title: 'Log in' });
