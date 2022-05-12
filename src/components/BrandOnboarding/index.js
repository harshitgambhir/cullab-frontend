import { useEffect, useRef, Fragment } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import Image from 'next/image';

import { useRouter } from 'next/router';
import Input from '../Input';
import Button from '../Button';
import * as brandApi from '../../api/brands';
import { ImageFill } from 'react-bootstrap-icons';
import ImageUpload from '../ImageUpload';

const BrandOnboarding = ({ step, brand }) => {
  const router = useRouter();
  const formikRef = useRef(null);

  const {
    mutate: mutate,
    isLoading: isLoading,
    isSuccess: isSuccess,
    isError: isError,
    error: error,
  } = useMutation('editProfile', brandApi.editProfile);

  useEffect(() => {
    if (isSuccess) {
      if (parseInt(step) < 3) {
        router.push(`/onboard?s=${parseInt(step) + 1}`);
      } else {
        router.reload();
      }
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      formikRef.current.setFieldError(error.error.key, error.error.message);
    }
  }, [isError]);

  const handleSubmit = values => {
    const formData = new FormData();
    if (parseInt(step) === 3) {
      formData.append('avatar', values['fileAvatar']);
    } else {
      for (const val in values) {
        formData.append(val, values[val]);
      }
    }
    mutate(formData);
  };

  const renderForms = () => {
    if (parseInt(step) === 1) {
      return (
        <Formik
          key={parseInt(step)}
          initialValues={{
            name: brand.name || '',
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .matches(/^[a-zA-Z0-9_ ]{3,50}$/, 'Please enter a valid name')
              .required('Name is required'),
          })}
          onSubmit={handleSubmit}
          validateOnMount
          innerRef={formikRef}
          initialErrors={{ name: true }}
        >
          {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
            <form
              onSubmit={handleSubmit}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
              className='mt-8'
            >
              <p className='text-3xl font-semibold mb-8'>{`What's your name?`}</p>
              <Input
                name='name'
                placeholder='Name'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                disabled={isLoading}
                className='mt-4'
                error={touched.name && errors.name}
                autoFocus
                maxLength={50}
              />
              <Button
                type='submit'
                text='Next'
                loading={isLoading}
                disabled={Object.keys(errors).length}
                className='w-full mt-6 ml-auto px-6 py-3'
              />
            </form>
          )}
        </Formik>
      );
    } else if (parseInt(step) === 2) {
      return (
        <Formik
          key={parseInt(step)}
          initialValues={{
            brandName: brand.brandName || '',
          }}
          validationSchema={Yup.object({
            brandName: Yup.string().min(1).max(50).required('Brand name is required'),
          })}
          onSubmit={handleSubmit}
          validateOnMount
          innerRef={formikRef}
          initialErrors={{ brandName: true }}
        >
          {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
            <form
              onSubmit={handleSubmit}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
              className='mt-8'
            >
              <p className='text-3xl font-semibold mb-8'>{`What's your Brand Name?`}</p>
              <Input
                name='brandName'
                placeholder='Brand Name'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.brandName}
                disabled={isLoading}
                className='mt-4'
                error={touched.brandName && errors.brandName}
                autoFocus
                maxLength={50}
              />
              <Button
                type='submit'
                text='Next'
                loading={isLoading}
                disabled={Object.keys(errors).length}
                className='w-full mt-6 ml-auto px-6 py-3'
              />
            </form>
          )}
        </Formik>
      );
    } else if (parseInt(step) === 3) {
      return (
        <Formik
          key={parseInt(step)}
          initialValues={{
            avatar: brand.avatar || '',
          }}
          validationSchema={Yup.object({
            avatar: Yup.string().required('Avatar is required'),
          })}
          onSubmit={handleSubmit}
          validateOnMount
          innerRef={formikRef}
          initialErrors={{ avatar: true }}
        >
          {({ values, handleChange, handleBlur, handleSubmit, errors, setFieldValue, touched }) => (
            <form
              onSubmit={handleSubmit}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
              className='mt-8'
            >
              <p className='text-3xl font-semibold mb-8'>Add your brand picture</p>
              <div className='relative border-2 border-dashed hover:bg-gray-200 border-gray-400 rounded-full h-32 w-32 mx-auto flex items-center justify-center'>
                {values.avatar ? (
                  <Image
                    className={`rounded-full`}
                    width={120}
                    height={120}
                    src={values.avatar}
                    alt=''
                    objectFit='cover'
                  />
                ) : (
                  <ImageFill className='text-gray-400 h-10 w-10' />
                )}
                <ImageUpload
                  name='avatar'
                  fileName='fileAvatar'
                  onBlur={handleBlur}
                  disabled={isLoading}
                  setFieldValue={setFieldValue}
                  aspect={1}
                />
              </div>
              <Button
                type='submit'
                text='Next'
                loading={isLoading}
                disabled={Object.keys(errors).length}
                className='w-full mt-10 ml-auto px-6 py-3'
              />
            </form>
          )}
        </Formik>
      );
    }
  };

  return <div className={`w-[90%] max-w-lg mx-auto`}>{renderForms()}</div>;
};

export default BrandOnboarding;
