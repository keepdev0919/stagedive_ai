"use client";

interface VideoPlayerProps {
  imageUrl: string;
  videoUrl?: string;
}

export default function VideoPlayer({ imageUrl, videoUrl }: VideoPlayerProps) {
  // MVP: Display the stage image as background if no video available
  if (videoUrl && videoUrl !== imageUrl) {
    return (
      <video
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }

  // Fallback: Show image with subtle animation
  return (
    <div
      className="absolute inset-0 w-full h-full bg-cover bg-center animate-[slowZoom_20s_ease-in-out_infinite_alternate]"
      style={{ backgroundImage: `url('${imageUrl}')` }}
    />
  );
}
