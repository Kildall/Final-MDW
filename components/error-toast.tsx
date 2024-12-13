"use client";

import { useToast } from "@/hooks/use-toast";
import { removeError } from "@/lib/features/error/error-slice";
import { RootState } from "@/lib/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function ErrorToast() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const errors = useSelector((state: RootState) => state.error.errors);

  useEffect(() => {
    for (const error of errors) {
      const errorMessages = error.messages
        .map((message) => message.translatedMessage)
        .filter((message): message is string => !!message);

      if (!errorMessages.length) {
        toast({
          variant: "destructive",
          title: "Error desconocido",
          description: "Por favor intente nuevamente",
          onOpenChange: (open) => {
            if (!open) {
              dispatch(removeError(error.id));
            }
          },
          duration: 5000,
        });
      }

      for (const message of errorMessages) {
        toast({
          variant: "destructive",
          title: message,
          description: "Por favor intente nuevamente",
          onOpenChange: (open) => {
            if (!open) {
              dispatch(removeError(error.id));
            }
          },
          duration: 5000,
        });
      }
    }
  }, [errors, toast, dispatch]);

  return null;
}