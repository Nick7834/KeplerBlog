"use client";
import React, { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormLogin, formLoginSchema } from "./shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form } from "..";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useStatusFollow, useStatusLike } from "@/store/status";
import { useInvalidateQueriesOnAuth } from "@/lib/autch-utils";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

interface Props {
  onClose: () => void;
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
  forgotPassword: boolean;
}

export const FormsLogin: React.FC<Props> = ({
  onClose,
  setForgotPassword,
  forgotPassword,
}) => {
  const { setStatusLike } = useStatusLike();
  const { setStatusFollow } = useStatusFollow();
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const form = useForm<FormLogin>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { invalidateAllQueries } = useInvalidateQueriesOnAuth();

  const onsubmit = async (data: FormLogin) => {
    if (!captchaToken) {
      toast.error("Please complete the captcha");
      return;
    }

    try {
      const resp = await signIn("credentials", {
        ...data,
        captchaToken,
        redirect: false,
      });

      if (resp?.error) {
        const isRateLimit =
          resp.error.includes("Too many attempts") ||
          resp.error === "RATE_LIMIT_EXCEEDED";

        if (!isRateLimit) {
          turnstileRef.current?.reset();
          setCaptchaToken("");
        }

        toast.error(
          isRateLimit
            ? "Too many attempts. Please try again in a minute."
            : "Invalid email or password"
        );
        return;
      }

      setStatusLike(true);
      setStatusFollow(true);

      invalidateAllQueries();

      onClose();

      toast.success("Logged in successfully");
    } catch (error) {
      console.warn(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <FormProvider {...form}>
        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit(onsubmit)}
        >
          <Form
            name="email"
            label="Email"
            required
          />
          <Form
            name="password"
            label="Password"
            type="password"
            required
          />
          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onSuccess={(token) => setCaptchaToken(token)}
          />
          <Button
            className="w-full"
            type="submit"
            loading={form.formState.isSubmitting}
          >
            Log In
          </Button>
        </form>
      </FormProvider>
      <Button
        variant="link"
        onClick={() => setForgotPassword(!forgotPassword)}
        className="w-fit p-0 h-fit"
      >
        Forgot password?
      </Button>
    </>
  );
};
