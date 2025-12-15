"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ContactModalProps {
  open: boolean;
  type: "call" | "visit";
  propertyId: string;
  onClose: () => void;
}

export default function ContactModal({
  open,
  type,
  propertyId,
  onClose,
}: ContactModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;
  if (typeof window === "undefined") return null;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const message =
    type === "call"
      ? "Please call me regarding this PG"
      : "I want to schedule a visit for this PG";

  const handleSubmit = async () => {
    if (!name || !phone) {
      alert("Please enter name & phone");
      return;
    }

    try {
      setLoading(true);
      await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          message,
          propertyId,
        }),
      });

      onClose();
      setName("");
      setPhone("");
      alert("Request sent successfully");
    } catch {
      alert("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-light-bg dark:bg-dark-bg ">
      <div className="relative w-full max-w-md bg-white rounded-xl p-6 shadow-2xl text-black">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground"
        >
          <X />
        </button>

        <h3 className="text-lg font-semibold mb-4 text-black">
          {type === "call" ? "Request Callback" : "Schedule Visit"}
        </h3>

        <div className="space-y-4">
          <input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg text-black"
          />

          <input
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg text-black"
          />


          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full bg-black text-white py-2 rounded-lg font-medium"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
