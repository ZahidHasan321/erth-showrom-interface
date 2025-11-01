"use client";

import { Button } from "@/components/ui/button";
import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  onSave?: (signature: string) => void;
}

export function SignaturePad({ onSave }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    if (sigCanvas.current && onSave) {
      onSave(sigCanvas.current.getCanvas().toDataURL("image/png"));
    }
  };

  return (
    <div className="flex flex-col space-y-2 w-fit">
      <div className="border rounded-lg bg-white/70">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
        />
      </div>
      <div className="flex space-x-2">
        <Button type="button" onClick={clear} variant="outline">
          Clear
        </Button>
        <Button type="button" onClick={save}>Save Signature</Button>
      </div>
    </div>
  );
}
