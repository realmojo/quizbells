"use client";

interface EventCardProps {
  url: string;
  img: string;
}

export default function EventCard({ url, img }: EventCardProps) {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-2xl shadow-md bg-white">
        {/* Background Image Container */}
        <div className="relative w-full">
          <a href={url} target="_blank">
            <img
              src={img}
              alt="event-img"
              className="w-full h-full object-cover"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
