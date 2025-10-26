import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useUserAvatar } from "@/store/user";
import { format } from "date-fns";
import React, { useState } from "react";
import { TbCheck, TbChecks } from "react-icons/tb";
import { settingsUpdate } from "../api/settings/settings";
import toast from "react-hot-toast";
import { useSettingsMessage } from "@/store/settingsMessage";

interface Props {
  className?: string;
}

const messages = [
  {
    id: 1,
    content: "Привет! Как у тебя дела сегодня?",
    createdAt: new Date().toISOString(),
    senderId: 1,
    isRead: true,
  },
  {
    id: 2,
    content: "Не забудь про встречу завтра в 14:00.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    senderId: 2,
    isRead: false,
  },
  {
    id: 3,
    content: "Я только что закончил работу над проектом, посмотри, пожалуйста.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    senderId: 1,
    isRead: true,
  },
];

export const GeneralSettings: React.FC<Props> = ({ className }) => {
  const {
    backgroundColorMessage,
    textColor,
    fontSize,
    radiusSize,
    setBackgroundColorMessage,
    setTextColor,
    setFontSize,
    setRadiusSize,
  } = useSettingsMessage();

  const [sliderValue, setSliderValue] = useState<number>(fontSize || 14);
  const [backgroundMessage, setBackgroundMessage] = useState<string>(
    backgroundColorMessage || "#7391d5"
  );
  const [color, setColor] = useState<string>(textColor || "#ebebeb");
  const [radius, setRadius] = useState<number>(radiusSize || 12);

  const { backgroundChat } = useUserAvatar();

  const [loader, setLoader] = useState<boolean>(false);

  const handleSave = async () => {
    setLoader(true);
    try {
      await settingsUpdate({
        backgroundColor: backgroundMessage,
        textColor: color,
        fontSize: sliderValue.toString(),
        radiusSize: radius.toString(),
      });

      setBackgroundColorMessage(backgroundMessage);
      setTextColor(color);
      setFontSize(sliderValue);
      setRadiusSize(radius);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setLoader(false);
    } finally {
      toast.success("Settings updated successfully");
      setLoader(false);
    }
  };

  const handleReset = () => {
    setSliderValue(14);
    setBackgroundMessage("#7391d5");
    setColor("#ebebeb");
    setRadius(12);
  };

  return (
    <div
      className={cn(
        "mt-10 flex flex-col max-w-[500px] gap-5",
        className
      )}
    >
      <div>
        <h4 className="font-medium text-[#2b2b2b] dark:text-[#ebebeb]">
          Text size
        </h4>
        <div className="flex justify-between align-center gap-3">
          <Slider
            defaultValue={[16]}
            max={20}
            min={12}
            step={1}
            value={[sliderValue]}
            onValueChange={(value) => setSliderValue(value[0])}
          />
          <span className="font-medium text-[#2b2b2b] dark:text-[#ebebeb]">
            {sliderValue}
          </span>
        </div>
      </div>
      <div className="flex justify-between align-center gap-5">
        <h4 className="font-medium text-[#2b2b2b] dark:text-[#ebebeb]">
          Background Message
        </h4>
        <label className="block relative">
          <input
            type="color"
            value={backgroundMessage}
            onChange={(e) => setBackgroundMessage(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <span
            style={{ backgroundColor: backgroundMessage }}
            className="block cursor-pointer w-5 h-5"
          ></span>
        </label>
      </div>
      <div className="flex justify-between align-center gap-5">
        <h4 className="font-medium text-[#2b2b2b] dark:text-[#ebebeb]">
          Text Color Message
        </h4>
        <label className="block relative">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <span
            style={{ backgroundColor: color }}
            className="block cursor-pointer w-5 h-5"
          ></span>
        </label>
      </div>
      <div>
        <h4 className="font-medium text-[#2b2b2b] dark:text-[#ebebeb]">
          Radius size
        </h4>
        <div className="flex justify-between align-center gap-3">
          <Slider
            defaultValue={[12]}
            max={20}
            min={1}
            step={1}
            value={[radius]}
            onValueChange={(value) => setRadius(value[0])}
          />
          <span className="font-medium text-[#2b2b2b] dark:text-[#ebebeb]">
            {radius}
          </span>
        </div>
      </div>

      <div
        style={{ backgroundImage: `url(${backgroundChat})` }}
        className="mt-5 max-w-[500px] w-full min-h-[200px] bg-no-repeat bg-cover bg-center overflow-hidden rounded-[12px] py-5 px-2"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex w-full [&:not(:first-child)]:mt-[10px] ${
              message.senderId === 1 ? "justify-end" : "justify-start"
            }  relative`}
          >
            <div
              style={{
                ...(message.senderId === 1
                  ? {
                      backgroundColor: backgroundMessage,
                      color: color,
                    }
                  : {}),
                borderTopLeftRadius: `${radius}px`,
                borderTopRightRadius: `${radius}px`,
                borderBottomLeftRadius:
                  message.senderId === 1 ? `${radius}px` : "0",
                borderBottomRightRadius:
                  message.senderId === 1 ? "0" : `${radius}px`,
              }}
              className={`w-fit max-w-xs sm:max-w-md text-sm shadow overflow-hidden select-none
                ${
                  message.senderId === 1
                    ? "bg-[#7391d5] text-[#ebebeb] rounded-br-none"
                    : "bg-[#ebebeb] dark:bg-[#2b2b2b] text-[#2b2b2b] dark:text-[#ebebeb] rounded-bl-none"
                }
            `}
            >
              <div className={cn("p-2 relative", !message?.content && "p-0")}>
                {message?.content && (
                  <div
                    className={cn(
                      "block",
                      message?.content?.length > 60
                        ? "pr-7 max-[650px]:pr-[35px]"
                        : "pr-14 max-[650px]:pr-12"
                    )}
                  >
                    <p
                      className={cn(
                        "whitespace-pre-wrap break-words px-1 max-[750px]:text-[14px] max-[750px]:select-none"
                      )}
                      style={{ fontSize: `${sliderValue}px` }}
                    >
                      {message.content}
                    </p>
                  </div>
                )}
                <div
                  className={cn(
                    "absolute bottom-1 right-2 z-[5] flex gap-1 text-xs font-medium items-center opacity-70 max-[650px]:bottom-[2px] max-[650px]:right-[5px] max-[650px]:justify-end"
                  )}
                >
                  {message.createdAt &&
                    format(new Date(message.createdAt), "HH:mm")}

                  {message.senderId === 1 &&
                    (message.isRead ? (
                      <span title="Read by recipient">
                        <TbChecks size={16} />
                      </span>
                    ) : (
                      <span title="Not read yet">
                        <TbCheck size={16} />
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        className="bg-[#7391d5] dark:bg-[#7391d5] hover:bg-[#7391d5]/90 dark:hover:bg-[#7391d5]/90 text-[#ebebeb] dark:text-[#ebebeb]"
        onClick={handleSave}
        loading={loader}
      >
        Save
      </Button>
      <Button onClick={handleReset}>Default</Button>
    </div>
  );
};
