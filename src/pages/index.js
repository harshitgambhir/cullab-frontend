import Error from 'next/error';
import Head from 'next/head';

import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { withProfile } from '../lib';
import * as api from '../api';
import Footer from '../components/Footer';

export default function Home({ errorCode, influencer, brand, platforms, followers, categories, prices }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }
  return (
    <>
      <Head>
        <title>Cullab | Find and Hire Influencers in Seconds</title>
        <meta name='description' content='Cullab | Find and Hire Influencers in Seconds' />
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@usecullab' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={`Cullab | Find and Hire Influencers in Seconds`} />
        <meta property='og:description' content={`Cullab | Find and Hire Influencers in Seconds`} />
        <meta property='og:site_name' content='Cullab' />
        <meta property='og:image' content='images/logo.png' />
      </Head>
      <Header user={influencer || brand} />
      <div className='content'>
        <div className='w-[90%] max-w-5xl mx-auto  flex flex-col items-center justify-center'>
          <h1 className='mt-4 sm:mt-16 text-center text-[2rem] sm:text-[2.5rem] font-bold text-[#ff385c]'>
            Find and Hire Influencers in Seconds
          </h1>
          <div className='text-center mt-2 text-gray-500 text-lg'>
            Find Instagram influencers to create unique content for your brand
          </div>
          <SearchBar
            className='mt-12'
            platforms={platforms}
            followers={followers}
            categories={categories}
            prices={prices}
          />
        </div>
        <div className='w-[90%] mx-auto mt-20 md:mt-28'>
          <div className='text-2xl font-semibold'>How Cullab Works</div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-20 mt-8'>
            <div className='bg-gray-100 p-4 rounded-lg'>
              <div className='font-semibold text-lg'>Search Influencers</div>
              <div className='mt-2 text-gray-500'>Search through thousands of vetted Instagram influencers.</div>
            </div>
            <div className='bg-gray-100 p-4 rounded-lg'>
              <div className='font-semibold text-lg'>Purchase Securely</div>
              <div className='mt-2 text-gray-500'>
                Safely purchase through Cullab. We hold your payment until the work is completed.
              </div>
            </div>
            <div className='bg-gray-100 p-4 rounded-lg'>
              <div className='font-semibold text-lg'>Receive Quality Content</div>
              <div className='mt-2 text-gray-500'>
                Receive your high quality content from influencers directly through the platform.
              </div>
            </div>
          </div>
        </div>
        <div className='w-[90%] mx-auto mt-20 md:mt-28 mb-20'>
          <div className='text-2xl font-semibold'>Why Choose Cullab</div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-20 mt-8'>
            <div className='bg-gray-100 p-4 rounded-lg'>
              <div className='font-semibold text-lg'>No Upfront Cost</div>
              <div className='mt-2 text-gray-500'>
                Search influencers for free. No subscriptions, contracts or hidden fees.
              </div>
            </div>
            <div className='bg-gray-100 p-4 rounded-lg'>
              <div className='font-semibold text-lg'>Vetted Influencers</div>
              <div className='mt-2 text-gray-500'>
                Every influencer is vetted by us. Always receive high-quality, professional content.
              </div>
            </div>
            <div className='bg-gray-100 p-4 rounded-lg'>
              <div className='font-semibold text-lg'>Instant Chat</div>
              <div className='mt-2 text-gray-500'>
                Instantly chat with influencers and stay in touch throughout the whole transaction.
              </div>
            </div>
            <div className='bg-gray-100 p-4 rounded-lg'>
              <div className='font-semibold text-lg'>Secure Purchases</div>
              <div className='mt-2 text-gray-500'>
                Your money is held safely until you approve the influencer’s work.
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export const getServerSideProps = withProfile(async function (ctx) {
  const { req, res } = ctx;

  try {
    const data = await api.getPlatforms();
    const data2 = await api.getFollowers();
    const data3 = await api.getCategories();
    const data4 = await api.getPrices();

    return {
      props: {
        influencer: req.session.influencer,
        brand: req.session.brand,
        platforms: data?.platforms,
        followers: data2?.followers,
        categories: data3?.categories,
        prices: data4.prices,
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
