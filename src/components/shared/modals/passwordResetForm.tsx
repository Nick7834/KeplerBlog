"use client";

import { usePasswordReset } from "@/store/usePasswordReset";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  ResetPassword,
  resetPasswordEmail,
  ResetPasswordEmail,
  resetPasswordSchema,
} from "./shema";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button, Form } from "..";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Props {
  className?: string;
  setForgotPassword?: React.Dispatch<React.SetStateAction<boolean>>;
  emailUser?: string;
  onClose?: () => void;
}

export const PasswordResetForm: React.FC<Props> = ({ className, setForgotPassword, emailUser, onClose }) => {
  const {data: session} = useSession();
  const { step, nextStep, reset } = usePasswordReset();

  const useFormMethods = useForm<ResetPasswordEmail>({
    resolver: zodResolver(resetPasswordEmail),
    defaultValues: {
      email: "",
    },
  });

  const useFormPasswordMethods = useForm<ResetPassword>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
  });

  const [code, setCode] = useState("");
  const [loader, setLoader] = useState<boolean>(false);

  const handleRequestReset = async (data: ResetPasswordEmail) => {
    if (!data.email) return;

    try {
      const resp = await axios.post("/api/send-otp-reset", {
        email: data.email,
      });

      if (resp.status === 200) {
        nextStep();
      }
    } catch (error) {
      console.warn(error);
      toast.error("Something went wrong");
    }
  };

  const handleCodeEmail = async (code: string) => {
    if (code.length === 6) {
      setLoader(true);
      try {
        const email = session ? emailUser : useFormMethods.getValues("email");

        const resp = await axios.post("/api/verify-otp-reset", {
          email: email,
          code,
        });

        if (resp.status === 200) {
          nextStep();
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setLoader(false);
      }
    }
  };

  const handlePasswordReset = async (data: ResetPassword) => {
    if(!data.password || !data.repeatPassword) return;

    try {
      const email = session ? emailUser : useFormMethods.getValues("email");

      const resp = await axios.put("/api/reset-password", {
        email: email,
        code,
        password: data.password,
      });

      if (resp.status === 200) {
        toast.success("Password reset successfully");
        reset()
        if(setForgotPassword) setForgotPassword(false);
        if(onClose) onClose();
      }

    } catch (error) {
      console.warn(error);
      toast.error("Something went wrong");
    }
    
  };

  return (
    <div className={className}>
      {step === "email" && (
        <FormProvider {...useFormMethods}>
          <form onSubmit={useFormMethods.handleSubmit(handleRequestReset)}>
            <h2 className="text-base mb-3 text-center">
              Please enter your email. We will send a confirmation code to it.
            </h2>
            <Form
              name="email"
              label="Email"
              labelOff={true}
              placeholder="Email"
              required
            />
            <Button
              disabled={!useFormMethods.formState.isValid}
              className="w-full mt-5"
              type="submit"
              loading={useFormMethods.formState.isSubmitting}
            >
              Continue
            </Button>
          </form>
        </FormProvider>
      )}

      {step === "code" && (
        <div className="flex flex-col gap-5">
          <h2 className="text-center text-[#333333] dark:text-[#d9d9d9] text-base font-bold">
            A code has been sent to your email
          </h2>

          <div className="flex flex-col justify-center items-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => {
                if (/^\d*$/.test(value)) {
                  setCode(value);
                }
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="w-12 h-12 text-xl text-center border-[#333333] bg-transparent dark:bg-transparent dark:border-white"
                />
                <InputOTPSlot
                  index={1}
                  className="w-12 h-12 text-xl text-center border-[#333333] bg-transparent dark:bg-transparent dark:border-white"
                />
                <InputOTPSlot
                  index={2}
                  className="w-12 h-12 text-xl text-center border-[#333333] bg-transparent dark:bg-transparent dark:border-white"
                />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot
                  index={3}
                  className="w-12 h-12 text-xl text-center border-[#333333] bg-transparent dark:bg-transparent dark:border-white"
                />
                <InputOTPSlot
                  index={4}
                  className="w-12 h-12 text-xl text-center border-[#333333] bg-transparent dark:bg-transparent dark:border-white"
                />
                <InputOTPSlot
                  index={5}
                  className="w-12 h-12 text-xl text-center border-[#333333] bg-transparent dark:bg-transparent dark:border-white"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            disabled={code.length !== 6}
            className="w-full mt-5"
            type="submit"
            loading={loader}
            onClick={() => handleCodeEmail(code)}
          >
            Verify
          </Button>
        </div>
      )}

      {step === "newPassword" && (
        <div className="flex flex-col gap-5">
          <h2 className="text-center text-[#333333] dark:text-[#d9d9d9] text-base font-bold">
            Please enter your new password
          </h2>
          <FormProvider {...useFormPasswordMethods}>
            <form
              onSubmit={useFormPasswordMethods.handleSubmit(
                handlePasswordReset
              )}
            >
              <div className="flex flex-col gap-5">
                <Form
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Password"
                    labelOff={true}
                    required
                />
                <Form
                    name="repeatPassword"
                    label="Reset password"
                    type="password"
                    placeholder="Repeat password"
                    labelOff={true}
                    required
                />
              </div>
              <Button
                className="w-full mt-5"
                type="submit"
                loading={useFormPasswordMethods.formState.isSubmitting}
              >
                Continue
              </Button>
            </form>
          </FormProvider>
        </div>
      )}
    </div>
  );
};
