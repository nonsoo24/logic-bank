import { useState, useEffect, useRef, useCallback, type MouseEvent } from 'react';
import { IDDocument1, IDDocument2, IDDocument3 } from '@/assets/svg';
import { AppButton } from '@/shared/components/AppButton';

const SLIDE_BACKGROUND_CLASS =
  'absolute top-1/2 left-1/2 h-[292px] w-[300px] -translate-x-1/2 -translate-y-1/2 bg-[#D9D9D9]/20';
const MODAL_DIALOG_CLASS = 'backdrop:bg-navy/60 bg-transparent p-4 sm:p-6 m-auto';
const MODAL_PANEL_CLASS =
  'bg-white rounded-lg p-5 sm:p-8 w-[min(92vw,30rem)] text-center shadow-xl';

export type DocumentType = 'id' | 'passport';

interface Slide {
  image: string;
  text: string;
}

const idDocumentSlides: Slide[] = [
  {
    image: IDDocument1,
    text: 'Place your ID Document on a flat surface and make sure that the data is visible.',
  },
  {
    image: IDDocument2,
    text: 'Make sure you do not cover your ID Document data (finger, paperclip etc).',
  },
  {
    image: IDDocument3,
    text: 'The ID Document needs to be clear with no reflection, make sure all the data is readable.',
  },
  {
    image: IDDocument1,
    text: 'Ensure your ID Document is within the frame and all corners are visible.',
  },
];

const passportSlides: Slide[] = [
  {
    image: IDDocument1,
    text: 'Place your passport on a flat surface and make sure that the data is visible.',
  },
  {
    image: IDDocument2,
    text: 'Make sure you do not cover your passport data (finger, paperclip etc).',
  },
  {
    image: IDDocument3,
    text: 'The passport needs to be clear with no reflection, make sure all the data is readable.',
  },
  {
    image: IDDocument1,
    text: 'Ensure your passport is within the frame and all corners are visible.',
  },
];

export interface DocumentUploadModalProps {
  isOpen: boolean;
  documentType?: DocumentType;
  onUpload: () => void;
  onClose: () => void;
}

export function DocumentUploadModal({
  isOpen,
  documentType = 'id',
  onUpload,
  onClose,
}: DocumentUploadModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const slides = documentType === 'passport' ? passportSlides : idDocumentSlides;
  const title =
    documentType === 'passport' ? 'Upload proof of passport' : 'Upload proof of ID Document';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      setCurrentSlide(0); // Reset to first slide when closing
      onClose?.();
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  }, [slides.length]);

  const handleModalClose = useCallback(() => {
    setCurrentSlide(0); // Reset to first slide
    onClose();
  }, [onClose]);

  const handleBackdropClick = useCallback((event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      dialogRef.current?.close();
    }
  }, []);

  const handleUpload = useCallback(() => {
    handleModalClose();
    // Small delay to allow modal to close before triggering file picker
    setTimeout(() => {
      onUpload();
    }, 100);
  }, [handleModalClose, onUpload]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className={MODAL_DIALOG_CLASS}
      onClick={handleBackdropClick}
      aria-labelledby="document-modal-title"
    >
      <div className={MODAL_PANEL_CLASS}>
        {/* Title */}
        <h2
          id="document-modal-title"
          className="text-lg sm:text-xl font-bold text-navy mb-2 text-center"
        >
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-black/70 font-normal text-center mb-5 sm:mb-6 max-w-136 mx-auto">
          Follow the instructions below to make sure your photo meets our requirements
        </p>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mb-5 sm:mb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-navy' : 'bg-neutral-gray/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Carousel Content */}
        <div className="relative flex items-center justify-center">
          {/* Navigation Arrow - Previous */}
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-0 sm:left-2 z-10 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-navy text-white hover:bg-navy/90 transition-colors shadow-lg cursor-pointer"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Slide Image */}
          <div className="relative w-full px-8 sm:px-14 py-4 min-h-81 flex items-center justify-center">
            <div className={SLIDE_BACKGROUND_CLASS} aria-hidden="true" />
            <div className="relative z-10 flex items-center justify-center">
              <img
                src={slides[currentSlide].image}
                alt={`Step ${currentSlide + 1}`}
                className="w-full max-w-75 max-h-73 object-contain"
              />
            </div>
          </div>

          {/* Navigation Arrow - Next */}
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-0 sm:right-2 z-10 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-navy text-white hover:bg-navy/90 transition-colors shadow-lg cursor-pointer"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Slide Text */}
        <p className="text-sm sm:text-base font-bold text-neutral-dark text-center mt-5 sm:mt-6 mb-6 sm:mb-8 min-h-12 px-2 sm:px-4 max-w-136 mx-auto">
          {slides[currentSlide].text}
        </p>

        {/* Upload Button */}
        <div className="flex justify-center">
          <AppButton
            variant="solid"
            color="primary"
            label="Upload"
            onClick={handleUpload}
            className="w-full sm:w-[18rem]"
          />
        </div>
      </div>
    </dialog>
  );
}
