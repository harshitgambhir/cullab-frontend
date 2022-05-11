import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { PersonFill } from 'react-bootstrap-icons';

const InfluencerChatsSidebar = ({ chats }) => {
  const router = useRouter();
  return (
    <div className=''>
      {chats.map(chat => {
        const active = router.query.id === chat.id;
        return (
          <div
            key={chat.id}
            className={`border-b last:border-b-0 border-gray-300 md:hover:bg-gray-100 ${active && 'bg-gray-100'}`}
          >
            <Link href={`/chats/${chat.id}`}>
              <a className={`md:px-6 py-4 flex items-center ${!chat.influencerRead ? 'font-semibold' : ''}`}>
                {!chat.avatar ? (
                  <div className='border border-gray-200 bg-gray-100 rounded-full min-w-[2.5rem] min-h-[2.5rem] p-2'>
                    <PersonFill className='text-gray-400 w-full h-full' />
                  </div>
                ) : (
                  <div className='min-w-[2.5rem] min-h-[2.5rem] relative'>
                    <Image className={`rounded-full`} src={chat.avatar} alt='' objectFit='cover' layout='fill' />
                  </div>
                )}
                <div className='ml-4 truncate'>
                  <div className='text-gray-900 truncate'>{chat.brandName}</div>
                  <div className='text-gray-600 text-sm truncate'>{chat.message}</div>
                </div>
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default InfluencerChatsSidebar;
