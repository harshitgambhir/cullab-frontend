import Error from 'next/error';

import { withInfluencer } from '../../lib';
import Header from '../../components/Header';
import SettingsTopbar from '../../components/SettingsTopbar';
import Input from '../../components/Input';

export default function EditBank({ errorCode, influencer }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  return (
    <>
      <Header user={influencer} />
      <div className='content'>
        <div className='max-w-5xl w-[90%] mx-auto'>
          <SettingsTopbar influencer={influencer} />
          <div className='max-w-2xl mr-auto py-6 sm:p-6'>
            {influencer.bank.isVerified ? (
              <div className={`text-xs px-3 py-1 rounded-full text-white bg-green-500 w-max`}>VERIFIED</div>
            ) : (
              <div className={`text-xs px-3 py-1 rounded-full text-white bg-red-500 w-max`}>UNVERIFIED</div>
            )}
            <Input
              name='accountHolder'
              label='Account Holder Name'
              value={influencer.bank.accountHolder}
              disabled
              className='mt-4'
            />
            <Input
              name='bank.accountNumber'
              label='Account Number'
              value={influencer.bank.accountNumber}
              disabled
              className='mt-4'
            />
            <Input name='bank.ifsc' label='IFSC' value={influencer.bank.ifsc} disabled className='mt-4' />
            <div className='mt-4 text-sm text-gray-500'>
              To update bank account details,{' '}
              <a href='mailto:hello@cullab.in' rel='noopener noreferrer nofollow'>
                contact support
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withInfluencer(async function (ctx) {
  const { req, res } = ctx;
  const influencer = req.session.influencer;

  try {
    return {
      props: {
        influencer,
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
