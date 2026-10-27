type EmbedViewProps = {
  src: string;
  title: string;
  backHref?: string;
};

/** Full-screen external page (360 tours). */
export function EmbedView({ src, title }: EmbedViewProps) {
  return (
    <main className="relative h-svh w-full overflow-hidden bg-page">
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 size-full border-0"
        allow="fullscreen; accelerometer; gyroscope; magnetometer; xr-spatial-tracking"
        allowFullScreen
      />
    </main>
  );
}

