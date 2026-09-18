import { useEffect } from "react";

const SITE_NAME = "Blue Tick Exams";

export function Seo({ title, description }: { title: string; description?: string }) {
  useEffect(() => {
    document.title = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;

    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}
