import { useRef, useEffect } from 'react';
import { useMutation } from 'react-query';
import { Formik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import Error from 'next/error';

import { withInfluencer } from '../../lib';
import Header from '../../components/Header';
import * as influencerApi from '../../api/influencers';
import SettingsTopbar from '../../components/SettingsTopbar';
import Button from '../../components/Button';
import * as api from '../../api/index';

export default function EditSocials({ errorCode, influencer, categories }) {
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
      toast.success('Niches saved');
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
      <Header user={influencer} />
      <div className='content'>
        <div className='max-w-5xl w-[90%] mx-auto'>
          <SettingsTopbar influencer={influencer} />
          <div className='max-w-2xl mr-auto py-6 sm:p-6'>
            <Formik
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
                  <div className='grid grid-cols-2 gap-4'>
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
    const data = await api.getCategories();
    return {
      props: {
        influencer,
        categories: data?.categories || [],
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
