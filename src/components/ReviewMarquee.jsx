import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import api from '../api/axios';

const ReviewMarquee = () => {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    api.get('/reviews').then(res => setReviews(res.data)).catch(console.error);
  }, []);
  if (reviews.length === 0) return null;
  return (
    <div className="overflow-hidden whitespace-nowrap py-4 bg-black/40 border-y border-white/5">
      <div className="inline-block animate-marquee">
        {reviews.concat(reviews).map((review, idx) => (
          <span key={idx} className="inline-flex items-center gap-4 mx-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-xs font-bold">{review.name[0]}</div>
              <div>
                <p className="text-sm font-bold">{review.name}</p>
                <div className="flex text-gold">{Array(review.rating).fill().map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm italic">"{review.text.slice(0, 100)}"</p>
          </span>
        ))}
      </div>
    </div>
  );
};
export default ReviewMarquee;
