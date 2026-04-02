import type { RefObject } from 'react';
import { Link } from 'react-router-dom';
import type { FieldConfig } from '@/shared/form';
import type { FileUploadHandle } from '@/shared/components';
import type { IdentityDocumentFormData } from '../schema';
import {
  documentTypeOptions,
  occupationOptions,
  natureOfBusinessOptions,
  annualTurnOverOptions,
} from '../schema';
import { ROUTES, FLOW_STEPS, type FlowStep } from '@/shared/constants';

/**
 * Configuration options for building the identity document form fields.
 * These are passed from the page component to keep business logic there.
 */
export interface FormConfigOptions {
  // Current flow step
  currentStep: FlowStep;

  // Refs for file upload controls
  documentFrontRef: RefObject<FileUploadHandle | null>;
  documentBackRef: RefObject<FileUploadHandle | null>;
  utilityBillRef: RefObject<FileUploadHandle | null>;

  // External file values from store
  documentFront: File | null;
  documentBack: File | null;
  utilityBill: File | null;

  // File uploaded flags
  documentFrontUploaded: boolean;
  documentBackUploaded: boolean;
  utilityBillUploaded: boolean;

  // File change handlers
  setDocumentFront: (file: File | null) => void;
  setDocumentBack: (file: File | null) => void;
  setUtilityBill: (file: File | null) => void;

  // Modal triggers for file uploads
  onDocumentFrontBeforeUpload: () => boolean | void;
  onDocumentBackBeforeUpload: () => boolean | void;
  onUtilityBillBeforeUpload: () => boolean | void;

  // Terms handlers
  acceptTerms: () => void;
  rejectTerms: () => void;
}

/**
 * Builds the document upload fields configuration (Step 1: DOCUMENTS)
 */
export function getDocumentFields(
  options: FormConfigOptions
): FieldConfig<IdentityDocumentFormData>[] {
  const isOutstandingStep = options.currentStep === FLOW_STEPS.OUTSTANDING;

  return [
    {
      name: 'nin',
      type: 'text',
      props: {
        label: 'NIN',
        placeholder: 'Enter your NIN',
        maxLength: 11,
        numbersOnly: true,
      },
      disabled: isOutstandingStep,
    },
    {
      name: 'documentType',
      type: 'select',
      props: {
        label: 'Identity Document type',
        placeholder: 'Choose Identity Document type',
        options: documentTypeOptions,
      },
      disabled: isOutstandingStep,
    },
    {
      name: 'documentNumber',
      type: 'text',
      props: {
        label: 'Identity Document number',
        placeholder: 'Enter the Identity Document number',
      },
      disabled: isOutstandingStep,
    },
  ];
}

/**
 * Builds the file upload fields configuration (part of Step 1: DOCUMENTS)
 */
export function getFileUploadFields(
  options: FormConfigOptions
): FieldConfig<IdentityDocumentFormData>[] {
  const isOutstandingStep = options.currentStep === FLOW_STEPS.OUTSTANDING;

  return [
    {
      name: 'documentFront',
      type: 'file',
      ref: options.documentFrontRef,
      externalValue: options.documentFront,
      onFileChange: options.setDocumentFront,
      onBeforeUpload: options.onDocumentFrontBeforeUpload,
      props: {
        label: 'Upload your Identity Document (Front)',
      },
      disabled: isOutstandingStep || options.documentFrontUploaded,
    },
    {
      name: 'documentBack',
      type: 'file',
      ref: options.documentBackRef,
      externalValue: options.documentBack,
      onFileChange: options.setDocumentBack,
      onBeforeUpload: options.onDocumentBackBeforeUpload,
      props: {
        label: 'Back',
      },
      disabled: isOutstandingStep || options.documentBackUploaded,
    },
  ];
}

/**
 * Builds the utility bill field configuration
 */
export function getUtilityBillField(
  options: FormConfigOptions
): FieldConfig<IdentityDocumentFormData> {
  const isOutstandingStep = options.currentStep === FLOW_STEPS.OUTSTANDING;

  return {
    name: 'utilityBill',
    type: 'file',
    ref: options.utilityBillRef,
    externalValue: options.utilityBill,
    onFileChange: options.setUtilityBill,
    onBeforeUpload: options.onUtilityBillBeforeUpload,
    props: {
      label: 'Upload your Utility Bill',
    },
    disabled: isOutstandingStep || options.utilityBillUploaded,
  };
}

/**
 * Builds the terms checkbox field configuration
 */
export function getTermsCheckboxField(
  options: FormConfigOptions
): FieldConfig<IdentityDocumentFormData> {
  const isOutstandingStep = options.currentStep === FLOW_STEPS.OUTSTANDING;

  return {
    name: 'acceptTerms',
    type: 'checkbox',
    children: (
      <span>
        Accept{' '}
        <Link to={ROUTES.TERMS} className="text-primary font-medium underline">
          Terms & Conditions
        </Link>
      </span>
    ),
    onCheckedChange: (checked) => {
      if (checked) {
        options.acceptTerms();
      } else {
        options.rejectTerms();
      }
    },
    disabled: isOutstandingStep,
  };
}

/**
 * Builds the outstanding information fields configuration (Step 2: OUTSTANDING)
 */
export function getOutstandingInfoFields(): FieldConfig<IdentityDocumentFormData>[] {
  return [
    {
      name: 'occupation',
      type: 'select',
      props: {
        label: 'Occupation',
        placeholder: 'Select your occupation',
        options: occupationOptions,
        required: true,
      },
    },
    {
      name: 'natureOfBusiness',
      type: 'select',
      props: {
        label: 'Nature of Business',
        placeholder: 'Select nature of business',
        options: natureOfBusinessOptions,
        required: true,
      },
    },
    {
      name: 'employerName',
      type: 'text',
      props: {
        label: 'Employer Name',
        placeholder: 'Enter your employer name',
      },
    },
    {
      name: 'employerAddress',
      type: 'text',
      props: {
        label: 'Employer Address',
        placeholder: 'Enter your employer address',
      },
    },
    {
      name: 'annualTurnOver',
      type: 'select',
      props: {
        label: 'Annual Turn-Over',
        placeholder: 'Select annual turn-over',
        options: annualTurnOverOptions,
      },
    },
  ];
}
