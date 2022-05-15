import { getProfile } from '../api';

export const withPrivate = (callback, onboard = true) => {
  return async ctx => {
    ctx.req.session = {
      influencer: null,
      brand: null,
    };
    try {
      const data = await getProfile(ctx);
      if (data?.influencer) {
        ctx.req.session.influencer = data.influencer;
        if (data?.influencer.step < 12 && onboard) {
          return {
            redirect: {
              destination: '/onboard',
              permanent: false,
            },
          };
        }
      } else if (data?.brand) {
        ctx.req.session.brand = data.brand;
        if (data?.brand.step < 4 && onboard) {
          return {
            redirect: {
              destination: '/onboard',
              permanent: false,
            },
          };
        }
      }
    } catch (err) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return await callback(ctx);
  };
};

export const withAuth = callback => {
  return async ctx => {
    try {
      const data = await getProfile(ctx);
      if (data?.influencer || data?.brand) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    } catch (err) {}

    return await callback(ctx);
  };
};

export const withProfile = callback => {
  return async ctx => {
    ctx.req.session = {
      influencer: null,
      brand: null,
    };
    try {
      const data = await getProfile(ctx);
      if (data?.influencer) {
        ctx.req.session.influencer = data.influencer;
      } else if (data?.brand) {
        ctx.req.session.brand = data.brand;
      }
    } catch (err) {}

    return await callback(ctx);
  };
};

export const withInfluencer = (callback, onboard = true) => {
  return async ctx => {
    ctx.req.session = {
      influencer: null,
    };
    try {
      const data = await getProfile(ctx);
      if (data?.influencer) {
        ctx.req.session.influencer = data.influencer;
        if (data?.influencer.step < 12 && onboard) {
          return {
            redirect: {
              destination: '/onboard',
              permanent: false,
            },
          };
        }
      } else if (data?.brand) {
        return {
          notFound: true,
        };
      }
    } catch (err) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return await callback(ctx);
  };
};
