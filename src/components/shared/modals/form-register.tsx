"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormRegister, formRegisterSchema } from "./shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form } from "..";
import { toast } from "react-hot-toast";
import { registerUser } from "@/app/authProfile";
import { signIn } from "next-auth/react";
import { useStatusFollow, useStatusLike } from "@/store/status";
import { Turnstile } from "@marsidev/react-turnstile";

interface Props {
  onClose: () => void;
}

export const FormsRegister: React.FC<Props> = ({ onClose }) => {
  const { setStatusLike } = useStatusLike();
  const { setStatusFollow } = useStatusFollow();
  const [captchaToken, setCaptchaToken] = useState("");

  const form = useForm<FormRegister>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      repeatPassword: "",
    },
  });

  const onsubmit = async (data: FormRegister) => {
    if (!captchaToken) {
      toast.error("Please complete the captcha");
      return;
    }
    try {
      await registerUser(
        {
          email: data.email,
          username: data.username,
          password: data.password,
        }
      );

      const resp = await signIn("credentials", {
        email: data.email,
        password: data.password,
        captchaToken: captchaToken,
        redirect: false,
      });

      if (!resp?.ok) {
        throw new Error("Something went wrong");
      }

      setStatusLike(true);
      setStatusFollow(true);

      onClose?.();

      toast.success("Registered successfully");
    } catch (error) {
      console.warn(error);
      toast.error("Something went wrong");
    }
  };

  return (
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
          name="username"
          label="Name"
          type="text"
          required
        />
        <Form
          name="password"
          label="Password"
          type="password"
          required
        />
        <Form
          name="repeatPassword"
          label="Repeat password"
          type="password"
          required
        />
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={(token) => setCaptchaToken(token)}
        />
        <Button
          className="w-full"
          type="submit"
          loading={form.formState.isSubmitting}
        >
          Register
        </Button>
      </form>
    </FormProvider>
  );
};
