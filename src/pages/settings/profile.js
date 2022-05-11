import Error from 'next/error';

import { withPrivate } from '../../lib';
import Header from '../../components/Header';
import SettingsTopbar from '../../components/SettingsTopbar';
import InfluencerEditProfile from '../../components/InfluencerEditProfile';
import BrandEditProfile from '../../components/BrandEditProfile';

export default function EditProfile({ errorCode, influencer, brand }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  return (
    <>
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
