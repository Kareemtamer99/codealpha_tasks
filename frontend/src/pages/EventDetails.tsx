import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaUserTie } from 'react-icons/fa';
import styles from './EventDetails.module.css';

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/registrations', { eventId: id });
      setMessage({ type: 'success', text: 'Successfully registered for this event!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Registration failed' });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="container">Loading event details...</div>;
  if (!event) return <div className="container">Event not found</div>;

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.header}>
        <h1>{event.title}</h1>
        <div className={styles.meta}>
          <span><FaCalendarAlt /> {new Date(event.date).toLocaleDateString()}</span>
          <span><FaMapMarkerAlt /> {event.location}</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.mainInfo}>
          <section className={styles.section}>
            <h2>About this Event</h2>
            <p>{event.description}</p>
          </section>

          <section className={styles.section}>
            <h2>Organizer</h2>
            <p className={styles.organizer}>
              <FaUserTie /> {event.organizer?.name} ({event.organizer?.email})
            </p>
          </section>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.stickyCard}>
            <div className={styles.capacityInfo}>
              <FaUsers />
              <div>
                <strong>Capacity</strong>
                <span>{event.capacity} total slots</span>
              </div>
            </div>

            {message.text && (
              <div className={`${styles.alert} ${styles[message.type]}`}>
                {message.text}
              </div>
            )}

            <button
              onClick={handleRegister}
              disabled={registering}
              className={styles.registerBtn}
            >
              {registering ? 'Processing...' : 'Register Now'}
            </button>
            {!isAuthenticated && <p className={styles.hint}>Please login to register</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
