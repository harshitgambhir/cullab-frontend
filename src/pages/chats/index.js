import Error from 'next/error';

import { withPrivate } from '../../lib';
import Header from '../../components/Header';
import InfluencerChats from '../../components/InfluencerChats';
import BrandChats from '../../components/BrandChats';
import * as influencerApi from '../../api/influencers';
import * as brandApi from '../../api/brands';
import { useQuery } from 'react-query';

export default function ChatsPage({ errorCode, influencer, brand, chats }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const { data: dataChats } = useQuery('getChats', influencer ? influencerApi.getChats : brandApi.getChats, {
    initialData: { chats },
  });

  return (
    <>
      <Header user={influencer || brand} />
      <div className='content md:overflow-hidden'>
        {influencer && <InfluencerChats chats={dataChats.chats} empty={true} influencer={influencer} />}
        {brand && <BrandChats chats={dataChats.chats} empty={true} brand={brand} />}
      </div>
    </>
  );
}

export const getServerSideProps = withPrivate(async function (ctx) {
  const { req, res } = ctx;
  const influencer = req.session.influencer;
  const brand = req.session.brand;
  let chats = [];
  try {
    if (influencer) {
      const data = await influencerApi.getChats(ctx);
      chats = data.chats;
    }
    if (brand) {
      const data = await brandApi.getChats(ctx);
      chats = data.chats;
    }
    return {
      props: {
        influencer,
        brand,
        chats,
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
