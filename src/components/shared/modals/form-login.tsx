"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormLogin, formLoginSchema } from "./shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form } from "..";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useStatusFollow, useStatusLike } from "@/store/status";
import { useInvalidateQueriesOnAuth } from "@/lib/autch-utils";

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

  const form = useForm<FormLogin>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { invalidateAllQueries } = useInvalidateQueriesOnAuth()

  const onsubmit = async (data: FormLogin) => {
    try {
      const resp = await signIn("credentials", { ...data, redirect: false });

      if (!resp?.ok) {
        throw Error();
      }

      setStatusLike(true);
      setStatusFollow(true);

      invalidateAllQueries()

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
          <Form name="email" label="Email" required />
          <Form name="password" label="Password" type="password" required />

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
