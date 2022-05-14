import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from 'react-query';
import OtpInput from 'react-otp-input';
import Head from 'next/head';

import { withAuth, withProfile } from '../../lib';
import { useRouter } from 'next/router';
import Input from '../../components/Input';
import Button from '../../components/Button';
import * as brandApi from '../../api/brands';
import Header from '../../components/Header';
import { initPusher } from '../../utils';

const validationSchemaEmail = Yup.object({
  email: Yup.string().email('Please enter a valid email').required('Email is required'),
});

const validationSchemaOtp = Yup.object({
  otp: Yup.string().min(6, '').max(6, '').required(''),
});

export default function Login({ influencer }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const {
    mutate: mutateSendOtp,
    isLoading: isLoadingSendOtp,
    isSuccess: isSuccessSendOtp,
    isError: isErrorSendOtp,
    error: errorSendOtp,
  } = useMutation('sendOtp', brandApi.sendOtp);
  const {
    mutate: mutateLogin,
    isLoading: isLoadingLogin,
    isSuccess: isSuccessLogin,
    isError: isErrorLogin,
    error: errorLogin,
    data: dataLogin,
  } = useMutation('login', brandApi.login);
  const formikRefEmail = useRef(null);
  const formikRefOtp = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccessSendOtp) {
      setShowOtp(true);
    }
  }, [isSuccessSendOtp]);

  useEffect(() => {
    if (isSuccessLogin) {
      const redirect = router.query.redirect;
      if (redirect) {
        return router.push(redirect);
      }
      initPusher(queryClient);
      if (dataLogin.step === 4) {
        router.push('/');
      } else {
        router.push('/onboard');
      }
    }
  }, [isSuccessLogin]);

  useEffect(() => {
    if (isErrorSendOtp) {
      formikRefEmail.current.setFieldError(errorSendOtp.error.key, errorSendOtp.error.message);
    }
  }, [isErrorSendOtp]);

  useEffect(() => {
    if (isErrorLogin) {
      formikRefOtp.current.setFieldError(errorLogin.error.key, errorLogin.error.message);
    }
  }, [isErrorLogin]);

  const handleSubmitEmail = values => {
    setEmail(values.email);
    mutateSendOtp(values);
  };

  const handleSubmitOtp = values => {
    mutateLogin({
      email,
      ...values,
    });
  };

  return (
    <>
      <Head>
        <title>Cullab | Brand Login</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@usecullab' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={`Cullab | Brand Login`} />
        <meta property='og:site_name' content='Cullab' />
        <meta property='og:image' content='images/logo.png' />
      </Head>
      <Header user={influencer} />
      <div className='content'>
        <div className='w-full max-w-sm min-h-full flex flex-col items-center mx-auto p-6 sm:px-0 sm:py-16 mt-8'>
          <div className='w-full m-auto'>
            <p className='text-3xl font-medium'>
              Continue as <span className='text-3xl font-bold'>Brand</span>
            </p>
            {!showOtp ? (
              <Formik
                initialValues={{
                  email: '',
                }}
                validationSchema={validationSchemaEmail}
                onSubmit={handleSubmitEmail}
                validateOnMount
                innerRef={formikRefEmail}
                initialErrors={{ email: true }}
              >
                {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
                  <form
                    onSubmit={handleSubmit}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleSubmit(e);
                      }
                    }}
                    className='mt-12'
                  >
                    <Input
                      type='email'
                      name='email'
                      placeholder='Email'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      disabled={isLoadingSendOtp}
                      className='mt-4'
                      error={touched.email && errors.email}
                      autoFocus
                    />
                    <Button
                      type='submit'
                      text='Next'
                      loading={isLoadingSendOtp}
                      disabled={Object.keys(errors).length}
                      className='w-full mt-6 ml-auto px-6 py-3'
                    />
                  </form>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={{
                  otp: '',
                }}
                validationSchema={validationSchemaOtp}
                onSubmit={handleSubmitOtp}
                innerRef={formikRefOtp}
                initialErrors={{ otp: true }}
              >
                {({ values, handleChange, handleSubmit, errors, touched }) => (
                  <form
                    onSubmit={handleSubmit}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleSubmit(e);
                      }
                    }}
                    className='mt-12'
                  >
                    <div className='text-sm'>{`We've sent a verification code on ${email} to proceed`}</div>
                    <OtpInput
                      value={values.otp}
                      onChange={val => {
                        handleChange('otp')(val);
                        if (val.length === 6) {
                          handleSubmitOtp({
                            otp: val,
                          });
                        }
                      }}
                      numInputs={6}
                      shouldAutoFocus
                      className={`otp-input ${errors.otp ? 'error' : ''} mt-6`}
                      containerStyle={{
                        justifyContent: 'space-between',
                      }}
                      isInputNum
                    />
                    {errors.otp && <div className='text-red-600 text-sm mt-2'>{errors.otp}</div>}
                    <Button
                      type='submit'
                      text='Login'
                      loading={isLoadingLogin}
                      disabled={values.otp?.length !== 6 || Object.keys(errors).length}
                      className='w-full mt-8 ml-auto px-6 py-3'
                    />
                  </form>
                )}
              </Formik>
            )}
          </div>
          <div className='w-full max-w-medium text-center mt-6 mx-auto px-4 pt-21 sm:px-0'>
            <p className='text-gray-500 text-sm font-medium'>
              By continuing, you agree to Cullab’s <br />
              <Link href='/terms'>
                <a className='font-medium text-gray-600'>Terms &amp; Conditions</a>
              </Link>
              ,{' '}
              <Link href='/privacy'>
                <a className='font-medium text-gray-600'>Privacy Policy</a>
              </Link>{' '}
              and{' '}
              <Link href='/refund'>
                <a className='font-medium text-gray-600'>Refund or Cancellation Policy</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withProfile(async function (ctx) {
  const { req } = ctx;
  if (req.session.brand) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {
      influencer: req.session.influencer,
    },
  };
});
