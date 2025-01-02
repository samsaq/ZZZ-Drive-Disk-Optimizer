import { signIn } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";

interface LoginModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
}

export default function LoginModal({
  isOpen,
  setIsOpen,
  onClose,
}: Readonly<LoginModalProps>) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        hasOverlayBackground={false}
        usePortal={false}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-DOS">Login</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <button
            className="flex items-center justify-center gap-2 rounded-lg border p-2 hover:bg-gray-100"
            onClick={() => signIn("google")}
          >
            <img
              alt="Google"
              className="h-5 w-5"
              src="/providerIcons/google.svg"
            />
            Continue with Google
          </button>

          <button
            className="flex items-center justify-center gap-2 rounded-lg border p-2 hover:bg-gray-100"
            onClick={() => signIn("reddit")}
          >
            <img
              alt="Reddit"
              className="h-5 w-5"
              src="/providerIcons/reddit.svg"
            />
            Continue with Reddit
          </button>

          <button
            className="flex items-center justify-center gap-2 rounded-lg border p-2 hover:bg-gray-100"
            onClick={() => signIn("github")}
          >
            <img
              alt="GitHub"
              className="h-5 w-5"
              src="/providerIcons/github.svg"
            />
            Continue with GitHub
          </button>

          <button
            className="flex items-center justify-center gap-2 rounded-lg border p-2 hover:bg-gray-100"
            onClick={() => signIn("discord")}
          >
            <img
              alt="Discord"
              className="h-5 w-5"
              src="/providerIcons/discord.svg"
            />
            Continue with Discord
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
