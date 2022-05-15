import { useState, useEffect } from 'react';
import Error from 'next/error';
import Image from 'next/image';
import { Instagram, PersonFill } from 'react-bootstrap-icons';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import Script from 'next/script';
import Head from 'next/head';

import { withProfile } from '../../lib';
import Header from '../../components/Header';
import Button from '../../components/Button';
import * as influencerApi from '../../api/influencers';
import * as brandApi from '../../api/brands';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';

export default function PublicInfluencer({ errorCode, influencer, brand, publicInfluencer }) {
  const [selectedPackage, setSelectedPackage] = useState(publicInfluencer?.packages[0]);
  const {
    mutate: mutatePlaceOrder,
    isLoading: isLoadingPlaceOrder,
    isSuccess: isSuccessPlaceOrder,
    isError: isErrorPlaceOrder,
    error: errorPlaceOrder,
    data: dataPlaceOrder,
  } = useMutation('placeOrder', brandApi.placeOrder);
  const router = useRouter();

  useEffect(() => {
    if (isSuccessPlaceOrder) {
      var rzp1 = new Razorpay(dataPlaceOrder.options);
      rzp1.open();
    }
  }, [isSuccessPlaceOrder]);

  useEffect(() => {
    if (isErrorPlaceOrder && errorPlaceOrder?.error?.key === 'ACCOUNT_SUSPENDED') {
      toast.error(errorPlaceOrder.error.message);
    }
  }, [isErrorPlaceOrder]);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }
  return (
    <>
      <Head>
        <title>Cullab | Promote with {publicInfluencer.name}</title>
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@usecullab' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={`Cullab | Promote with ${publicInfluencer.name}`} />
        <meta property='og:description' content={publicInfluencer.bio} />
        <meta property='og:site_name' content='Cullab' />
        <meta property='og:image' content={publicInfluencer.featured} />
      </Head>
      <Header user={influencer || brand} />
      <Script src='https://checkout.razorpay.com/v1/checkout.js'></Script>
      <div className='content'>
        <div className='w-[90%] max-w-6xl mx-auto'>
          <div className='flex flex-col items-center justify-center'>
            {!publicInfluencer.avatar ? (
              <div className='border border-gray-200 bg-gray-100 rounded-full w-32 h-32 p-2'>
                <PersonFill className='text-gray-400 w-full h-full' />
              </div>
            ) : (
              <div className='w-32 h-32 relative'>
                <Image
                  className={`rounded-full`}
                  src={publicInfluencer.avatar}
                  alt=''
                  objectFit='cover'
                  layout='fill'
                />
              </div>
            )}
            <div className='mt-5 font-semibold text-lg'>{publicInfluencer.name}</div>
            <div className='mt-1 text-gray-600 max-w-xl text-center'>{publicInfluencer.bio}</div>
            <div className='flex items-center justify-center mt-5'>
              {publicInfluencer.platforms.map(platform => {
                return (
                  <a
                    key={platform}
                    href={`https://instagram.com/${platform.username}`}
                    target='_blank'
                    rel='noopener noreferrer nofollow'
                    className='text-gray-900'
                  >
                    <Instagram className='h-6 w-6' />
                  </a>
                );
              })}
            </div>
          </div>
          <div className='mt-16 font-semibold text-lg'>Packages</div>
          <div className='grid grid-cols-1 md:grid-cols-5 gap-20 mt-6'>
            <div className='space-y-8 md:col-span-3'>
              {publicInfluencer.packages.map(_package => {
                return (
                  <label
                    key={_package.id}
                    className={`shadow flex cursor-pointer border border-gray-200 py-6 px-5 rounded-lg ${
                      _package.id === selectedPackage?.id ? 'ring-2 ring-gray-900' : ''
                    }`}
                  >
                    <input
                      type='radio'
                      name='package'
                      className='hidden peer'
                      value={_package.id}
                      onChange={e => setSelectedPackage(_package)}
                      checked={_package.id === selectedPackage?.id}
                    />
                    <div className='border border-gray-300 hidden peer-checked:flex rounded-full h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] items-center justify-center'>
                      <div className='bg-gray-900 h-4 w-4 min-h-[1rem] min-w-[1rem] rounded-full' />
                    </div>
                    <div className='bg-white border border-gray-300 peer-checked:hidden rounded-full h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]' />
                    <div className='flex justify-between w-full'>
                      <div className='ml-4 mr-4'>
                        <div className='text-lg font-semibold'>{_package.title}</div>
                        <div className='text-sm mt-2'>{_package.description}</div>
                      </div>
                      <div className='text-lg font-semibold'>₹{_package.price}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            <div
              className='md:col-span-2 shadow border border-gray-200 py-6 px-5 rounded-lg'
              style={{ height: 'min-content' }}
            >
              <div className='text-lg font-semibold'>{selectedPackage.title}</div>
              <div className='text-sm mt-2'>{selectedPackage.description}</div>
              <div className='text-3xl mt-6'>₹{selectedPackage.price}</div>
              {brand ? (
                brand.step === 4 ? (
                  <Button
                    onClick={() =>
                      mutatePlaceOrder({
                        influencerId: publicInfluencer.id,
                        packageId: selectedPackage.id,
                      })
                    }
                    loading={isLoadingPlaceOrder}
                    text='Place Order'
                    className='w-full mt-10 px-6 py-3'
                  />
                ) : (
                  <Button link href={`/onboard`} text='Place Order' className='w-full mt-10 px-6 py-3' />
                )
              ) : influencer ? null : (
                <Button
                  link
                  href={`/brand-login?redirect=/${publicInfluencer.username}`}
                  text='Place Order'
                  className='w-full mt-10 px-6 py-3'
                />
              )}
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-5 mt-10 mb-40'>
            <div className='space-y-2 md:col-span-3'>
              <div className='mt-8 font-semibold text-lg'>Brands Collaborations</div>
              <div className='text-sm'>{publicInfluencer.prevc}</div>
            </div>
            <div className='md:col-span-2' style={{ height: 'min-content' }}></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export const getServerSideProps = withProfile(async function (ctx) {
  const { req, res } = ctx;
  const { username } = ctx.params;
  try {
    const data = await influencerApi.getPublicInfluencer(username);

    return {
      props: {
        publicInfluencer: data?.influencer,
        influencer: req.session.influencer,
        brand: req.session.brand,
      },
    };
  } catch (err) {
    const errorCode = err?.response?.status || 500;
    res.statusCode = errorCode;
    return {
      props: { errorCode },
    };
  }
});
