import { useRef, useEffect, Fragment } from 'react';
import { useMutation } from 'react-query';
import { Formik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, X } from 'react-bootstrap-icons';
import Error from 'next/error';

import { withInfluencer } from '../../lib';
import Header from '../../components/Header';
import * as influencerApi from '../../api/influencers';
import SettingsTopbar from '../../components/SettingsTopbar';
import Input from '../../components/Input';
import Button from '../../components/Button';
import * as api from '../../api/index';
import { capitalize } from '../../utils';
import Head from 'next/head';

export default function EditSocials({ errorCode, influencer }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

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
      toast.success('Packages saved');
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
      formData.append(val, JSON.stringify(values[val]));
    }
    mutate(formData);
  };

  return (
    <>
      <Head>
        <title>Cullab | Settings | Packages</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@usecullab' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={`Cullab | Settings | Packages`} />
        <meta property='og:site_name' content='Cullab' />
        <meta property='og:image' content='images/logo.png' />
      </Head>
      <Header user={influencer} />
      <div className='content'>
        <div className='max-w-5xl w-[90%] mx-auto'>
          <SettingsTopbar influencer={influencer} />
          <div className='mx-auto py-6 sm:p-6'>
            <Formik
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
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
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
                    text='Save'
                    loading={isLoading}
                    disabled={Object.keys(errors).length}
                    className='w-full sm:w-auto mt-10 px-6 py-3'
                  />
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withInfluencer(async function (ctx) {
  const { req } = ctx;
  const influencer = req.session.influencer;

  return {
    props: {
      influencer,
    },
  };
}, false);
