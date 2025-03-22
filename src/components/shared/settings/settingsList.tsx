"use client";
import { UseDarkMode } from "@/components/hooks/useDarkMode";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import React, { useState } from "react";
import { SettingsEdit } from "..";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { FormUpdate, formUpdateSchema } from "../modals/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { updateUserProfile } from "@/app/authProfile";
import axios from "axios";
import { signOut } from "next-auth/react";
import { ModalCheck } from "../modalCheck";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { cn } from "@/lib/utils";
import { ModalVerification } from "../modalVerification/modalVerification";
import { ModalReset } from "./modalReset";
import { usePasswordReset } from "@/store/usePasswordReset";

interface Props {
  className?: string;
  user: User;
}

export const SettingsList: React.FC<Props> = ({ className, user }) => {
  const { nextStep, reset } = usePasswordReset();
  const [loaderReset, setLoaderReset] = useState<boolean>(false);

  const [openVerificationModal, setOpenVerificationModal] =
    useState<boolean>(false);

  const [openCheckModal, setOpenCheckModal] = useState<boolean>(false);
  const [loaderCode, setLoaderCode] = useState<boolean>(false);

  const [isverifiedEmailState, setIsverifiedEmailState] = useState<boolean>(
    user?.isverifiedEmail ?? false
  );

  const [isLoading, setIsLoading] = useState(false);

  const [openModalRest, setOpenModalRest] = useState<boolean>(false);

  const [userData, setUserData] = useState<User>({
    ...user,
    bio: user?.bio ?? "",
  });

  const formUpdate = useForm<FormUpdate>({
    resolver: zodResolver(formUpdateSchema),
    defaultValues: {
      bio: user?.bio ?? "",
      email: user?.email ?? "",
      username: user?.username ?? "",
    },
  });

  const { handleSubmit, control } = formUpdate;

  const onSubmit = async (data: FormUpdate) => {
    try {
      if (
        data.email === user?.email &&
        data.username === user?.username &&
        data.bio === user?.bio
      ) {
        toast.error("No changes detected.");
        return;
      }

      await updateUserProfile(data);

      setUserData({
        ...userData,
        bio: data.bio ?? "",
        email: data.email,
        username: data.username,
      });

      if (data.email !== user?.email) {
        setIsverifiedEmailState(false);
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const { theme, handleToggle } = UseDarkMode();

  const handleDelete = async () => {
    if (!user) return;

    setIsLoading(true);

    const userInput = window.prompt(
      `To confirm deletion, please type your account username (${user.username}):`
    );

    if (userInput !== user.username) {
      toast.error("Invalid username");
      setIsLoading(false);
      return;
    }

    const lastModal = window.confirm(
      `Are you sure you want to delete your account? This action cannot be undone.`
    );

    if (!lastModal) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.delete("/api/user/delete");
      if (res.status === 201) {
        await signOut();
        toast.success("Account deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = async () => {
    setLoaderCode(true);
    try {
      const resp = await axios.post("/api/send-otp", { email: user?.email });

      if (resp.status === 200) {
        setLoaderCode(false);
        setOpenCheckModal(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoaderCode(false);
    }
  };

  const handleReset = async () => {
    if (!user.email) return;

    const confirmReset = window.confirm(
      `Are you sure you want to reset your password?`
    );

    if (!confirmReset) return;

    setLoaderReset(true);

    try {
      const resp = await axios.post("/api/send-otp-reset", {
        email: user.email,
      });

      if (resp.status === 200) {
        nextStep();
        setOpenModalRest(!openModalRest);
      }
    } catch (error) {
      console.warn(error);
      toast.error("Something went wrong");
    } finally {
      setLoaderReset(false);
    }
  };

  return (
    <div className={className}>
      <ul className="ul-settings flex flex-col gap-4 mt-12">
        <li className="settings-grid grid grid-cols-[200px_1fr] items-center">
          <span className=" text-[#333333] dark:text-[#d9d9d9] text-lg font-medium">
            Description
          </span>
          <SettingsEdit
            nameProfile={userData?.bio ?? ""}
            name="bio"
            control={control}
            onSubmit={handleSubmit(onSubmit)}
          />
        </li>
        <li
          className={cn(
            "flex items-center gap-2",
            !isverifiedEmailState &&
              "max-[600px]:flex-col max-[600px]:items-start"
          )}
        >
          <div className="settings-grid grid grid-cols-[200px_1fr] items-center">
            <span className="text-[#333333] dark:text-[#d9d9d9] text-lg font-medium">
              Email
            </span>
            <SettingsEdit
              nameProfile={userData!.email}
              name="email"
              control={control}
              onSubmit={handleSubmit(onSubmit)}
            />
          </div>

          {!isverifiedEmailState ? (
            <Button
              onClick={handleOpen}
              variant="outline"
              loading={loaderCode}
              className="px-4 w-fit min-w-[120px] border-0 text-[#d9d9d9] dark:text-[#d9d9d9] font-medium transition-all ease-in-out duration-[.3s] hover:text-[#d9d9d9] hover:dark:text-[#d9d9d9] hover:bg-[#7391d5] bg-[#7391d5] dark:bg-[#7391d5] hover:bg-[#7391d5]/85 dark:hover:bg-[#7391d5]/85"
            >
              Confirm Email
            </Button>
          ) : (
            <span>
              <IoMdCheckmarkCircle
                size={22}
                className="text-[#7391d5] bg-white rounded-full"
              />
            </span>
          )}
        </li>
        <li className="settings-grid grid grid-cols-[200px_1fr] items-center">
          <span className=" text-[#333333] dark:text-[#d9d9d9] text-lg font-medium">
            Name
          </span>
          <SettingsEdit
            nameProfile={userData!.username}
            name="username"
            control={control}
            onSubmit={handleSubmit(onSubmit)}
          />
        </li>
        <li className="settings-grid grid grid-cols-[200px_1fr] items-center">
          <span className=" text-[#333333] dark:text-[#d9d9d9] text-lg font-medium">
            Thema
          </span>
          <Switch checked={theme === "dark"} onCheckedChange={handleToggle} />
        </li>
        <li className="settings-grid grid grid-cols-[200px_1fr] items-center">
          <span className="text-[#333333] dark:text-[#d9d9d9] text-lg font-medium">
            Verification
          </span>
          <Button
            onClick={() => setOpenVerificationModal(!openVerificationModal)}
            className="min-w-[100px] max-w-[100px] px-[30px]"
          >
            Learn More
          </Button>
        </li>
        <li className="settings-grid grid grid-cols-[200px_1fr] items-center">
          <span className=" text-[#333333] dark:text-[#d9d9d9] text-lg font-medium">
            Password
          </span>
          <Button
            loading={loaderReset}
            onClick={handleReset}
            className="min-w-[150px] max-w-[100px] px-[30px]"
          >
            Reset Password
          </Button>
        </li>
        <li className="settings-grid grid grid-cols-[200px_1fr] items-center">
          <span className=" text-[#333333] dark:text-[#d9d9d9] text-lg font-medium">
            Delete account
          </span>
          <Button
            loading={isLoading}
            onClick={handleDelete}
            className="min-w-[100px] max-w-[100px] px-[30px] bg-[#F03535] text-[#d9d9d9] hover:bg-[#F03535]/70"
          >
            Delete
          </Button>
        </li>
      </ul>

      <ModalCheck
        open={openCheckModal}
        setOpen={setOpenCheckModal}
        email={user.email}
        setIsverifiedEmailState={setIsverifiedEmailState}
      />
      <ModalVerification
        setOpen={setOpenVerificationModal}
        open={openVerificationModal}
        userId={user.id}
      />
      <ModalReset
        open={openModalRest}
        onClose={() => (setOpenModalRest(!openModalRest), reset())}
        user={user}
      />
    </div>
  );
};
