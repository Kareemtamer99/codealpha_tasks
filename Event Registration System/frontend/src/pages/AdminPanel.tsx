import React, { useEffect, useState } from 'react';
import api from '../services/api';
import styles from './AdminPanel.module.css';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminPanel: React.FC = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'registrations'>('events');

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: 50,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [eventsRes, regsRes] = await Promise.all([
        api.get('/events'),
        api.get('/registrations'),
      ]);
      setEvents(eventsRes.data);
      setRegistrations(regsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/events/${id}`);
      fetchData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/events/${editingId}`, formData);
      } else {
        await api.post('/events', formData);
      }
      setShowModal(false);
      setFormData({ title: '', description: '', date: '', location: '', capacity: 50 });
      setEditingId(null);
      fetchData();
    } catch (err) {
      alert('Action failed');
    }
  };

  const openEdit = (event: any) => {
    setEditingId(event._id);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      location: event.location,
      capacity: event.capacity,
    });
    setShowModal(true);
  };

  if (loading) return <div className="container">Loading admin data...</div>;

  return (
    <div className={styles.admin}>
      <header className={styles.header}>
        <h1>Admin Control Panel</h1>
        <div className={styles.tabs}>
          <button
            className={activeTab === 'events' ? styles.active : ''}
            onClick={() => setActiveTab('events')}
          >
            Manage Events
          </button>
          <button
            className={activeTab === 'registrations' ? styles.active : ''}
            onClick={() => setActiveTab('registrations')}
          >
            All Registrations
          </button>
        </div>
      </header>

      {activeTab === 'events' ? (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Events</h2>
            <button className={styles.addBtn} onClick={() => { setEditingId(null); setShowModal(true); }}>
              <FaPlus /> Create New Event
            </button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev: any) => (
                <tr key={ev._id}>
                  <td>{ev.title}</td>
                  <td>{new Date(ev.date).toLocaleDateString()}</td>
                  <td>{ev.location}</td>
                  <td>{ev.capacity}</td>
                  <td>
                    <button className={styles.editBtn} onClick={() => openEdit(ev)}><FaEdit /></button>
                    <button className={styles.delBtn} onClick={() => handleDelete(ev._id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <section className={styles.section}>
          <h2>System Registrations</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Event</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg: any) => (
                <tr key={reg._id}>
                  <td>{reg.user?.name}</td>
                  <td>{reg.event?.title}</td>
                  <td>
                    <span className={`${styles.status} ${styles[reg.status.toLowerCase()]}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{editingId ? 'Edit Event' : 'Create Event'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>{editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
