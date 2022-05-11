import { useRef, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ImageFill, PersonFill } from 'react-bootstrap-icons';
import Image from 'next/image';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';

import Input from '../Input';
import Button from '../Button';
import * as brandApi from '../../api/brands';
import ImageUpload from '../ImageUpload';

const BrandEditProfile = ({ brand }) => {
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
      toast.success('Profile saved');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      formikRef.current.setFieldError(error.error.key, error.error.message);
    }
  }, [isError]);

  const handleSubmit = values => {
    const formData = new FormData();
    for (const val in values) {
      if (val === 'fileAvatar') {
        continue;
      }
      if (val === 'avatar' && !values.fileAvatar) {
        continue;
      }
      if (val === 'avatar' && values.fileAvatar) {
        formData.append(val, values['fileAvatar']);
        continue;
      }
      formData.append(val, values[val]);
    }
    mutate(formData);
  };
  return (
    <div className='max-w-2xl mr-auto py-6 sm:p-6'>
      <Formik
        initialValues={{
          avatar: brand.avatar || '',
          name: brand.name || '',
          brandName: brand.brandName || '',
        }}
        validationSchema={Yup.object({
          avatar: Yup.string().required('Avatar is required'),
          name: Yup.string()
            .matches(/^[a-zA-Z0-9_ ]{3,50}$/, 'Please enter a valid name')
            .required('Name is required'),
          brandName: Yup.string().min(1).max(50).required('Brand name is required'),
        })}
        onSubmit={handleSubmit}
        validateOnMount
        innerRef={formikRef}
        initialErrors={{ name: true }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue }) => (
          <form
            onSubmit={handleSubmit}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSubmit(e);
              }
            }}
          >
            <div className='flex flex-col sm:flex-row items-center'>
              {!values.avatar ? (
                <div className='border border-gray-200 bg-gray-100 rounded-full min-w-[4rem] min-h-[4rem] p-4'>
                  <PersonFill className='text-gray-400 w-full h-full' />
                </div>
              ) : (
                <div className='min-w-[4rem] min-h-[4rem] relative'>
                  <Image className={`rounded-full`} src={values.avatar} alt='' objectFit='cover' layout='fill' />
                </div>
              )}
              <div className='sm:ml-4 relative'>
                <ImageUpload
                  name='avatar'
                  fileName='fileAvatar'
                  onBlur={handleBlur}
                  disabled={isLoading}
                  setFieldValue={setFieldValue}
                  aspect={1}
                />
                <div className='text-blue-500'>Change Profile Photo</div>
              </div>
            </div>
            <Input
              name='name'
              label='Name'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              disabled={isLoading}
              error={touched.name && errors.name}
              className='mt-6'
            />
            <Input
              name='brandName'
              label='Brand Name'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.brandName}
              disabled={isLoading}
              className='mt-6'
              error={touched.brandName && errors.brandName}
            />
            <Button
              type='submit'
              text='Save'
              loading={isLoading}
              disabled={Object.keys(errors).length}
              className='w-full sm:w-auto mt-10 px-6 py-3'
            />
          </form>
        )}
      </Formik>
    </div>
  );
};

export default BrandEditProfile;
