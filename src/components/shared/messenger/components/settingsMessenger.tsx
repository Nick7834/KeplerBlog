import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Button } from "../..";
import { useBackgroundQuery } from "../api/background";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useUserAvatar } from "@/store/user";
import { RiResetRightFill } from "react-icons/ri";
import { TbBackground } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { Oval } from "react-loader-spinner";
import { useBackground } from "../hook/background";
import { GeneralSettings } from "./GeneralSettings";

interface Props {
  className?: string;
  userId: string;
  setSettings: (settings: boolean) => void;
}

const buttons = [
  { text: "Chat Wallpaper", point: 0 },
  { text: "General settings", point: 1 },
];

export const SettingsMessenger: React.FC<Props> = ({
  className,
  userId,
  setSettings,
}) => {
  const [point, setPoint] = useState<number>(0);

  const { data, isLoading } = useBackgroundQuery(userId, point);
  const { setBackgroundChat, backgroundChat } = useUserAvatar();

  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    if (data?.customBackgroundChat) {
      setFilePreview(data.customBackgroundChat);
    }
  }, [data?.customBackgroundChat]);

  const { loading, handleBackground, handleFile } = useBackground(
    userId,
    data?.customBackgroundChat,
    setBackgroundChat,
    setFilePreview
  );

  return (
    <div className={cn("flex flex-col h-[90vh]", className)}>
      <h2 className="flex items-center gap-2 text-[#333333] dark:text-[#d9d9d9] text-2xl font-bold">
        <Button
          variant="ghost"
          className="hidden max-[750px]:block p-1 bg-0 hover:bg-0 [&_svg]:size-[25px]"
          onClick={() => setSettings(false)}
        >
          <IoIosArrowBack />
        </Button>
        Settings Messenger
      </h2>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-center">
          {buttons.map((button, index) => (
            <Button
              key={index}
              variant="secondary"
              className={cn(
                "flex-1 mt-5 w-full relative p-1 rounded-b-[0] [&_svg]:size-[25px] bg-transparent border-b-2 border-[#7391d5] dark:border-[#7391d5] transition-all ease-in-out duration-[.3s] hover:bg-transparent dark:hover:",
                point === button.point &&
                  "text-[#d9d9d9] bg-[#7391d5] dark:bg-[#7391d5] border-[#7391d5] dark:border-[#7391d5] hover:bg-[#7391d5]/85 dark:hover:bg-[#7391d5]/85"
              )}
              onClick={() => setPoint(button.point)}
            >
              {button.text}
            </Button>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto scrollbarMessage">
          {point === 0 && (
            <div className="p-2 pt-0">
              <div className="sticky top-0 z-10 p-3 flex items-center gap-2 bg-[#e5e5e5]/80 dark:bg-[#19191b]/60 backdrop-blur-3xl rounded-b-xl">
                <label
                  className="cursor-pointer rounded-md text-sm h-10 w-full flex items-center justify-center gap-2 placeholder:w-full relative p-1 [&_svg]:size-[20px] bg-[#fbfbfb] dark:bg-[#545454] hover:bg-[#fbfbfb] dark:hover:bg-[#676767]"
                  onClick={() => handleFile}
                >
                  <input
                    id="file"
                    type="file"
                    onChange={handleFile}
                    className="hidden"
                  />
                  <TbBackground /> <p>Upload image</p>
                </label>
                <Button
                  variant="secondary"
                  className="flex items-center gap-2 h-10 rounded-md text-sm w-full relative p-1 [&_svg]:size-[20px] bg-[#fbfbfb] dark:bg-[#545454] hover:bg-[#fbfbfb] dark:hover:bg-[#676767]"
                  onClick={() => handleBackground("")}
                >
                  <RiResetRightFill /> <p>Reset to default</p>
                </Button>
              </div>

              <div className="flex-1 h-hull">
                {isLoading ? (
                  <div className="grid grid-cols-3 max-[1100px]:grid-cols-2 flex-1 max-[400px]:grid-cols-1 gap-2">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        className="w-full h-[200px] rounded-[10px] bg-[#fbfbfb] dark:bg-[#545454]"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1 max-[1100px]:grid-cols-2 flex-1 max-[400px]:grid-cols-1">
                    {loading && (
                      <div className="block h-[clamp(6.25rem,-0.521rem+16.67vw,12.5rem)] max-[750px]:h-[170px] max-[400px]:h-[200px] relative bg-0 border-[3px] border-transparent hover:border-white dark:hover:border-white rounded-xl p-0 overflow-hidden transition-all">
                        <Image
                          width={300}
                          height={250}
                          src={filePreview || ""}
                          alt="wallpaper"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <span className="flex items-center justify-center absolute top-0 left-0 w-full h-full bg-[#1e1e1e]/70 dark:bg-[#1e1e1e]/70">
                          <Oval
                            visible={true}
                            height="40"
                            width="40"
                            color="#7391d5"
                            secondaryColor="#7391d5"
                            ariaLabel="oval-loading"
                            strokeWidth={4}
                          />
                        </span>
                      </div>
                    )}

                    {filePreview && !loading && (
                      <Button
                        onClick={() => handleBackground(filePreview)}
                        variant="secondary"
                        className={cn(
                          "block h-[clamp(6.25rem,-0.521rem+16.67vw,12.5rem)] max-[750px]:h-[170px] max-[400px]:h-[200px] relative bg-0 border-[3px] border-transparent hover:border-white dark:hover:border-white rounded-xl p-0 overflow-hidden transition-all",
                          filePreview === backgroundChat &&
                            "border-[#7391d5] hover:border-[#7391d5] dark:hover:border-[#7391d5]"
                        )}
                      >
                        <Image
                          width={300}
                          height={250}
                          src={filePreview || ""}
                          alt="wallpaper"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </Button>
                    )}

                    {data.urls.map((item: { id: string; url: string }) => (
                      <Button
                        onClick={() => handleBackground(item.url)}
                        variant="secondary"
                        key={item.id}
                        className={cn(
                          "block h-[clamp(6.25rem,-0.521rem+16.67vw,12.5rem)] max-[750px]:h-[170px] max-[400px]:h-[200px] relative bg-0 border-[3px] border-transparent hover:border-white dark:hover:border-white rounded-xl p-0 overflow-hidden transition-all",
                          item.url === backgroundChat &&
                            "border-[#7391d5] hover:border-[#7391d5] dark:hover:border-[#7391d5]"
                        )}
                      >
                        <Image
                          width={300}
                          height={250}
                          src={item.url}
                          alt="wallpaper"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {point === 1 && <GeneralSettings className="p-2" />}
        </div>
      </div>
    </div>
  );
};
