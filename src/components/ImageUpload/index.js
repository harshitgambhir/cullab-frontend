import { useState, useCallback } from 'react';
import { getOrientation } from 'get-orientation/browser';
import Cropper from 'react-easy-crop';
import { Dialog } from '@headlessui/react';

import { getCroppedImg, getRotatedImage } from './utils';
import Button from '../Button';
import { X } from 'react-bootstrap-icons';

const ORIENTATION_TO_ANGLE = {
  3: 180,
  6: 90,
  8: -90,
};

const ImageUpload = ({ setFieldValue, fileName, aspect, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      console.log(croppedImage);
      setFieldValue(props.name, croppedImage.file);
      setFieldValue(fileName, croppedImage.blob);
      handleClose();
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const readFile = file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setImageSrc(null);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} className='relative z-50'>
        <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
        <div className='fixed inset-0 flex items-center justify-center p-4'>
          <Dialog.Panel
            className={
              'w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all'
            }
          >
            <div className='flex items-center justify-between'>
              <Dialog.Title className='text-xl font-semibold'>Crop</Dialog.Title>
              <X className='h-8 w-8 cursor-pointer' onClick={handleClose} />
            </div>
            <div className='relative w-full h-[400px] mt-6'>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <Button
              text='Save'
              className='w-full px-6 py-3 mt-10'
              onClick={() => {
                showCroppedImage();
              }}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
      <input
        type='file'
        accept='image/png, image/jpeg'
        className='opacity-0 absolute inset-0 w-full h-full cursor-pointer'
        onChange={async e => {
          console.log('sss', e.target.files);
          if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            let imageDataUrl = await readFile(file);

            // apply rotation if needed
            const orientation = await getOrientation(file);
            const rotation = ORIENTATION_TO_ANGLE[orientation];
            if (rotation) {
              imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
            }

            setImageSrc(imageDataUrl);
            setIsOpen(true);
          }
          e.target.value = '';
        }}
        {...props}
      />
    </>
  );
};

export default ImageUpload;
