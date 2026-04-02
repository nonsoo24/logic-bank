import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * In-memory store for file uploads.
 * NOT persisted to localStorage because File objects cannot be serialized.
 * Files survive navigation within the session but are lost on page refresh.
 */

interface FileUploadState {
  documentFront: File | null;
  documentBack: File | null;
  utilityBill: File | null;

  // Persisted upload flags
  documentFrontUploaded: boolean;
  documentBackUploaded: boolean;
  utilityBillUploaded: boolean;

  // Actions
  setDocumentFront: (file: File | null) => void;
  setDocumentBack: (file: File | null) => void;
  setUtilityBill: (file: File | null) => void;
  clearFiles: () => void;
}

const initialState = {
  documentFront: null,
  documentBack: null,
  utilityBill: null,
  documentFrontUploaded: false,
  documentBackUploaded: false,
  utilityBillUploaded: false,
};

export const useFileUploadStore = create<FileUploadState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setDocumentFront: (file) =>
          set(
            file
              ? { documentFront: file, documentFrontUploaded: true }
              : { documentFront: null, documentFrontUploaded: false },
            false,
            'setDocumentFront'
          ),

        setDocumentBack: (file) =>
          set(
            file
              ? { documentBack: file, documentBackUploaded: true }
              : { documentBack: null, documentBackUploaded: false },
            false,
            'setDocumentBack'
          ),

        setUtilityBill: (file) =>
          set(
            file
              ? { utilityBill: file, utilityBillUploaded: true }
              : { utilityBill: null, utilityBillUploaded: false },
            false,
            'setUtilityBill'
          ),

        clearFiles: () => set(initialState, false, 'clearFiles'),
      }),
      {
        name: 'FileUploadStore',
        partialize: (state) => ({
          documentFrontUploaded: state.documentFrontUploaded,
          documentBackUploaded: state.documentBackUploaded,
          utilityBillUploaded: state.utilityBillUploaded,
        }),
      }
    ),
    { name: 'FileUploadStore' }
  )
);
