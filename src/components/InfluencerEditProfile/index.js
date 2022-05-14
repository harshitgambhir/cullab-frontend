import { useRef, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ImageFill, PersonFill } from 'react-bootstrap-icons';
import Image from 'next/image';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';

import Input from '../Input';
import Button from '../Button';
import * as influencerApi from '../../api/influencers';
import ImageUpload from '../ImageUpload';

const InfluencerEditProfile = ({ influencer }) => {
  const formikRef = useRef(null);

  const {
    mutate: mutate,
    isLoading: isLoading,
    isSuccess: isSuccess,
    isError: isError,
    error: error,
  } = useMutation('editProfile', influencerApi.editProfile);

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
      if (val === 'fileAvatar' || val === 'fileFeatured') {
        continue;
      }
      if (val === 'avatar' && !values.fileAvatar) {
        continue;
      }
      if (val === 'avatar' && values.fileAvatar) {
        formData.append('avatar', values['fileAvatar']);
        continue;
      }
      if (val === 'featured' && !values.fileFeatured) {
        continue;
      }
      if (val === 'featured' && values.fileFeatured) {
        formData.append('featured', values['fileFeatured']);
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
          avatar: influencer.avatar || '',
          featured: influencer.featured || '',
          name: influencer.name || '',
          username: influencer.username || '',
          bio: influencer.bio || '',
          gender: influencer.gender || '',
        }}
        validationSchema={Yup.object({
          avatar: Yup.string().required('Avatar is required'),
          featured: Yup.string().required('Featured is required'),
          name: Yup.string()
            .matches(/^[a-zA-Z0-9_ ]{3,50}$/, 'Please enter a valid name')
            .required('Name is required'),
          username: Yup.string()
            .matches(
              /^[a-zA-Z0-9_]{1,15}$/,
              'Username must be between 1 to 15 characters and contain only letters, numbers and underscores and no spaces'
            )
            .required('Username is required'),
          bio: Yup.string()
            .min(4, 'Bio must be greater than 4 characters')
            .max(150, 'Bio must not be greater than 150 characters')
            .required('Bio is required'),
          gender: Yup.string().oneOf(['male', 'female']).required('Gender is required'),
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
            <div className='flex flex-col sm:flex-row items-center mt-6'>
              {!values.featured ? (
                <div className='border border-gray-200 bg-gray-100 w-[209px] h-[279px] min-w-[209px] min-h-[279px] p-4 rounded-lg flex items-center justify-center'>
                  <ImageFill className='text-gray-400 w-10 h-10' />
                </div>
              ) : (
                <div className='min-w-[180px] min-h-[240px] relative'>
                  <Image className={`rounded-lg`} src={values.featured} alt='' objectFit='cover' layout='fill' />
                </div>
              )}
              <div className='sm:ml-4 relative'>
                <ImageUpload
                  name='featured'
                  fileName='fileFeatured'
                  onBlur={handleBlur}
                  disabled={isLoading}
                  setFieldValue={setFieldValue}
                  aspect={3 / 4}
                />
                <div className='text-blue-500'>Change Featured Photo</div>
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
              maxLength={50}
            />
            <Input
              name='username'
              label='Username'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              disabled={isLoading}
              className='mt-6'
              error={touched.username && errors.username}
              maxLength={15}
            />
            <Input
              name='bio'
              label='Bio'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.bio}
              disabled={isLoading}
              className='mt-6'
              error={touched.bio && errors.bio}
              minLength={4}
              maxLength={150}
              textarea
              rows={4}
            />
            <label className='block text-base text-gray-900 mb-2 font-semibold mt-6'>Gender</label>
            <label className='flex items-center cursor-pointer border border-gray-300 py-3 px-6 rounded-lg'>
              <input
                type='radio'
                name='gender'
                className='hidden peer'
                value='female'
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values.gender === 'female'}
              />
              <div className='border border-gray-300 hidden peer-checked:flex rounded-full h-6 w-6 items-center justify-center'>
                <div className='bg-gray-900 h-4 w-4 rounded-full' />
              </div>
              <div className='bg-white border border-gray-300 peer-checked:hidden rounded-full h-6 w-6' />
              <div className='ml-4'>Female</div>
            </label>
            <label className='flex items-center cursor-pointer border border-gray-300 py-3 px-6 rounded-lg mt-4'>
              <input
                type='radio'
                name='gender'
                className='hidden peer'
                value='male'
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values.gender === 'male'}
              />
              <div className='border border-gray-300 hidden peer-checked:flex rounded-full h-6 w-6 items-center justify-center'>
                <div className='bg-gray-900 h-4 w-4 rounded-full' />
              </div>
              <div className='bg-white border border-gray-300 peer-checked:hidden rounded-full h-6 w-6' />
              <div className='ml-4'>Male</div>
            </label>
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

export default InfluencerEditProfile;
