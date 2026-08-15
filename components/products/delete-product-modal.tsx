"use client";

import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/mock-products";
import { AlertTriangle } from "lucide-react";

interface DeleteProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onConfirm: () => void;
  deleting?: boolean;
}

export function DeleteProductModal({ open, onOpenChange, product, onConfirm, deleting }: DeleteProductModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalHeader>
        <ModalTitle>Delete Product?</ModalTitle>
        <ModalDescription>
          This action cannot be undone.
        </ModalDescription>
      </ModalHeader>
      <ModalBody>
        <div className="flex items-start gap-3 rounded-lg bg-danger/5 p-4 border border-danger/20">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
          <p className="text-sm text-foreground">
            Are you sure you want to delete <span className="font-semibold">&quot;{product?.name}&quot;</span>? This action cannot be undone.
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleting}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
