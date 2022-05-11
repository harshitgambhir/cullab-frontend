import React from 'react';
import Link from 'next/link';

const Button = ({ className, loading, text, disabled, link, outlined, ...props }) => {
  if (link) {
    return (
      <Link {...props}>
        <a
          className={`flex ${
            outlined
              ? 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-900 '
              : 'bg-gray-900 hover:bg-gray-700 text-white'
          } justify-center appearance-none rounded items-center font-medium outline-none transition ease-in-out duration-150 ${className}`}
        >
          {text}
        </a>
      </Link>
    );
  }
  return (
    <button
      type='button'
      className={`flex ${
        outlined
          ? 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-900 '
          : 'bg-gray-900 hover:bg-gray-700 text-white'
      } justify-center appearance-none rounded items-center font-medium outline-none transition ease-in-out duration-150 ${
        disabled || loading ? 'cursor-not-allowed opacity-50' : ''
      } ${className ? className : ''}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <svg
          className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          ></path>
        </svg>
      ) : null}
      {text}
    </button>
  );
};

export default Button;
