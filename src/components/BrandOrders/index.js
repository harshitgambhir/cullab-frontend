import { useEffect, useState } from 'react';
import { PersonFill } from 'react-bootstrap-icons';
import Image from 'next/image';
import { useMutation } from 'react-query';
import Link from 'next/link';

import Button from '../Button';
import * as brandApi from '../../api/brands';
import RenderStatus from '../RenderStatus';
import toast from 'react-hot-toast';

const OrderCard = ({ order }) => {
  const [status, setStatus] = useState(order.status);
  const {
    mutate,
    isLoading,
    isSuccess: isSuccess,
    data,
    isError,
    error,
  } = useMutation('approveOrder', brandApi.approveOrder);

  useEffect(() => {
    if (isSuccess) {
      setStatus(data.order.status);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error?.error?.key === 'ACCOUNT_SUSPENDED') {
      toast.error(error.error.message);
    }
  }, [isError]);

  return (
    <div key={order.id} className={`border-b border-gray-200 py-6 rounded-lg`}>
      <div className='flex items-center'>
        <div className='text-sm text-gray-500'>Order #{order.orderId}</div>
        <RenderStatus status={status} />
      </div>
      <div className='flex justify-between w-full mt-2'>
        <div className='mr-4'>
          <div className='text-lg font-semibold'>{order.title}</div>
          <div className='text-sm mt-2'>{order.description}</div>
        </div>
        <div className='text-lg font-semibold'>₹{order.price}</div>
      </div>
      <div className='flex flex-col sm:flex-row w-full sm:items-center justify-between mt-6'>
        <Link href={`/${order.influencer.username}`}>
          <a className='flex items-center'>
            {!order.influencer.avatar ? (
              <div className='border border-gray-200 bg-gray-100 rounded-full w-10 h-10 p-2'>
                <PersonFill className='text-gray-400 w-full h-full' />
              </div>
            ) : (
              <div className='w-10 h-10 relative'>
                <Image
                  className={`rounded-full`}
                  src={order.influencer.avatar}
                  alt=''
                  objectFit='cover'
                  layout='fill'
                />
              </div>
            )}
            <div className='ml-4 text-gray-900'>{order.influencer.name}</div>
          </a>
        </Link>
        {(status !== 'APPROVED' || status === 'COMPLETED') && (
          <div className='flex sm:ml-4 mt-6 sm:mt-0 items-end'>
            {status !== 'APPROVED' && status !== 'EXPIRED' ? (
              <Button
                text='Chat Now'
                link
                href={`/chats/${order.influencer.id}`}
                className='px-4 py-2.5 text-sm w-1/2 sm:w-auto'
                outlined
              />
            ) : null}
            {status === 'COMPLETED' ? (
              <Button
                onClick={() =>
                  mutate({
                    id: order.id,
                  })
                }
                text='Approve Work'
                className='px-4 py-2.5 text-sm border border-gray-900 ml-4 w-1/2 sm:w-auto'
                loading={isLoading}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

const BrandOrders = ({ orders }) => {
  return (
    <div className='w-[90%] max-w-3xl mx-auto'>
      <div className='text-xl sm:text-2xl font-bold py-4'>Orders</div>
      {!orders.length && <div className='text-center mt-20'>No Orders</div>}
      {orders.map(order => {
        return <OrderCard order={order} key={order.id} />;
      })}
    </div>
  );
};

export default BrandOrders;
