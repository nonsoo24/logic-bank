import { Controller } from 'react-hook-form';
import { OTPInput } from '@/shared/components';
import { CheckMark } from '@/assets/svg';
import type { Control, FieldErrors } from 'react-hook-form';
import type { IdentityDocumentFormData } from '../schema';

interface OtpSectionProps {
  control: Control<IdentityDocumentFormData>;
  errors: FieldErrors<IdentityDocumentFormData>;
  isVerifying: boolean;
  isResending: boolean;
  isOtpVerified: boolean;
  otpError: string | null;
  countdown: number;
  hasResentCode: boolean;
  maskedPhone: string;
  maskedEmail: string;
  onResend: () => void;
  onCancelRequest: () => void;
}

export function OtpSection({
  control,
  errors,
  isVerifying,
  isResending,
  isOtpVerified,
  otpError,
  countdown,
  hasResentCode,
  maskedPhone,
  maskedEmail,
  onResend,
  onCancelRequest,
}: OtpSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3">
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <OTPInput
                label="Phone number verification"
                value={field.value}
                onChange={field.onChange}
                error={errors.otp?.message || otpError || undefined}
                isLoading={isVerifying}
                disabled={isVerifying || isOtpVerified}
                onCancelRequest={onCancelRequest}
              />
            )}
          />
          {isOtpVerified && <img src={CheckMark} alt="Verified" className="w-6 h-6" />}
        </div>

        {!isOtpVerified && (
          <div className="flex items-center gap-1 text-sm whitespace-nowrap mt-2 sm:mt-6">
            <span className="text-neutral-600">Didn't receive OTP?</span>
            {!hasResentCode && countdown < 1 && !isResending && (
              <button
                type="button"
                onClick={onResend}
                className="text-primary font-medium hover:underline cursor-pointer underline"
              >
                Resend code
              </button>
            )}
            {isResending && (
              <span className="text-primary font-medium flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                Sending...
              </span>
            )}
            {!hasResentCode && countdown > 0 && !isResending && (
              <span className="text-primary font-medium underline">
                Resend in {`0:${countdown.toString().padStart(2, '0')}`} secs
              </span>
            )}
            {hasResentCode && !isResending && (
              <span className="text-primary font-medium">Code resent!</span>
            )}
          </div>
        )}
      </div>

      <p className="text-[18px] text-black font-light mt-1">
        Kindly input the 6-digit OTP sent to your registered phone number {maskedPhone} and email
        address {maskedEmail}
      </p>
    </div>
  );
}
