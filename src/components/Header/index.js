import React, { Fragment, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import { PersonFill } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';

import * as api from '../../api';

const Header = ({ user }) => {
  const router = useRouter();
  const { mutate, isSuccess } = useMutation('logout', api.logout);

  useEffect(() => {
    if (isSuccess) {
      router.reload();
    }
  }, [isSuccess]);

  return (
    <div className='flex items-center justify-center'>
      <div className='flex justify-between items-center min-h-[65px] md:min-h-[85px] h-full max-w-[1600px] w-[90%]'>
        <Link href='/'>
          <a className='relative min-h-[30px] sm:min-h-[40px] min-w-[73px]'>
            <Image src='/images/logo.png' alt='' objectFit='contain' layout='fill' />
          </a>
        </Link>
        {user ? (
          <div className='flex items-center text-base'>
            {(user.brandName && user.step === 4) || (user.username && user.step === 11) ? (
              <>
                <Link href='/orders'>
                  <a className='mr-4 sm:mr-8 font-semibold text-gray-900'>Orders</a>
                </Link>
                <Link href='/chats'>
                  <a className='mr-4 sm:mr-8 font-semibold text-gray-900'>Chats</a>
                </Link>
              </>
            ) : null}
            <Menu as='div' className='relative'>
              <div>
                <Menu.Button className='max-w-xs rounded-full flex items-center text-sm'>
                  {!user.avatar ? (
                    <div className='border border-gray-200 bg-gray-100 rounded-full w-10 h-10 p-2'>
                      <PersonFill className='text-gray-400 w-full h-full' />
                    </div>
                  ) : (
                    <div className='w-10 h-10 relative'>
                      <Image className={`rounded-full`} src={user.avatar} alt='' objectFit='cover' layout='fill' />
                    </div>
                  )}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <Menu.Items className='origin-top-right z-10 absolute right-0 mt-2 w-60 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 outline-none'>
                  <Menu.Item>
                    <a
                      href={
                        (user.brandName && user.step === 4) || (user.username && user.step === 11)
                          ? `/settings/profile`
                          : `/onboard`
                      }
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-gray-200 font-semibold'
                    >
                      Settings
                    </a>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      onClick={() => mutate()}
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200 cursor-pointer'
                    >
                      Logout
                    </div>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        ) : (
          <div className='flex items-center'>
            <Link href='/brand-login'>
              <a className='mr-8 font-semibold text-gray-900'>Brand</a>
            </Link>
            <Link href='/influencer-login'>
              <a className='font-semibold text-gray-900'>Influencer</a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
