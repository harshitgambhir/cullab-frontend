import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import InfluencerChatsSidebar from '../InfluencerChatsSidebar';
import ChatBox from '../ChatBox';
import * as influencerApi from '../../api/influencers';

const InfluencerChats = ({ chats, chat, empty, chatLoading, influencer }) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation('sendMessage', influencerApi.sendMessage, {
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['getChat', chat.id], old => {
        return {
          ...old,
          chat: {
            ...old.chat,
            messages: [...old.chat.messages, data.message],
          },
        };
      });
      const _chat = chats.find(__chat => __chat.id === chat.id);
      if (!_chat) {
        queryClient.invalidateQueries('getChats');
      } else {
        queryClient.setQueryData('getChats', old => {
          return {
            ...old,
            chats: old.chats.map(__chat => {
              if (__chat.id === _chat.id) {
                return {
                  ...__chat,
                  message: data.message.message,
                  influencerRead: 1,
                };
              }
              return __chat;
            }),
          };
        });
      }
    },
  });

  return (
    <div className='w-[90%] max-w-6xl mx-auto md:border md:grid md:grid-cols-4 h-full md:mt-10 md:h-[calc(100%-90px)] md:min-h-[36rem]'>
      <div className={`${!empty && 'hidden'} md:block md:col-span-1 md:border-r md:border-gray-300 md:overflow-y-auto`}>
        <div className='text-xl font-bold md:px-6 py-4 md:border-b border-gray-300 h-16'>Chats</div>
        <InfluencerChatsSidebar chats={chats} />
      </div>
      <ChatBox
        chat={chat}
        empty={empty}
        loading={chatLoading}
        onSend={text => {
          mutate({
            brandId: chat.id,
            data: {
              message: text,
            },
          });
        }}
        isLoading={isLoading}
        user={influencer}
      />
    </div>
  );
};

export default InfluencerChats;
