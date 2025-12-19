"use client";

interface EventCardProps {
  url: string;
  img: string;
  title: string;
}

export default function EventCard({ url, img, title }: EventCardProps) {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden shadow-md bg-white">
        {/* Background Image Container */}
        <div className="relative w-full">
          <a href={url} target="_blank">
            <img
              src={img}
              alt="event-img"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <h3 className="text-white text-lg font-bold">{title}</h3>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
