import { cn } from "@/lib/cn";

type AdminPrivatePhotoProps = {
  signedUrl: string | null;
  emptyLabel: string;
  alt: string;
  variant?: "card" | "detail";
};

export default function AdminPrivatePhoto({
  signedUrl,
  emptyLabel,
  alt,
  variant = "card",
}: AdminPrivatePhotoProps) {
  const isDetail = variant === "detail";

  if (signedUrl) {
    return (
      <div
        className={cn(
          "overflow-hidden border border-slate-800 bg-slate-950",
          isDetail ? "rounded-2xl" : "mb-3 rounded-xl",
        )}
      >
        {/* Signed Cloudinary URLs carry expire_at; next/image would strip the firma. */}
        <img
          src={signedUrl}
          alt={alt}
          className={isDetail ? "max-h-[28rem] w-full object-contain" : "h-36 w-full object-cover"}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center border border-slate-800 bg-slate-900 px-3 text-center text-xs text-slate-500",
        isDetail ? "min-h-64 rounded-2xl" : "mb-3 h-24 rounded-xl",
      )}
    >
      {emptyLabel}
    </div>
  );
}
