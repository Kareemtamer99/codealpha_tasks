import React, { useEffect, useState } from 'react';
import api from '../services/api';
import styles from './Dashboard.module.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaTimesCircle } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRegistrations = async () => {
    try {
      const { data } = await api.get('/registrations/me');
      setRegistrations(data);
    } catch (err) {
      setError('Failed to load your registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;

    try {
      await api.patch(`/registrations/${id}/cancel`);
      fetchRegistrations(); // Refresh
    } catch (err) {
      alert('Failed to cancel registration');
    }
  };

  if (loading) return <div className="container">Loading your registrations...</div>;

  return (
    <div className={styles.dashboard}>
      <h1>My Registered Events</h1>
      {error && <p className={styles.error}>{error}</p>}

      {registrations.length === 0 ? (
        <p className={styles.empty}>You haven't registered for any events yet.</p>
      ) : (
        <div className={styles.list}>
          {registrations.map((reg: any) => (
            <div key={reg._id} className={styles.regCard}>
              <div className={styles.regInfo}>
                <h3>{reg.event.title}</h3>
                <p><FaCalendarAlt /> {new Date(reg.event.date).toLocaleDateString()}</p>
                <p><FaMapMarkerAlt /> {reg.event.location}</p>
                <span className={`${styles.status} ${styles[reg.status.toLowerCase()]}`}>
                  {reg.status}
                </span>
              </div>
              {reg.status === 'Confirmed' && (
                <button onClick={() => handleCancel(reg._id)} className={styles.cancelBtn}>
                  <FaTimesCircle /> Cancel Registration
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
