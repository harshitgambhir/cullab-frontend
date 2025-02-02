import Error from 'next/error';

import { withPrivate } from '../../lib';
import Header from '../../components/Header';
import InfluencerOrders from '../../components/InfluencerOrders';
import BrandOrders from '../../components/BrandOrders';
import * as influencerApi from '../../api/influencers';
import * as brandApi from '../../api/brands';
import Head from 'next/head';

export default function OrdersPage({ errorCode, influencer, brand, orders }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  return (
    <>
      <Head>
        <title>Cullab | Orders</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@usecullab' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={`Cullab | Orders`} />
        <meta property='og:site_name' content='Cullab' />
        <meta property='og:image' content='images/logo.png' />
      </Head>
      <Header user={influencer || brand} />
      <div className='content'>
        {influencer && <InfluencerOrders orders={orders} />}
        {brand && <BrandOrders orders={orders} />}
      </div>
    </>
  );
}

export const getServerSideProps = withPrivate(async function (ctx) {
  const { req, res } = ctx;
  const influencer = req.session.influencer;
  const brand = req.session.brand;
  let orders = [];
  try {
    if (influencer) {
      const data = await influencerApi.getOrders(ctx);
      orders = data.orders;
    }
    if (brand) {
      const data = await brandApi.getOrders(ctx);
      orders = data.orders;
    }
    return {
      props: {
        influencer,
        brand,
        orders,
      },
    };
  } catch (err) {
    const errorCode = err?.response?.status || 500;
    res.statusCode = errorCode;
    return {
      props: { errorCode },
    };
  }
}, true);
