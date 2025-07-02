import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React from "react";
import { PasswordResetForm } from "../modals/passwordResetForm";
import { User } from "@prisma/client";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User;
}

export const ModalReset: React.FC<Props> = ({ open, onClose, user }) => {
  const handleClose = () => {
    const confirm = window.confirm(
      "Are you sure you want to close the reset password modal?"
    );

    if (confirm) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="w-full max-w-[95%] sm:max-w-md p-4 mx-auto 
              backdrop-blur-[12px] bg-[#e6e6e6]/80 dark:bg-[#19191b]/60 rounded-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-center">
          <DialogTitle className="text-center text-[#333333] dark:text-[#d9d9d9] text-xl font-bold">
            Reset Password
          </DialogTitle>
        </div>
        <PasswordResetForm emailUser={user.email} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
