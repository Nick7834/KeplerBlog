import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { IoIosWarning, IoMdCloseCircle } from "react-icons/io";
import { IoPeopleSharp } from "react-icons/io5";
import { BiSolidLike } from "react-icons/bi";
import { BsFillPostcardFill } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { differenceInDays } from "date-fns";
import { FaImagePortrait } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BiSolidUserAccount } from "react-icons/bi";
import { Oval } from "react-loader-spinner";
import { LuPartyPopper } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";

interface Props {
  className?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string;
}

interface Condition {
  label: string;
  current: number;
  required: number;
  icon: React.ReactNode;
}

const fetchUser = async (id: string) => {
  const response = await axios.get(`/api/user/${id}/info`);
  return response.data;
};

export const ModalVerification: React.FC<Props> = ({
  className,
  setOpen,
  open,
  userId,
}) => {
  const { data: session } = useSession();

  const { data: user, isLoading: loaderProfile } = useQuery({
    queryKey: ["info", userId],
    queryFn: () => fetchUser(userId),
    enabled: open && !!session?.user?.id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const accountAge =
    user && differenceInDays(new Date(), new Date(user.createdAt || 0));

  const conditions: Condition[] = user && [
    {
      label: "Followers",
      current: user?._count.following,
      required: 20,
      icon: <IoPeopleSharp size={20} />,
    },
    {
      label: "Likes",
      current: user?.posts.reduce(
        (total: number, post: { _count: { likes: number } }) =>
          total + post._count.likes,
        0
      ),
      required: 400,
      icon: <BiSolidLike size={20} />,
    },
    {
      label: "Posts",
      current: user?._count.posts,
      required: 10,
      icon: <BsFillPostcardFill size={20} />,
    },
    {
      label: "Account Age",
      current: accountAge,
      required: 30,
      icon: <FaImagePortrait size={20} />,
    },
    {
      label: "Verified Email",
      current: user?.isverifiedEmail,
      required: false,
      icon: <MdVerified size={20} />,
    },
    {
      label: "Active Account (Last 7 Days)",
      current: user?.isActive,
      required: false,
      icon: <BiSolidUserAccount size={20} />,
    },
  ];

  const allConditionsMet =
    user &&
    conditions?.every((condition) =>
      typeof condition.required === "number"
        ? condition.current >= condition.required
        : !!condition.current
    );

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent
        className={cn(
          "flex flex-col w-full max-w-[95%] sm:max-w-xl p-4 mx-auto backdrop-blur-[12px] bg-[#e6e6e6]/80 dark:bg-[#19191b]/60 rounded-md max-h-[90vh] overflow-y-auto",
          className
        )}
      >
        {loaderProfile || !user ? (
          <div className="flex items-center justify-center w-full h-[520px]">
            <DialogTitle className="hidden"></DialogTitle>
            <Oval
              visible={true}
              height="50"
              width="50"
              color="#7391d5"
              secondaryColor="#7391d5"
              ariaLabel="oval-loading"
              strokeWidth={4}
            />
          </div>
        ) : user.isverified ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-3 w-full h-[520px] text-[#22c55e]"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <FiCheckCircle size={60} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <DialogTitle className="text-center text-[#22c55e] text-xl font-medium">
                Your account has been confirmed!
              </DialogTitle>
            </motion.div>
          </motion.div>
        ) : (
          <>
            <DialogTitle className="text-center text-[#333333] dark:text-[#d9d9d9] text-xl font-bold">
              To get verified, complete the following requirements:
            </DialogTitle>

            {user &&
              conditions.map((cond, index) => {
                const progress = Math.min(
                  (cond.current / cond.required) * 100,
                  100
                );

                return (
                  <div key={index} className="mb-3">
                    <p className="flex items-center justify-between mb-1 text-base text-[#333333] dark:text-[#d9d9d9]">
                      <span className="flex items-center gap-1">
                        {cond.icon} {cond.label}
                      </span>
                      {cond.label === "Verified Email" ||
                      cond.label === "Active Account (Last 7 Days)" ? (
                        cond.current ? (
                          <IoIosCheckmarkCircleOutline
                            size={20}
                            className="text-green-500"
                          />
                        ) : (
                          <IoMdCloseCircle size={20} className="text-red-500" />
                        )
                      ) : (
                        <>
                          {cond.current}/{cond.required} ({Math.round(progress)}
                          %)
                        </>
                      )}
                    </p>

                    {cond.label !== "Verified Email" &&
                      cond.label !== "Active Account (Last 7 Days)" && (
                        <div className="w-full bg-gray-300 rounded-full h-3">
                          <motion.div
                            className="h-3 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.7 }}
                          />
                        </div>
                      )}
                  </div>
                );
              })}

            {allConditionsMet && (
              <span className="flex items-start gap-1 text-xs text-center text-[#22c55e]">
                <LuPartyPopper size={20} />
                Congratulations! All requirements have been successfully met.
                Your account will be reviewed shortly. Please await
                confirmation.
              </span>
            )}

            <p className="text-sm text-center text-[#333333] dark:text-[#d9d9d9]">
              The badge will be granted automatically within 2 days once all
              requirements are met.
            </p>

            <span className="flex items-center gap-[1px] text-[10px] text-center text-[#797d7e] dark:text-[#e3e3e3]">
              <IoIosWarning size={15} />
              Verification on KeplerBlog is only available through legitimate
              means. Any attempt to manipulate stats may result in account
              suspension.
            </span>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
