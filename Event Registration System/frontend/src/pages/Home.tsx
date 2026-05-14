import React, { useEffect, useState } from 'react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        setEvents(data);
      } catch (err) {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="container">Loading events...</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1>Upcoming Events</h1>
        <p>Discover and register for the latest events in your area.</p>
      </header>

      <div className={styles.eventGrid}>
        {events.map((event: any) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>

      {events.length === 0 && <p className={styles.noEvents}>No events found. Check back later!</p>}
    </div>
  );
};

export default Home;
