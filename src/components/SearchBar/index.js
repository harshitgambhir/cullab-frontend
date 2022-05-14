import React, { Fragment, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Formik } from 'formik';
import { Search } from 'react-bootstrap-icons';
import { capitalize } from '../../utils';
import { useRouter } from 'next/router';

const SearchBar = ({ className, categories, followers, prices }) => {
  const router = useRouter();
  const handleSubmit = values => {
    router.push({
      pathname: `/influencers`,
      query: values,
    });
  };

  return (
    <Formik
      initialValues={{
        categories: router.query.categories
          ? typeof router.query.categories === 'string'
            ? [router.query.categories]
            : router.query.categories
          : [],
        followers: router.query.followers
          ? typeof router.query.followers === 'string'
            ? [router.query.followers]
            : router.query.followers
          : [],
        price: router.query.price || '',
        gender: router.query.gender || '',
      }}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, handleSubmit }) => (
        <form
          onSubmit={handleSubmit}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
          className='w-full relative'
        >
          <div
            className={`grid grid-cols-1 sm:grid-cols-9 w-full ${className} border border-gray-300 rounded-3xl sm:rounded-full items-center`}
          >
            <Listbox value={values.categories} onChange={val => setFieldValue('categories', val)} multiple>
              <div className='border-b sm:border-b-0 sm:border-r border-gray-300 sm:col-span-2 sm:hover:bg-gray-50 rounded-t-3xl sm:rounded-l-full'>
                <Listbox.Button className='w-full h-full py-4 px-6 sm:p-0 sm:pl-8 sm:py-4 text-left'>
                  <div className='text-gray-500 text-sm'>Category</div>
                  <div className='font-medium truncate'>
                    {values.categories.length
                      ? values.categories.map(c => capitalize(c)).join(', ')
                      : 'Choose a category'}
                  </div>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className='p-4 grid grid-cols-1 sm:grid-cols-3 gap-6 max-h-72 overflow-x-auto left-0 focus:outline-none absolute z-10 mt-1 w-full overflow-auto rounded-3xl bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm'>
                    {categories.map(category => (
                      <Listbox.Option key={category} value={category}>
                        {({ selected }) => (
                          <div
                            className={`${
                              selected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
                            } px-4 py-3 rounded-lg cursor-pointer truncate`}
                          >
                            {capitalize(category)}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <Listbox value={values.followers} onChange={val => setFieldValue('followers', val)} multiple>
              <div className='border-b sm:border-b-0 sm:border-r border-gray-300 sm:col-span-2 sm:hover:bg-gray-50 '>
                <Listbox.Button className='w-full h-full py-4 px-6 sm:p-0 sm:pl-8 sm:py-4 text-left'>
                  <div className='text-gray-500 text-sm'>Followers</div>
                  <div className='font-medium truncate'>
                    {values.followers.length
                      ? values.followers.map(f => capitalize(f)).join(', ')
                      : 'How many followers?'}
                  </div>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className='p-4 grid grid-cols-1 sm:grid-cols-3 gap-6 max-h-72 overflow-x-auto left-0 focus:outline-none absolute z-10 mt-1 w-full overflow-auto rounded-3xl bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm'>
                    {followers.map(follower => (
                      <Listbox.Option key={follower} value={follower}>
                        {({ selected }) => (
                          <div
                            className={`${
                              selected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
                            } px-4 py-3 rounded-lg cursor-pointer truncate`}
                          >
                            {capitalize(follower)}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <Listbox
              value={values.price}
              onChange={val => {
                if (val === values.price) {
                  return setFieldValue('price', '');
                }
                setFieldValue('price', val);
              }}
            >
              <div className='border-b sm:border-b-0 sm:border-r border-gray-300 sm:col-span-2 sm:hover:bg-gray-50'>
                <Listbox.Button className='w-full h-full py-4 px-6 sm:p-0 sm:pl-8 sm:py-4 text-left'>
                  <div className='text-gray-500 text-sm'>Price</div>
                  <div className='font-medium truncate'>
                    {values.price ? capitalize(values.price) : 'Choose a price'}
                  </div>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className='p-4 grid grid-cols-1 sm:grid-cols-3 gap-6 max-h-72 overflow-x-auto left-0 focus:outline-none absolute z-10 mt-1 w-full overflow-auto rounded-3xl bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm'>
                    {prices.map(price => (
                      <Listbox.Option key={price} value={price}>
                        {({ selected }) => (
                          <div
                            className={`${
                              selected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
                            } px-4 py-3 rounded-lg cursor-pointer truncate`}
                          >
                            {capitalize(price)}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <Listbox
              value={values.gender}
              onChange={val => {
                if (val === values.gender) {
                  return setFieldValue('gender', '');
                }
                setFieldValue('gender', val);
              }}
            >
              <div className=' border-gray-300 sm:col-span-2 sm:hover:bg-gray-50 rounded-b-3xl sm:rounded-r-full'>
                <Listbox.Button className='w-full h-full py-4 px-6 sm:p-0 sm:pl-8 sm:py-4 text-left'>
                  <div className='text-gray-500 text-sm'>Gender</div>
                  <div className='font-medium truncate'>
                    {values.gender ? capitalize(values.gender) : 'Choose a gender'}
                  </div>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className='p-4 grid grid-cols-1 sm:grid-cols-3 gap-6 max-h-72 overflow-x-auto left-0 focus:outline-none absolute z-10 mt-1 w-full overflow-auto rounded-3xl bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm'>
                    {['male', 'female'].map(gender => (
                      <Listbox.Option key={gender} value={gender}>
                        {({ selected }) => (
                          <div
                            className={`${
                              selected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
                            } px-4 py-3 rounded-lg cursor-pointer truncate`}
                          >
                            {capitalize(gender)}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <button
              className='bg-gray-900 rounded-full sm:ml-auto justify-center items-center flex p-4 mx-6 my-4 sm:m-0 sm:mr-4 cursor-pointer'
              style={{
                height: 'min-content',
              }}
              type='submit'
            >
              <Search className='text-white h-5 w-5' />
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default SearchBar;
