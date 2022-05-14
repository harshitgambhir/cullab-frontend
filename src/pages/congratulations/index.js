import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Head from 'next/head';

import { withInfluencer } from '../../lib';
import Button from '../../components/Button';

const refund = ({ influencer }) => {
  return (
    <>
      <Head>
        <title>Cullab | Congratulations</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@usecullab' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={`Cullab | Congratulations`} />
        <meta property='og:site_name' content='Cullab' />
        <meta property='og:image' content='images/logo.png' />
      </Head>
      <Header user={influencer} />
      <div className='px-6 sm:px-10 pt-14 pb-10'>
        <div className='max-w-xl mx-auto'>
          <div className='flex flex-col justify-center items-center'>
            <div className='text-2xl font-bold leading-normal md:leading-normal text-center'>
              🎉Congratulations! <br className='block sm:hidden' />
              You're all set
            </div>
            <p className='mt-8 whitespace-pre-line text-center'>
              You have successfully set up your profile on Cullab. <br />
              Now you can recieve orders from brands.
            </p>
            <Button text='View Profile' className='mt-8 px-5 py-2' link href={`/${influencer?.username}`} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps = withInfluencer(async function (ctx) {
  const { req } = ctx;

  return {
    props: {
      influencer: req.session.influencer,
    },
  };
}, false);

export default refund;
