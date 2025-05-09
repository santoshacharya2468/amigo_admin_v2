import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface DeleteResourceProps {
  classname: string;
  title: string;
  onDelete: () => void;
  disabled?: boolean;
}

const DeleteResource = ({
  classname,
  title,
  disabled,
  onDelete,
}: DeleteResourceProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <AlertDialog open={disabled ? false : open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            disabled={disabled}
            variant="destructive"
            className={cn(
              `transition-opacity  duration-500  animate-in`,
              classname
            )}
          >
            <Trash2Icon className="h-4 w-4" />
            {title}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {title}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                onDelete();
                setOpen(false);
              }}
            >
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteResource;
