import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { FormsLogin, FormsRegister } from "..";
import { PasswordResetForm } from "./passwordResetForm";
import { IoIosArrowBack } from "react-icons/io";
import { usePasswordReset } from "@/store/usePasswordReset";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AutchModal: React.FC<Props> = ({ open, onClose }) => {
  const [type, setType] = useState<"login" | "register">("login");
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const { reset } = usePasswordReset();

  const onClickSwitch = () => {
    setType((prev) => (prev === "login" ? "register" : "login"));
  };

  const handleClose = () => {
    onClose();
  };

  const handleCloseReset = () => {
    const confirm = window.confirm(
      "Are you sure you want to close the reset password modal?"
    );

    if (confirm) {
      setForgotPassword(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="w-full max-w-[95%] sm:max-w-md p-4 mx-auto 
            bg-[#bababa] dark:bg-[#19191b] rounded-md max-h-[90vh] overflow-y-auto"
      >
        {forgotPassword && (
          <>
            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                className="absolute left-[1rem] top-[1rem] p-0 bg-0 h-fit border-0 hover:bg-0 [&_svg]:size-[25px]"
                onClick={handleCloseReset}
              >
                <IoIosArrowBack />
              </Button>
              <DialogTitle className="text-center text-[#333333] dark:text-[#d9d9d9] text-xl font-bold">
                Reset Password
              </DialogTitle>
            </div>
            <PasswordResetForm setForgotPassword={setForgotPassword} />
          </>
        )}

        {!forgotPassword && (
          <>
            <DialogTitle className="text-center text-[#333333] dark:text-[#d9d9d9] text-xl font-bold">
              Welcome to KeplerBlog
            </DialogTitle>

            <div>
              <div className="flex items-center justify-center gap-5">
                <Button
                  onClick={() =>
                    signIn("github", { callbackUrl: "/", redirect: true })
                  }
                  variant="outline"
                  className="w-full flex items-center gap-2 border border-solid border-[#333333] dark:border-[#d9d9d9] bg-neutral-300/75 dark:bg-neutral-800/75 hover:bg-neutral-200/70 hover:dark:bg-neutral-700/70"
                >
                  <FaGithub /> Github
                </Button>
                <Button
                  onClick={() =>
                    signIn("google", { callbackUrl: "/", redirect: true })
                  }
                  variant="outline"
                  className="w-full flex items-center gap-2 border border-solid border-[#333333] dark:border-[#d9d9d9] bg-neutral-300/75 dark:bg-neutral-800/75 hover:bg-neutral-200/70 hover:dark:bg-neutral-700/70"
                >
                  <FcGoogle />
                  Google
                </Button>
              </div>
            </div>

            {type === "login" ? (
              <FormsLogin
                onClose={onClose}
                setForgotPassword={setForgotPassword}
                forgotPassword={forgotPassword}
              />
            ) : (
              <FormsRegister onClose={onClose} />
            )}

            <Button
              onClick={onClickSwitch}
              variant="link"
              className="text-[#333333] dark:text-[#d9d9d9] text-base font-medium hover:no-underline"
            >
              {type === "login" ? "Register" : "Login"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
