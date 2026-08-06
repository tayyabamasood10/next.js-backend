"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { cn } from "@/components/ui/cn";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const Modal = ({ open, onOpenChange, children, className }: ModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-card border border-border shadow-2xl p-0 transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
            className
          )}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const ModalTrigger = Dialog.Trigger;

const ModalClose = Dialog.Close;

const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="modal-header"
    className={cn("flex items-center justify-between p-6 pb-4", className)}
    {...props}
  />
);

const ModalTitle = Dialog.Title;

const ModalDescription = Dialog.Description;

const ModalBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="modal-body"
    className={cn("px-6 pb-6", className)}
    {...props}
  />
);

const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="modal-footer"
    className={cn("flex items-center justify-end gap-2 px-6 pb-6", className)}
    {...props}
  />
);

export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
};
