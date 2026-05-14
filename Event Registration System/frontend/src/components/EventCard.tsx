import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './EventCard.module.css';

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.description}>{event.description.substring(0, 100)}...</p>
        
        <div className={styles.info}>
          <span>
            <FaCalendarAlt /> {formattedDate}
          </span>
          <span>
            <FaMapMarkerAlt /> {event.location}
          </span>
        </div>
      </div>
      <div className={styles.footer}>
        <Link to={`/events/${event._id}`} className={styles.detailsBtn}>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
