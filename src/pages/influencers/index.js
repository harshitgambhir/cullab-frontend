import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Error from 'next/error';

import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import { withProfile } from '../../lib';
import * as api from '../../api';
import { capitalize } from '../../utils';
import { ArrowLeftCircle, ArrowRightCircle } from 'react-bootstrap-icons';

export default function Influencers({
  errorCode,
  influencer,
  brand,
  followers,
  categories,
  prices,
  influencers,
  meta,
}) {
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const router = useRouter();
  const page = router.query.page ? parseInt(router.query.page) : 1;

  return (
    <>
      <Header user={influencer || brand} />
      <div className='content'>
        <div className='w-[90%] mx-auto'>
          <div className='max-w-5xl mx-auto flex flex-col items-center justify-center'>
            <SearchBar className='mt-10' followers={followers} categories={categories} prices={prices} />
          </div>
          <div className='text-2xl font-semibold mt-10'>Influencers</div>
          {meta.totalInfluencers === 0 && (
            <div className='text-center text-xl font-semibold mt-20'>No influencers found</div>
          )}
          <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-7 gap-y-10 mt-6'>
            {influencers.map(inf => {
              return (
                <Link key={inf.id} href={`/${inf.username}`}>
                  <a className='text-gray-900'>
                    <Image
                      className={`rounded-lg`}
                      src={inf.featured}
                      alt=''
                      width={200}
                      height={255}
                      layout='responsive'
                      objectFit='cover'
                    />
                    <div className='text-sm mt-1 font-semibold'>{inf.name}</div>
                    <div className='flex items-center justify-between mt-1'>
                      <div className='text-sm text-gray-500'>{capitalize(inf.package.platformId)}</div>
                      <div className='text-sm font-semibold'>₹{parseInt(inf.package.price).toString()}</div>
                    </div>
                    <div className='text-sm mt-1 line-clamp-2'>{inf.bio}</div>
                  </a>
                </Link>
              );
            })}
          </div>
          {meta.totalInfluencers > 0 && (
            <div className='flex items-center justify-center mt-16'>
              {page > 1 && (
                <ArrowLeftCircle
                  className='h-8 w-8 mr-4 cursor-pointer'
                  onClick={() =>
                    router.push({
                      pathname: router.pathname,
                      query: { ...router.query, page: page - 1 },
                    })
                  }
                />
              )}
              <div className='mr-4 text-lg'>
                Page {page || 1} of {meta.totalPages}
              </div>
              {page < meta.totalPages && (
                <ArrowRightCircle
                  className='h-8 w-8 cursor-pointer'
                  onClick={() =>
                    router.push({
                      pathname: router.pathname,
                      query: { ...router.query, page: page + 1 },
                    })
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withProfile(async function (ctx) {
  const { req, res } = ctx;
  try {
    const data2 = await api.getFollowers();
    const data3 = await api.getCategories();
    const data4 = await api.getPrices();
    const data5 = await api.getInfluencers({
      params: ctx.query,
    });

    return {
      props: {
        influencer: req.session.influencer,
        brand: req.session.brand,
        followers: data2?.followers,
        categories: data3?.categories,
        prices: data4.prices,
        influencers: data5?.influencers,
        meta: data5?.meta,
      },
    };
  } catch (err) {
    const errorCode = err?.response?.status || 500;
    res.statusCode = errorCode;
    return {
      props: { errorCode },
    };
  }
});
