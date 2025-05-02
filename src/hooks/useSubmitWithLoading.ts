import { useState } from "react";

import { commons } from "@/constants/commons";

const { SUCCESS } = commons;

export const useSubmitWithLoading = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSubmit = (submitPromise: Promise<ResponseType>) => {
    setIsSubmitting(true);

    submitPromise
      .then((res) => {
        if (res.code !== SUCCESS) {
          setIsSubmitting(false);
        }
      })
      .catch(() => {
        setIsSubmitting(false);
      });
  };

  return { isSubmitting, formSubmit };
};
