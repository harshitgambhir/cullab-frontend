import { useEffect, useRef, Fragment } from 'react';
import Link from 'next/link';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import Image from 'next/image';
import { Listbox, Transition } from '@headlessui/react';

import { useRouter } from 'next/router';
import Input from '../Input';
import Button from '../Button';
import * as influencerApi from '../../api/influencers';
import { ChevronDown, ImageFill, X } from 'react-bootstrap-icons';
import { capitalize } from '../../utils';
import ImageUpload from '../ImageUpload';

const InfluencerOnboarding = ({ step, influencer, platforms, followers, categories }) => {
  const router = useRouter();
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
      if (parseInt(step) < 10) {
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
      if (influencer.avatar && !values['fileAvatar']) {
        router.push(`/onboard?s=${parseInt(step) + 1}`);
        return;
      }
      formData.append('avatar', values['fileAvatar']);
    } else if (parseInt(step) === 4) {
      if (influencer.featured && !values['fileFeatured']) {
        router.push(`/onboard?s=${parseInt(step) + 1}`);
        return;
      }
      formData.append('featured', values['fileFeatured']);
    } else if (parseInt(step) >= 7) {
      for (const val in values) {
        formData.append(val, JSON.stringify(values[val]));
      }
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
            name: influencer.name || '',
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
            username: influencer.username || '',
          }}
          validationSchema={Yup.object({
            username: Yup.string()
              .matches(
                /^[a-zA-Z0-9_]{1,15}$/,
                'Username must be between 1 to 15 characters and contain only letters, numbers and underscores and no spaces'
              )
              .required('Username is required'),
          })}
          onSubmit={handleSubmit}
          validateOnMount
          innerRef={formikRef}
          initialErrors={{ username: true }}
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
              <p className='text-3xl font-semibold mb-8'>Pick your username</p>
              <Input
                name='username'
                placeholder='Username'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                disabled={isLoading}
                className='mt-4'
                error={touched.username && errors.username}
                autoFocus
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
            avatar: influencer.avatar || '',
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
              <p className='text-3xl font-semibold mb-8'>Pick your profile photo</p>
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
    } else if (parseInt(step) === 4) {
      return (
        <Formik
          key={parseInt(step)}
          initialValues={{
            featured: influencer.featured || '',
          }}
          validationSchema={Yup.object({
            featured: Yup.string().required('Featured is required'),
          })}
          onSubmit={handleSubmit}
          validateOnMount
          innerRef={formikRef}
          initialErrors={{ featured: true }}
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
              <p className='text-3xl font-semibold mb-8'>Pick your featured photo</p>
              <div className='relative border-2 border-dashed hover:bg-gray-200 border-gray-400 rounded-lg h-[18rem] w-64 mx-auto flex items-center justify-center'>
                {values.featured ? (
                  <Image className={`rounded-lg`} src={values.featured} alt='' objectFit='cover' layout='fill' />
                ) : (
                  <ImageFill className='text-gray-400 h-10 w-10' />
                )}
                <ImageUpload
                  name='featured'
                  fileName='fileFeatured'
                  onBlur={handleBlur}
                  disabled={isLoading}
                  setFieldValue={setFieldValue}
                  aspect={3 / 4}
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
    } else if (parseInt(step) === 5) {
      return (
        <Formik
          key={parseInt(step)}
          initialValues={{
            bio: influencer.bio || '',
          }}
          validationSchema={Yup.object({
            bio: Yup.string()
              .min(4, 'Bio must be greater than 4 characters')
              .max(150, 'Bio must not be greater than 150 characters')
              .required('Bio is required'),
          })}
          onSubmit={handleSubmit}
          validateOnMount
          innerRef={formikRef}
          initialErrors={{ bio: true }}
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
              <p className='text-3xl font-semibold mb-8'>Describe yourself and your content</p>
              <Input
                name='bio'
                placeholder='Who are you and what type of content do you create?'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.bio}
                disabled={isLoading}
                className='mt-4'
                error={touched.bio && errors.bio}
                autoFocus
                minLength={4}
                maxLength={150}
                textarea
                rows={4}
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
    } else if (parseInt(step) === 6) {
      return (
        <Formik
          key={parseInt(step)}
          initialValues={{
            gender: influencer.gender || '',
          }}
          validationSchema={Yup.object({
            gender: Yup.string().oneOf(['male', 'female']).required('Gender is required'),
          })}
          onSubmit={handleSubmit}
          validateOnMount
          innerRef={formikRef}
          initialErrors={{ gender: true }}
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
              <p className='text-3xl font-semibold mb-8'>{`What's your gender?`}</p>
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
                text='Next'
                loading={isLoading}
                disabled={Object.keys(errors).length}
                className='w-full mt-6 ml-auto px-6 py-3'
              />
            </form>
          )}
        </Formik>
      );
    } else if (parseInt(step) === 7) {
      return (
        <Formik
          key={parseInt(step)}
          initialValues={{
            platforms: influencer.platforms || [],
          }}
          validationSchema={Yup.object({
            platforms: Yup.array()
              .of(
                Yup.object().shape({
                  id: Yup.string().required(),
                  username: Yup.string().required(),
                  followerId: Yup.string().required(),
                })
              )
              .min(1),
          })}
          onSubmit={handleSubmit}
          validateOnMount
          innerRef={formikRef}
          initialErrors={{ platforms: true }}
        >
          {({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue }) => (
            <form
              onSubmit={handleSubmit}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
              className='mt-8'
            >
              <p className='text-3xl font-semibold mb-8'>Add your social channels</p>
              {platforms.map((platform, i) => {
                return (
                  <div key={platform} className='flex mt-4'>
                    <Input
                      name='username'
                      placeholder={`${capitalize(platform)} Username`}
                      onChange={e => {
                        setFieldValue(
                          'platforms',
                          values.platforms[i]
                            ? values.platforms.map((_platform, index) => {
                                if (index === i) {
                                  return {
                                    ..._platform,
                                    username: e.target.value,
                                  };
                                }
                                return _platform;
                              })
                            : [
                                {
                                  id: platform,
                                  username: '',
                                  username: e.target.value,
                                },
                              ]
                        );
                      }}
                      onBlur={handleBlur}
                      value={values.platforms?.[i]?.username}
                      disabled={isLoading}
                      error={touched.platforms?.[i]?.username && errors.platforms?.[i]?.username}
                      autoFocus
                      maxLength={30}
                      className='w-full'
                    />
                    <Listbox
                      value={values.platforms?.[i]?.followerId}
                      onChange={value => {
                        setFieldValue(
                          'platforms',
                          values.platforms[i]
                            ? values.platforms.map((_platform, index) => {
                                if (index === i) {
                                  return {
                                    ..._platform,
                                    followerId: value,
                                  };
                                }
                                return _platform;
                              })
                            : [
                                {
                                  id: platform,
                                  username: '',
                                  followerId: value,
                                },
                              ]
                        );
                      }}
                    >
                      <div className='relative ml-4 w-full'>
                        <Listbox.Button className='relative w-full py-3 pl-3 pr-10 text-left text-sm bg-white cursor-pointer border border-gray-300 rounded-md'>
                          <span className='block truncate'>
                            {values.platforms?.[i]?.followerId || 'Select Followers'}
                          </span>
                          <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                            <ChevronDown />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave='transition ease-in duration-100'
                          leaveFrom='opacity-100'
                          leaveTo='opacity-0'
                        >
                          <Listbox.Options className='absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                            {followers.map(follower => (
                              <Listbox.Option
                                className={({ active }) =>
                                  `cursor-pointer select-none relative py-2 px-6 hover:bg-gray-100 ${
                                    active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'
                                  }`
                                }
                                key={follower}
                                value={follower}
                              >
                                {follower}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>
                );
              })}
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
    } else if (parseInt(step) === 8) {
      return (
        <Formik
          key={parseInt(step)}
          initialValues={{
            categories: influencer.categories || [],
          }}
          validationSchema={Yup.object({
            categories: Yup.array()
              .of(
                Yup.object().shape({
                  id: Yup.string().required(),
                })
              )
              .min(1),
          })}
          onSubmit={handleSubmit}
          validateOnMount
          innerRef={formikRef}
          initialErrors={{ categories: true }}
        >
          {({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue }) => (
            <form
              onSubmit={handleSubmit}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
              className='mt-8'
            >
              <p className='text-3xl font-semibold mb-8'>Select the niches that match your content</p>
              <div className='grid grid-cols-2 gap-4 max-h-96 overflow-y-scroll'>
                {categories.map((category, i) => {
                  return (
                    <div key={category} className='w-full'>
                      <label className='flex items-center justify-center cursor-pointer'>
                        <input
                          type='checkbox'
                          name='category'
                          className='hidden peer'
                          onChange={e => {
                            if (e.target.checked) {
                              return setFieldValue(
                                'categories',
                                values.categories.length
                                  ? [
                                      ...values.categories,
                                      {
                                        id: category,
                                      },
                                    ]
                                  : [
                                      {
                                        id: category,
                                      },
                                    ]
                              );
                            }
                            setFieldValue(
                              'categories',
                              values.categories.filter(cat => cat.id !== category)
                            );
                          }}
                          onBlur={handleBlur}
                          checked={values.categories.find(cat => cat.id === category)}
                        />
                        <div className='h-full w-full border border-gray-300 py-3 px-6 rounded-lg capitalize text-center text-sm peer-checked:text-white peer-checked:bg-gray-900'>
                          {category}
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
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
    } else if (parseInt(step) === 9) {
      return (
        <Formik
          key={parseInt(step)}
          initialValues={{
            packages: influencer.packages.length
              ? influencer.packages
              : [
                  {
                    platformId: 'instagram',
                    title: '',
                    description: '',
                    price: '',
                  },
                ],
          }}
          validationSchema={Yup.object({
            packages: Yup.array()
              .of(
                Yup.object().shape({
                  platformId: Yup.string().required(),
                  title: Yup.string().required('Title is required'),
                  description: Yup.string().required('Description is required'),
                  price: Yup.string()
                    .test(
                      'price',
                      'Price must be greater than 10 and less than 50,001',
                      value => parseInt(value) > 9 && parseInt(value) <= 50000
                    )
                    .required(),
                })
              )
              .min(1),
          })}
          onSubmit={handleSubmit}
          validateOnMount
          innerRef={formikRef}
          initialErrors={{ packages: true }}
        >
          {({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue }) => (
            <form
              onSubmit={handleSubmit}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
              className='mt-8'
            >
              <p className='text-3xl font-semibold mb-8'>Add your packages</p>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4'>
                {values.packages.map((_package, i) => {
                  return (
                    <div key={i} className='shadow-lg rounded-lg p-4'>
                      <div className='flex items-center justify-between'>
                        <div className='font-semibold'>Package {i + 1}</div>
                        {values.packages.length > 1 && (
                          <X
                            height={32}
                            width={32}
                            onClick={() => {
                              setFieldValue(
                                'packages',
                                values.packages.filter((__package, index) => index !== i)
                              );
                            }}
                            className='cursor-pointer'
                          />
                        )}
                      </div>
                      <Listbox
                        value={_package.platformId}
                        onChange={value => {
                          setFieldValue(
                            'packages',
                            values.packages.map((__package, index) => {
                              if (index === i) {
                                return {
                                  ...__package,
                                  platformId: value,
                                };
                              }
                              return __package;
                            })
                          );
                        }}
                      >
                        <div className='relative w-full mt-4'>
                          <Listbox.Button className='relative w-full py-3 pl-3 pr-10 text-left text-sm bg-white cursor-pointer border border-gray-300 rounded-md'>
                            <span className='block truncate'>
                              {capitalize(_package.platformId) || 'Select Platform'}
                            </span>
                            <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                              <ChevronDown />
                            </span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave='transition ease-in duration-100'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                          >
                            <Listbox.Options className='absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                              {influencer.platforms.map(platform => (
                                <Listbox.Option
                                  className={({ active }) =>
                                    `cursor-pointer select-none relative py-2 px-6 hover:bg-gray-100 ${
                                      active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'
                                    }`
                                  }
                                  key={platform.id}
                                  value={platform.id}
                                >
                                  {capitalize(platform.id)}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                      <Input
                        name='title'
                        placeholder={'What is this package offering?'}
                        onChange={e => {
                          setFieldValue(
                            'packages',
                            values.packages.map((__package, index) => {
                              if (index === i) {
                                return {
                                  ...__package,
                                  title: e.target.value,
                                };
                              }
                              return __package;
                            })
                          );
                        }}
                        onBlur={handleBlur}
                        value={_package.title}
                        disabled={isLoading}
                        error={touched.title && errors.packages?.[i]?.title}
                        maxLength={150}
                        className='w-full mt-4'
                      />
                      <Input
                        name='description'
                        placeholder={'What is included in this package?'}
                        onChange={e => {
                          setFieldValue(
                            'packages',
                            values.packages.map((__package, index) => {
                              if (index === i) {
                                return {
                                  ...__package,
                                  description: e.target.value,
                                };
                              }
                              return __package;
                            })
                          );
                        }}
                        onBlur={handleBlur}
                        value={_package.description}
                        disabled={isLoading}
                        error={touched.description && errors.packages?.[i]?.description}
                        maxLength={250}
                        textarea
                        rows={4}
                        className='w-full mt-4'
                      />
                      <Input
                        name='price'
                        type='number'
                        placeholder={'Price'}
                        onChange={e => {
                          setFieldValue(
                            'packages',
                            values.packages.map((__package, index) => {
                              if (index === i) {
                                return {
                                  ...__package,
                                  price: e.target.value,
                                };
                              }
                              return __package;
                            })
                          );
                        }}
                        onBlur={handleBlur}
                        value={_package.price ? parseInt(_package.price).toString() : ''}
                        disabled={isLoading}
                        error={touched.price && errors.packages?.[i]?.price}
                        className='w-full mt-4'
                      />
                      <div className='flex items-center justify-end mt-2'>
                        <div className='text-gray-500 text-xs'>Cullab takes a 20% fee</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {values.packages.length < 3 ? (
                <div className='flex items-center justify-end'>
                  <div
                    onClick={() => {
                      setFieldValue('packages', [
                        ...values.packages,
                        {
                          platformId: 'instagram',
                          title: '',
                          description: '',
                          price: '',
                        },
                      ]);
                    }}
                    className='cursor-pointer mt-4'
                  >
                    + Add Another Package
                  </div>
                </div>
              ) : null}
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
    } else if (parseInt(step) === 10) {
      return (
        <Formik
          key={parseInt(step)}
          initialValues={{
            bank: {
              accountHolder: '',
              accountNumber: '',
              ifsc: '',
            },
          }}
          validationSchema={Yup.object().shape({
            bank: Yup.object().shape({
              accountHolder: Yup.string()
                .matches(/^[a-zA-Z0-9 ’\-_\/().]{3,120}.*([a-zA-Z0-9]|\.)$/, 'Please enter a valid account holder name')
                .required('Account Holder Name is required'),
              accountNumber: Yup.string()
                .matches(/^[a-zA-Z0-9]{5,35}$/, 'Please enter a valid account number')
                .required('Account Number is required'),
              ifsc: Yup.string()
                .min(11, 'Please enter a valid ifsc code')
                .max(11, 'Please enter a valid ifsc code')
                .required('IFSC code is required'),
            }),
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
              <p className='text-3xl font-semibold mb-8'>Add your bank account</p>
              <Input
                name='bank.accountHolder'
                placeholder='Account Holder Name'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.accountHolder}
                disabled={isLoading}
                className='mt-4'
                error={touched.bank?.accountHolder && errors.bank?.accountHolder}
                autoFocus
                maxLength={120}
              />
              <Input
                name='bank.accountNumber'
                placeholder='Account Number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.accountNumber}
                disabled={isLoading}
                className='mt-4'
                error={touched.bank?.accountNumber && errors.bank?.accountNumber}
                maxLength={35}
              />
              <Input
                name='bank.ifsc'
                placeholder='IFSC'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.ifsc}
                disabled={isLoading}
                className='mt-4'
                error={touched.bank?.ifsc && errors.bank?.ifsc}
                maxLength={11}
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
    }
  };

  return <div className={`w-[90%] ${parseInt(step) === 9 ? 'max-w-5xl' : 'max-w-lg'} mx-auto`}>{renderForms()}</div>;
};

export default InfluencerOnboarding;
