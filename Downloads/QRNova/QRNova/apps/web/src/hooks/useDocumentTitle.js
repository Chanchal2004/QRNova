import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · QRNova` : "QRNova — The open-source QR platform";
  }, [title]);
}
