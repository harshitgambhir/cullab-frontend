import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Head from 'next/head';

import { withProfile } from '../../lib';

const refund = ({ influencer, brand }) => {
  return (
    <>
      <Head>
        <title>Cullab | Contact Us</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@usecullab' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={`Cullab | Contact Us`} />
        <meta property='og:site_name' content='Cullab' />
        <meta property='og:image' content='images/logo.png' />
      </Head>
      <Header user={influencer || brand} />
      <div className='px-6 sm:px-10 pt-10 pb-10'>
        <div className='max-w-5xl mx-auto'>
          <div className='flex flex-col'>
            <div className='text-2xl font-bold leading-normal md:leading-normal'>Contact Us</div>
            <div className='mt-6 text-2xl font-medium'>Address</div>
            <p className='mt-4 whitespace-pre-line'>B block 12/10 Krishna Nagar Delhi 110051</p>
            <div className='mt-6 text-2xl font-medium'>PHONE</div>
            <p className='mt-4 whitespace-pre-line'>+91 9654281980</p>
            <div className='mt-6 text-2xl font-medium'>Email</div>
            <p className='mt-4 whitespace-pre-line'>hello@cullab.in</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps = withProfile(async function (ctx) {
  const { req } = ctx;

  return {
    props: {
      influencer: req.session.influencer,
      brand: req.session.brand,
    },
  };
});

export default refund;
