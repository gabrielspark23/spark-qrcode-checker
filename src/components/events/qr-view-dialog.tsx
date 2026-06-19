"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Visualização do QR Code gerado para um contato/convidado específico.
export function QrViewDialog({
  open,
  onOpenChange,
  guestName,
  token,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  guestName: string;
  token: string | null;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="truncate">{guestName}</DialogTitle>
        </DialogHeader>
        {token ? (
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/qr/${token}`}
              alt={`QR de ${guestName}`}
              className="h-56 w-56 rounded-lg border"
            />
            <div className="flex w-full gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <a
                  href={`/api/qr/${token}`}
                  download={`qr-${guestName.replace(/\s+/g, "-").toLowerCase()}.png`}
                >
                  Baixar PNG
                </a>
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/q/${token}`);
                  setCopied(true);
                  toast.success("Link copiado");
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? "Copiado!" : "Copiar link"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-neutral-500">
            QR ainda não gerado para este convidado. Gere os QR Codes na aba
            QR Delivery.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
