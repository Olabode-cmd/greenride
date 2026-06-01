import axios from "axios";

/*
 * Extracts a user-facing error message from an unknown thrown value.
 * Checks for dummyjson's { message } shape first, then falls back
 * to a generic string keyed on HTTP status code.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = error.response?.data?.message;
    if (typeof apiMessage === "string" && apiMessage.trim().length > 0) {
      return apiMessage;
    }
    return statusMessage(error.response?.status);
  }

  return "Something went wrong. Please try again.";
}

function statusMessage(status: number | undefined): string {
  switch (status) {
    case 400:
      return "The request was invalid. Please check your input.";
    case 401:
      return "Invalid credentials. Please try again.";
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return "A conflict occurred. Please try again.";
    case 422:
      return "The submitted data could not be processed.";
    case 429:
      return "Too many requests. Please slow down and try again.";
    case 500:
    case 502:
    case 503:
      return "A server error occurred. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}
