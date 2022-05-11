import Footer from '../../components/Footer';
import Header from '../../components/Header';

const refund = () => {
  return (
    <>
      <Header />
      <div className='px-6 sm:px-10 pt-24 pb-10'>
        <div className='max-w-5xl mx-auto'>
          <div className='flex flex-col'>
            <div className='text-3xl md:text-4xl font-bold leading-normal md:leading-normal'>
              Refund or Cancellation Policy
            </div>
            <p className='mt-4 whitespace-pre-line'>
              All sales are final and no refund will be issued unless both parties included in the transaction agree to
              cancel an order, or the Cullab dispute resolution team decides that a refund is justified. If an order is
              placed with an influencer but the buyer fails to follow through with the order, or requests to cancel for
              reasons outside of Cullab’s control, such as a lack of planning or organization, they will be subject to a
              fee upon refund. If a buyer or seller chooses to take communication or transactions outside of the site,
              Cullab does not take any responsibility for the order. Cullab holds the right to refund any payment made
              to an influencer if we believe there is valid reason to do so.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default refund;
