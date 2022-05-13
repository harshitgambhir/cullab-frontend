import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Head from 'next/head';
import { Disclosure } from '@headlessui/react';
import { ChevronUp } from 'react-bootstrap-icons';

import { withProfile } from '../../lib';

const influencersFaq = [
  {
    title: 'How does Cullab Work?',
    description:
      'Create your personal page and list your services for Instagram. Then, share your custom link in your bio and social media. Brands can now discover you and purchase your services, and you can easily manage brand deals and get paid for your work directly through the platform.',
  },
  {
    title: 'How do I get paid?',
    description:
      'Payments are made directly through our website. Once the brand approves your work, we will deposit the money into your bank account.',
  },
  {
    title: 'How much does it cost?',
    description: 'There is no up-front cost. We take a 20% transaction fee when you make a sale.',
  },
  {
    title: 'Is my payment guaranteed?',
    description:
      'Yes, we collect the payment from the buyer and hold it until the order is complete. This ensures that both sides are protected during every transaction.',
  },
  {
    title: 'Can I decline orders?',
    description:
      'Yes, you are able to accept or decline an order. This gives you the freedom to only work with brands that align with you.',
  },
  {
    title: 'What platforms does Cullab support?',
    description: 'Currently you can list your services for Instagram.',
  },
  {
    title: 'Are there binding contracts?',
    description:
      'No, we do not ask you to sign any contracts. We are a self-serve platform, you are free to manage your own deals without our involvement. We simply provide the platform for you to advertise your services to brands.',
  },
  {
    title: 'Are you an agency?',
    description:
      'No, we are not an agency. We are a platform for you to advertise your services, and manage your own brand deals.',
  },
];

const brandsFaq = [
  {
    title: 'How does Cullab Work?',
    description:
      'Start by searching through thousands of vetted Instagram influencers. Once you find the influencers you want to work with, safely purchase their services through Cullab. We hold your payment until the work is completed. Once the work is completed, receive your high quality content from the influencers directly through the platform.',
  },
  {
    title: 'What is Cullab?',
    description:
      'Cullab is a marketplace to find and hire influencers on Instagram. You can easily search through thousands of content creators and pay them directly through Cullab.',
  },
  {
    title: 'How are influencers vetted before joining Cullab?',
    description:
      'We verify the identity of each influencer that is listed on the platform. We also do a full audit of their social media to look for signs of fake followers & engagement. We also take into consideration their previous brand deals..',
  },
  {
    title: 'How does shipping work?',
    description:
      'Once you place an order, the influencer will send you their shipping info through the chat. You can then use your preferred shipping carrier to send them the product.',
  },
  {
    title: 'How long does an influencer have to accept my order?',
    description: 'Influencers are given 72 hours to accept new orders before they automatically expire.',
  },
  {
    title: 'What if my order gets expired?',
    description:
      'We do not charge you until an influencer accepts your order. So if your order gets expired, we will refund you the full amount and no action is required from you.',
  },
  {
    title: 'How do I know I will receive the work I paid for?',
    description:
      'Cullab holds your money until the work is completed and approved by you. You will have up to 72 hours once the work has been submitted to ask for a revision or open a dispute with Cullab.',
  },
  {
    title: 'What types of payment do you accept?',
    description:
      'We use Razorpay as our payment processor, this allows us to accept all major payment methods available in India.',
  },
];

const refund = ({ influencer, brand }) => {
  return (
    <>
      <Head>
        <title>Cullab | FAQ</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@usecullab' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={`Cullab | FAQ`} />
        <meta property='og:site_name' content='Cullab' />
        <meta property='og:image' content='images/logo.png' />
      </Head>
      <Header user={influencer || brand} />
      <div className='px-6 sm:px-10 pt-10 pb-10'>
        <div className='max-w-5xl mx-auto'>
          <div className='flex flex-col'>
            <div className='text-3xl font-bold leading-normal md:leading-normal'>For Influencers</div>
            <div className='mt-6'>
              {influencersFaq.map(item => {
                return (
                  <Disclosure key={item.title}>
                    {({ open }) => (
                      <div className='py-4 border-b border-gray-300'>
                        <Disclosure.Button className='flex w-full justify-between rounded-lg py-2 text-left text-sm font-medium text-gray-900 focus:outline-none'>
                          <span className='text-lg font-semibold'>{item.title}</span>
                          <ChevronUp className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500`} />
                        </Disclosure.Button>
                        <Disclosure.Panel className='pt-4 pb-2 text-sm text-gray-500'>
                          {item.description}
                        </Disclosure.Panel>
                      </div>
                    )}
                  </Disclosure>
                );
              })}
            </div>
            <div className='text-3xl font-bold leading-normal md:leading-normal mt-16'>For Brands</div>
            <div className='mt-6'>
              {brandsFaq.map(item => {
                return (
                  <Disclosure key={item.title}>
                    {({ open }) => (
                      <div className='py-4 border-b border-gray-300'>
                        <Disclosure.Button className='flex w-full justify-between rounded-lg py-2 text-left text-sm font-medium text-gray-900 focus:outline-none'>
                          <span className='text-lg font-semibold'>{item.title}</span>
                          <ChevronUp className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500`} />
                        </Disclosure.Button>
                        <Disclosure.Panel className='pt-4 pb-2 text-sm text-gray-500'>
                          {item.description}
                        </Disclosure.Panel>
                      </div>
                    )}
                  </Disclosure>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps = withProfile(async function (ctx) {
  const { req } = ctx;

  return {
    props: {
      influencer: req.session.influencer,
      brand: req.session.brand,
    },
  };
});

export default refund;
