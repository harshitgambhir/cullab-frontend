import Error from 'next/error';

import { withPrivate } from '../../lib';
import Header from '../../components/Header';
import InfluencerOnboarding from '../../components/InfluencerOnboarding';
import BrandOnboarding from '../../components/BrandOnboarding';
import * as api from '../../api';
import Head from 'next/head';

export default function Onboard({ errorCode, step, influencer, brand, platforms, followers, categories }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  return (
    <>
      <Head>
        <title>Cullab | Onboard</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@usecullab' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={`Cullab | Onboard`} />
        <meta property='og:site_name' content='Cullab' />
        <meta property='og:image' content='images/logo.png' />
      </Head>
      <Header user={influencer || brand} />
      <div className='content'>
        {influencer && (
          <InfluencerOnboarding
            step={step}
            influencer={influencer}
            platforms={platforms}
            followers={followers}
            categories={categories}
          />
        )}
        {brand && <BrandOnboarding step={step} brand={brand} />}
      </div>
    </>
  );
}

export const getServerSideProps = withPrivate(async function (ctx) {
  const { req, res, query } = ctx;
  const influencer = req.session.influencer;
  const brand = req.session.brand;
  let step = query.s;
  let platforms = [];
  let followers = [];
  let categories = [];
  try {
    if (influencer) {
      if (!Number.isInteger(parseInt(step))) {
        return {
          redirect: {
            destination: `/onboard?s=${influencer.step}`,
            permanent: false,
          },
        };
      }
      if (parseInt(step) < 1) {
        return {
          redirect: {
            destination: `/onboard?s=${influencer.step}`,
            permanent: false,
          },
        };
      }
      if (parseInt(step) > influencer.step) {
        return {
          redirect: {
            destination: `/onboard?s=${influencer.step}`,
            permanent: false,
          },
        };
      }
      if (parseInt(step) === 7) {
        try {
          const data = await api.getPlatforms();
          platforms = data?.platforms;
          const data2 = await api.getFollowers();
          followers = data2?.followers;
        } catch (err) {}
      }
      if (parseInt(step) === 8) {
        try {
          const data3 = await api.getCategories();
          categories = data3?.categories;
        } catch (err) {}
      }
      if (influencer.step === 12) {
        return {
          redirect: {
            destination: `/congratulations`,
            permanent: false,
          },
        };
      }
    }
    if (brand) {
      if (!Number.isInteger(parseInt(step))) {
        return {
          redirect: {
            destination: `/onboard?s=${brand.step}`,
            permanent: false,
          },
        };
      }
      if (parseInt(step) < 1) {
        return {
          redirect: {
            destination: `/onboard?s=${brand.step}`,
            permanent: false,
          },
        };
      }
      if (parseInt(step) > brand.step) {
        return {
          redirect: {
            destination: `/onboard?s=${brand.step}`,
            permanent: false,
          },
        };
      }
      if (brand.step === 4) {
        return {
          redirect: {
            destination: `/`,
            permanent: false,
          },
        };
      }
    }
    return {
      props: {
        influencer,
        brand,
        step,
        platforms,
        followers,
        categories,
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
