import { ScrollArea } from "./ui/scroll-area";

export default function ApplicationPage({
  title = "Application",
  children,
  sideElement,
}: {
  sideElement?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <ScrollArea className="flex flex-col  p-5 h-full w-full  items-start justify-start">
      <h1 className="text-2xl cursor-pointer  select-none items-center justify-start   font-bold mb-2 flex flex-row gap-2">
        {title} <span className="">{sideElement}</span>
      </h1>
      {children}
    </ScrollArea>
  );
}
