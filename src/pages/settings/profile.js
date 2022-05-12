import Error from 'next/error';

import { withPrivate } from '../../lib';
import Header from '../../components/Header';
import SettingsTopbar from '../../components/SettingsTopbar';
import InfluencerEditProfile from '../../components/InfluencerEditProfile';
import BrandEditProfile from '../../components/BrandEditProfile';
import Head from 'next/head';

export default function EditProfile({ errorCode, influencer, brand }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  return (
    <>
      <Head>
        <title>Cullab | Settings | Profile</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@usecullab' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={`Cullab | Settings | Profile`} />
        <meta property='og:site_name' content='Cullab' />
        <meta property='og:image' content='images/logo.png' />
      </Head>
      <Header user={influencer || brand} />
      <div className='content'>
        <div className='max-w-5xl w-[90%] mx-auto'>
          <SettingsTopbar influencer={influencer} brand={brand} />
          {influencer && <InfluencerEditProfile influencer={influencer} />}
          {brand && <BrandEditProfile brand={brand} />}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withPrivate(async function (ctx) {
  const { req } = ctx;
  const influencer = req.session.influencer;
  const brand = req.session.brand;
  return {
    props: {
      influencer,
      brand,
    },
  };
}, false);
