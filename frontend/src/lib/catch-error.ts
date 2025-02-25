import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

export function catchError(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return toast.error(errors.join("\n"));
  } else if (axios.isAxiosError(err)) {
    if (err.response) {
      // Server responded with a status other than 2xx
      let errorMessage = "";
      if (
        Array.isArray(err.response.data.message) &&
        err.response.data.message.length > 0
      ) {
        errorMessage += err.response.data.message[0];
      } else {
        errorMessage += err.response.data.message;
      }
      return toast.error("Oops", {
        description: errorMessage,
      });
    } else if (err.request) {
      // Request was made but no response received
      return toast.error("Error", {
        description: " No response received from the server.",
      });
    } else {
      // Something happened in setting up the request
      return toast.error(`Error: ${err.message}`);
    }
  } else if (err instanceof Error) {
    return toast.error(err.message);
  } else {
    return toast.error("Something went wrong, please try again later.");
  }
}