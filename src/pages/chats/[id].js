import { withPrivate } from '../../lib';
import Header from '../../components/Header';
import InfluencerChats from '../../components/InfluencerChats';
import BrandChats from '../../components/BrandChats';
import * as influencerApi from '../../api/influencers';
import * as brandApi from '../../api/brands';
import { useQuery, useQueryClient } from 'react-query';
import { useEffect } from 'react';
import Error from 'next/error';
import Head from 'next/head';

export default function ChatsPage({ errorCode, influencer, brand, chats, chat }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const { data: dataChats } = useQuery('getChats', influencer ? influencerApi.getChats : brandApi.getChats, {
    initialData: { chats },
  });
  const { data: dataChat } = useQuery(
    ['getChat', chat.id],
    influencer ? () => influencerApi.getChat(chat.id) : () => brandApi.getChat(chat.id),
    {
      initialData: { chat },
    }
  );
  const queryClient = useQueryClient();
  useEffect(() => {
    const toastEl = document.getElementsByClassName(`toastt-${dataChat.chat.id}`);
    if (toastEl.length) {
      toastEl[0].style.display = 'none';
    }
    queryClient.setQueryData('getChats', old => {
      if (!old) {
        return old;
      }
      return {
        ...old,
        chats: old.chats.map(_chat => {
          if (_chat.id === dataChat.chat.id) {
            if (influencer) {
              return {
                ..._chat,
                influencerRead: 1,
              };
            } else {
              return {
                ..._chat,
                brandRead: 1,
              };
            }
          }
          return _chat;
        }),
      };
    });
  }, [dataChat.chat]);

  return (
    <>
      <Head>
        <title>Cullab | Chat | {chat.name}</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@usecullab' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={`Cullab | Chat | ${chat.name}`} />
        <meta property='og:site_name' content='Cullab' />
        <meta property='og:image' content='images/logo.png' />
      </Head>
      <Header user={influencer || brand} />
      <div className='content overflow-hidden h-[calc(100%-4rem)] md:h-auto'>
        {influencer && <InfluencerChats chats={dataChats.chats} chat={dataChat.chat} influencer={influencer} />}
        {brand && <BrandChats chats={dataChats.chats} chat={dataChat.chat} brand={brand} />}
      </div>
    </>
  );
}

export const getServerSideProps = withPrivate(async function (ctx) {
  const { req, res } = ctx;
  const influencer = req.session.influencer;
  const brand = req.session.brand;
  let chats = [];
  let chat = null;
  try {
    if (influencer) {
      const data2 = await influencerApi.getChat(ctx.query.id, ctx);
      const data = await influencerApi.getChats(ctx);
      chats = data.chats;
      chat = data2.chat;
    }
    if (brand) {
      const data2 = await brandApi.getChat(ctx.query.id, ctx);
      const data = await brandApi.getChats(ctx);
      chats = data.chats;
      chat = data2.chat;
    }
    return {
      props: {
        influencer,
        brand,
        chats,
        chat,
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
