import { useState, useRef } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { PersonFill, SendFill } from 'react-bootstrap-icons';
import { SpinnerCircularFixed } from 'spinners-react';
import moment from 'moment';

const ChatBox = ({ chat, empty, loading, onSend, isLoading, user }) => {
  const [text, setText] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  };

  useEffect(scrollToBottom, [chat?.messages?.length]);

  if (loading) {
    return <div></div>;
  }

  if (empty) {
    return (
      <div className='hidden md:flex items-center justify-center col-span-3 font-medium text-2xl text-gray-500'>
        Select a conversation
      </div>
    );
  }

  return (
    <div className='col-span-3 md:overflow-hidden relative h-full md:h-auto'>
      <div className='md:px-6 py-4 border-b border-gray-300 md:h-16 flex items-center md:absolute top-0 inset-x-0'>
        {chat.role === 'BRAND' ? (
          <div className={`flex items-center`}>
            {!chat.avatar ? (
              <div className='border border-gray-200 bg-gray-100 rounded-full min-w-[2rem] min-h-[2rem] p-2'>
                <PersonFill className='text-gray-400 w-full h-full' />
              </div>
            ) : (
              <div className='min-w-[2rem] min-h-[2rem] relative'>
                <Image className={`rounded-full`} src={chat.avatar} alt='' objectFit='cover' layout='fill' />
              </div>
            )}
            <div className='ml-4 text-gray-900 font-semibold'>{chat.brandName}</div>
          </div>
        ) : (
          <Link href={`/${chat.id}`}>
            <a className={`flex items-center`}>
              {!chat.avatar ? (
                <div className='border border-gray-200 bg-gray-100 rounded-full min-w-[2rem] min-h-[2rem] p-2'>
                  <PersonFill className='text-gray-400 w-full h-full' />
                </div>
              ) : (
                <div className='min-w-[2rem] min-h-[2rem] relative'>
                  <Image className={`rounded-full`} src={chat.avatar} alt='' objectFit='cover' layout='fill' />
                </div>
              )}
              <div className='ml-4 text-gray-900 font-semibold'>{chat.name}</div>
            </a>
          </Link>
        )}
      </div>
      <div className='md:mt-16 py-4 md:px-6 space-y-8 overflow-y-auto h-[calc(100%-126px)] md:h-[77%]'>
        {!chat.messages.length && (
          <div className='flex flex-col items-center justify-center text-sm mt-20'>
            <div className='text-gray-900 font-semibold text-base'>
              Say hello to {chat.role === 'INFLUENCER' ? chat.name : chat.brandName}!
            </div>
            <p
              className='text-center mt-2'
              style={{
                wordBreak: 'break-word',
              }}
            >
              Tell them everything they need to know about the promotion.
            </p>
          </div>
        )}
        {chat.messages.map((message, index) => {
          return (
            <div key={message.id} ref={index === chat.messages.length - 1 ? messagesEndRef : null}>
              <div
                className={`mr-auto text-sm w-full flex items-center ${
                  message.userId === user.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`${message.userId === user.id ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg px-4 py-2`}>
                  <p
                    style={{
                      wordBreak: 'break-word',
                    }}
                  >
                    {message.message}
                  </p>
                  <div className='text-gray-500 text-xs'>{moment(message.createdAt).format('MMM DD, HH:mm a')}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className='md:px-6 py-4 h-16 flex items-center absolute bottom-0 inset-x-0'>
        <input
          placeholder='Type a message'
          className={`text-sm appearance-none outline-none focus:ring-1 border flex-1 block w-full rounded-md border-gray-300 p-3`}
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
          disabled={isLoading}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (!text.length) {
                return;
              }
              setText('');
              onSend(text);
            }
          }}
        />
        {isLoading ? (
          <div
            className={`ml-4 h-8 w-8 ${text.length ? 'text-gray-900 cursor-pointer' : 'text-gray-500'}`}
            onClick={() => {
              if (!text.length) {
                return;
              }
              setText('');
              onSend(text);
            }}
          >
            <SpinnerCircularFixed
              className='w-full h-full'
              thickness={100}
              speed={150}
              color='rgb(17 24 39)'
              secondaryColor='#fff'
            />
          </div>
        ) : (
          <div
            className={`ml-4 h-8 w-8 ${text.length ? 'text-gray-900 cursor-pointer' : 'text-gray-500'}`}
            onClick={() => {
              if (!text.length) {
                return;
              }
              setText('');
              onSend(text);
            }}
          >
            <SendFill className='h-6 w-6 rotate-45' />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
