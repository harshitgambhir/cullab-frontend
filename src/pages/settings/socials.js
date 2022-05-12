import { useRef, useEffect, Fragment } from 'react';
import { useMutation } from 'react-query';
import { Formik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown } from 'react-bootstrap-icons';
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

export default function EditSocials({ errorCode, influencer, platforms, followers }) {
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
      formData.append(val, JSON.stringify(values[val]));
    }
    mutate(formData);
  };

  return (
    <>
      <Head>
        <title>Cullab | Settings | Socials</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@usecullab' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={`Cullab | Settings | Socials`} />
        <meta property='og:site_name' content='Cullab' />
        <meta property='og:image' content='images/logo.png' />
      </Head>
      <Header user={influencer} />
      <div className='content'>
        <div className='max-w-5xl w-[90%] mx-auto'>
          <SettingsTopbar influencer={influencer} />
          <div className='max-w-2xl mr-auto py-6 sm:p-6'>
            <Formik
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
                  {platforms.map((platform, i) => {
                    return (
                      <div key={platform} className='grid grid-cols-2 gap-8 gap-y-4'>
                        <div className='font-semibold'>{capitalize(platform)} Username</div>
                        <div className='font-semibold'>{capitalize(platform)} Followers</div>
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
                          <div className='relative w-full'>
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
  const { req, res } = ctx;
  const influencer = req.session.influencer;

  try {
    const data = await api.getPlatforms();
    const data2 = await api.getFollowers();
    return {
      props: {
        influencer,
        platforms: data?.platforms || [],
        followers: data2?.followers || [],
      },
    };
  } catch (err) {
    const errorCode = err?.response?.status || 500;
    res.statusCode = errorCode;
    return {
      props: { errorCode },
    };
  }
}, false);
