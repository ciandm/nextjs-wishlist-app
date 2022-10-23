import { getLoginlayout } from 'components/layout/Layout';
import { NextPageWithLayout } from 'pages/_app';
import React from 'react';
import { RegisterForm } from 'src/register-form/RegisterForm';
import axios from 'axios';
import { UserResponse } from '@supabase/supabase-js';
import { BASE_URL } from 'src/config/server';

const Register: NextPageWithLayout = () => {
  return <RegisterForm />;
};

Register.getLayout = getLoginlayout({ title: 'Register' });

export default Register;

// export async function getServerSideProps() {
//   const user = await axios
//     .get<UserResponse>(`${BASE_URL}/api/get-user`)
//     .then((response) => response?.data?.data?.user);

//   if (user) {
//     return {
//       redirect: { destination: '/', permanent: false },
//     };
//   }

//   return { props: {} };
// }
