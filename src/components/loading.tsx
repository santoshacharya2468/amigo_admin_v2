import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-background flex w-full min-h-72 items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
}
