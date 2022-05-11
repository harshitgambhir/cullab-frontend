import Pusher from '../lib/pusher';
import Link from 'next/link';
import { PersonFill, X } from 'react-bootstrap-icons';
import Image from 'next/image';
import toast from 'react-hot-toast';

export const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const initPusher = queryClient => {
  const pusher = new Pusher('1f4bac4e90446fd5b8d1', {
    cluster: 'ap2',
    userAuthentication: {
      endpoint: 'http://localhost:5000/pusher/user-auth',
    },
  });
  pusher.signin();
  pusher.user.bind('message', data => {
    const oldChats = queryClient.getQueryData('getChats');
    if (!oldChats || (oldChats && !oldChats.chats.length)) {
      queryClient.invalidateQueries('getChats');
    } else {
      const chat = oldChats.chats.find(
        chat => chat.id === (data.message.role === 'INFLUENCER' ? data.message.influencer.id : data.message.brand.id)
      );

      if (chat) {
        queryClient.setQueryData('getChats', old => {
          const foundIdx = old.chats.findIndex(_chat => _chat.id === chat.id);
          const chats = old.chats;
          chats.splice(foundIdx, 1);
          chats.unshift({
            ...chat,
            message: data.message.message,
            brandRead: 0,
            influencerRead: 0,
          });
          return {
            ...old,
            chats,
          };
        });
      } else {
        queryClient.invalidateQueries('getChats');
      }
    }

    queryClient.setQueryData(
      ['getChat', data.message.role === 'INFLUENCER' ? data.message.influencer.id : data.message.brand.id],
      old => {
        if (!old) {
          return old;
        }
        return {
          ...old,
          chat: {
            ...old.chat,
            messages: [...old.chat.messages, data.message],
          },
        };
      }
    );

    queryClient.setQueryData('getProfile', old => {
      if (!old) {
        return old;
      }

      if (old.role === 'BRAND') {
        return {
          ...old,
          brandNotRead: 1,
        };
      }
      return {
        ...old,
        influencerNotRead: 1,
      };
    });

    toast.custom(
      t => (
        <div
          className={`toastt-${data.message.userId} ${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md p-4 w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <Link
            href={
              data.message.role === 'INFLUENCER'
                ? `/chats/${data.message.influencer.id}`
                : `/chats/${data.message.brand.id}`
            }
          >
            <a className='w-full'>
              <div className='flex items-start w-full'>
                <div className='flex-shrink-0 pt-0.5'>
                  {data.message.role === 'INFLUENCER' ? (
                    !data.message.influencer.avatar ? (
                      <div className='border border-gray-200 bg-gray-100 rounded-full w-10 h-10 p-2'>
                        <PersonFill className='text-gray-400 w-full h-full' />
                      </div>
                    ) : (
                      <div className='w-10 h-10 relative'>
                        <Image
                          className={`rounded-full`}
                          src={data.message.influencer.avatar}
                          alt=''
                          objectFit='cover'
                          layout='fill'
                        />
                      </div>
                    )
                  ) : !data.message.brand.avatar ? (
                    <div className='border border-gray-200 bg-gray-100 rounded-full min-w-[2rem] min-h-[2rem] p-2'>
                      <PersonFill className='text-gray-400 w-full h-full' />
                    </div>
                  ) : (
                    <div className='min-w-[2rem] min-h-[2rem] relative'>
                      <Image
                        className={`rounded-full`}
                        src={data.message.brand.avatar}
                        alt=''
                        objectFit='cover'
                        layout='fill'
                      />
                    </div>
                  )}
                </div>
                <div className='ml-3 truncate'>
                  <p className='text-sm font-medium text-gray-900 truncate'>
                    {data.message.role === 'INFLUENCER' ? data.message.influencer.name : data.message.brand.name}
                  </p>
                  <p className='mt-1 text-sm text-gray-500 truncate'>{data.message.message}</p>
                </div>
              </div>
            </a>
          </Link>
          <X className='h-8 w-8 cursor-pointer' onClick={() => toast.dismiss(t.id)} />
        </div>
      ),
      {
        position: 'bottom-left',
        duration: Infinity,
      }
    );
    var audio = document.getElementById('chatAudio');
    audio.play();
  });
};
