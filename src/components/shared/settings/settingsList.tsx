"use client";
import { UseDarkMode } from "@/components/hooks/useDarkMode";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import React, { useState } from "react";
import { SettingsEdit } from "..";
import { MessagesPrivacy, User } from "@prisma/client";
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
import { CgProfile } from "react-icons/cg";
import { GrShieldSecurity } from "react-icons/gr";
import { SiPrivateinternetaccess } from "react-icons/si";
import { HiLightBulb } from "react-icons/hi";
import { TbMessageCog } from "react-icons/tb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const onSubmit = async (data: FormUpdate & { messagePrivate?: MessagesPrivacy }) => {
    try {
      if (
        data.email === user?.email &&
        data.username === user?.username &&
        data.bio === user?.bio &&
        data.messagePrivate === user?.messagePrivate
      ) {
        toast.error("No changes detected.");
        return;
      }

      await updateUserProfile({
        ...data,
        messagePrivate: data?.messagePrivate,
      });

      setUserData({
        ...userData,
        bio: data.bio ?? "",
        email: data.email,
        username: data.username,
        messagePrivate: data.messagePrivate ?? user?.messagePrivate,
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

  const settingsSections = [
    {
      title: "Profile",
      icon: <CgProfile />,
      items: [
        {
          label: "Description",
          component: (
            <SettingsEdit
              nameProfile={userData?.bio ?? ""}
              name="bio"
              control={control}
              onSubmit={handleSubmit(onSubmit)}
            />
          ),
        },
        {
          label: "Email",
          component: (
            <>
              <SettingsEdit
                nameProfile={userData!.email}
                name="email"
                control={control}
                onSubmit={handleSubmit(onSubmit)}
              />
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
                <IoMdCheckmarkCircle
                  size={22}
                  className="text-[#7391d5] bg-white rounded-full max-[750px]:absolute max-[750px]:-right-[30px] max-[750px]:top-0"
                />
              )}
            </>
          ),
        },
        {
          label: "Name",
          component: (
            <SettingsEdit
              nameProfile={userData!.username}
              name="username"
              control={control}
              onSubmit={handleSubmit(onSubmit)}
            />
          ),
        },
      ],
    },
    {
      title: "Safety",
      icon: <GrShieldSecurity />,
      items: [
        {
          label: "Verification",
          component: (
            <Button
              onClick={() => setOpenVerificationModal(!openVerificationModal)}
              className="min-w-[100px] max-w-[100px] px-[30px]"
            >
              Learn More
            </Button>
          ),
        },
        {
          label: "Password",
          component: (
            <Button
              loading={loaderReset}
              onClick={handleReset}
              className="min-w-[150px] max-w-[100px] px-[30px]"
            >
              Reset Password
            </Button>
          ),
        },
      ],
    },
    {
      title: "Messages",
      icon: <TbMessageCog />,
      items: [
        {
          label: "Who can message me",
          component: (
            <div className="block">
              <Select
                onValueChange={(value: MessagesPrivacy) => {
                  onSubmit({
                    ...formUpdate.getValues(),
                    messagePrivate: value,
                  });
                }}
              >
                <SelectTrigger className="w-[180px] text-base font-medium">
                  <SelectValue
                    placeholder={
                      user.messagePrivate !== "All" ? "On request" : "All users"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="All"
                    className="cursor-pointer"
                  >
                    All users
                  </SelectItem>
                  <SelectItem
                    value="Request"
                    className="cursor-pointer"
                  >
                    On request
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          ),
        },
      ],
    },
    {
      title: "Theme",
      icon: <HiLightBulb />,
      items: [
        {
          label: "Theme",
          component: (
            <Switch
              checked={theme === "dark"}
              onCheckedChange={handleToggle}
            />
          ),
        },
      ],
    },
    {
      title: "Privacy",
      icon: <SiPrivateinternetaccess />,
      items: [
        {
          label: "Delete account",
          component: (
            <Button
              loading={isLoading}
              onClick={handleDelete}
              className="min-w-[100px] max-w-[100px] px-[30px] bg-[#F03535] text-[#d9d9d9] hover:bg-[#F03535]/70"
            >
              Delete
            </Button>
          ),
        },
      ],
    },
  ];

  return (
    <div className={cn("mt-10", className)}>
      {settingsSections.map(({ title, icon, items }) => (
        <section
          key={title}
          className="mb-5"
        >
          <h2 className="flex items-center gap-2 text-[22px] font-bold mb-4 capitalize text-[#37383b] dark:text-[#dde3ef]">
            {icon}
            {title}
          </h2>
          <ul className="ul-settings flex flex-col gap-3">
            {items.map(({ label, component }) => (
              <li
                key={label}
                className="settings-grid grid grid-cols-[200px_1fr] items-center"
              >
                <span className="text-[#333333] dark:text-[#d9d9d9] text-lg font-medium">
                  {label}
                </span>
                <div className="relative w-fit flex items-center gap-3 max-[750px]:flex-col max-[750px]:items-start">
                  {component}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

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
