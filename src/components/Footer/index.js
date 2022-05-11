import Link from 'next/link';
import { Instagram } from 'react-bootstrap-icons';

const Footer = () => {
  return (
    <div className='flex justify-between items-center min-h-[85px] mx-auto mt-auto max-w-[1600px] w-[90%]'>
      <div className='flex items-center text-sm'>
        <div className='text-gray-700 mr-4 font-semibold'>Cullab</div>
        <Link href='/privacy'>
          <a className='text-gray-700 mr-4'>Privacy</a>
        </Link>
        <Link href='/terms'>
          <a className='text-gray-700 mr-4'>Terms</a>
        </Link>
        <Link href='/refund'>
          <a className='text-gray-700 mr-4'>Refund</a>
        </Link>
      </div>
      <Link href='/'>
        <a className='text-gray-700'>
          <Instagram />
        </a>
      </Link>
    </div>
  );
};

export default Footer;
