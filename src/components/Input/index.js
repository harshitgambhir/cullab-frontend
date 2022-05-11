import React, { useState } from 'react';

const Input = ({ className, disabled, label, textarea, error, ...props }) => {
  return (
    <div className={className}>
      {label && <label className='block text-base text-gray-900 mb-2 font-semibold'>{label}</label>}
      {textarea ? (
        <textarea
          className={`text-sm appearance-none outline-none focus:ring-1 border flex-1 block w-full rounded-md border-gray-300 p-3 ${
            disabled ? 'cursor-not-allowed opacity-70' : ''
          } bg-white ${error ? 'ring-red-600 focus:ring-red-600 ring-1' : 'focus:ring-blue-600'}`}
          disabled={disabled}
          style={{
            resize: 'none',
          }}
          {...props}
        />
      ) : (
        <input
          className={`text-sm appearance-none outline-none focus:ring-1 border flex-1 block w-full rounded-md border-gray-300 p-3 ${
            disabled ? 'cursor-not-allowed opacity-70' : ''
          } bg-white ${error ? 'ring-red-600 focus:ring-red-600 ring-1' : 'focus:ring-blue-600'}`}
          disabled={disabled}
          {...props}
        />
      )}
      {error && <div className='text-red-600 text-sm mt-2'>{error}</div>}
    </div>
  );
};

export default Input;
