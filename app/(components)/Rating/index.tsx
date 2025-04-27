import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  size?: number;
}

const Rating = ({ rating, size = 14 }: RatingProps) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={size}
          className={`${
            index < Math.round(rating)
              ? "fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400"
              : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
          } transition-colors duration-300`}
        />
      ))}
    </div>
  );
};

export default Rating;
