import { CircleDot } from "lucide-react";

export default function MessageLoader() {
  return (
    <div className="bg-emphasis my-auto  flex flex-row justify-center rounded-md p-3">
      <div className="my-auto flex gap-x-2">
        <CircleDot width={8} height={8} fill="#6D278E" className="animate-pulse delay-300" />
        <CircleDot width={8} height={8} fill="#6D278E" className="animate-bounce" />
        <CircleDot width={8} height={8} fill="#6D278E" className="animate-pulse delay-500" />
      </div>
    </div>
  );
}
