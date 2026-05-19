import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/complaints', {
        headers: { Authorization: `Bearer ${user.token}` },
        params: { category }
      });
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [category]);

  const handleSearch = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/complaints/search', {
        headers: { Authorization: `Bearer ${user.token}` },
        params: { location: search }
      });
      setComplaints(data);
    } catch (error) {
      console.error('Error searching complaints:', error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchComplaints();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await axios.delete(`http://localhost:5000/api/complaints/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchComplaints();
      } catch (error) {
        console.error('Error deleting complaint:', error);
      }
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <p>Welcome back, {user.name}!</p>
      </div>

      <div className="grid grid-cols-3 mb-4">
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(79, 70, 229, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <AlertCircle size={24} color="var(--primary)" />
          </div>
          <div>
            <h3>Total</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{stats.total}</p>
          </div>
        </div>
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Clock size={24} color="#fcd34d" />
          </div>
          <div>
            <h3>Pending</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{stats.pending}</p>
          </div>
        </div>
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <CheckCircle size={24} color="#6ee7b7" />
          </div>
          <div>
            <h3>Resolved</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{stats.resolved}</p>
          </div>
        </div>
      </div>

      <div className="card glass-panel mb-4" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label className="form-label">Search by Location</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSearch}><Search size={18} /></button>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <label className="form-label">Filter by Category</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select 
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Water">Water</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Road">Road</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1">
        {complaints.length === 0 ? (
          <div className="card glass-panel text-center p-6">
            <p>No complaints found.</p>
          </div>
        ) : (
          complaints.map(complaint => (
            <div key={complaint._id} className="card glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{complaint.title}</h3>
                  <span className={`badge ${complaint.status === 'Resolved' ? 'badge-resolved' : 'badge-pending'}`}>
                    {complaint.status}
                  </span>
                  <span className="badge" style={{ marginLeft: '0.5rem', background: 'rgba(255,255,255,0.1)' }}>
                    {complaint.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem' }}>{new Date(complaint.createdAt).toLocaleDateString()}</p>
              </div>
              <p style={{ marginBottom: '1rem' }}>{complaint.description}</p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <span><strong>Location:</strong> {complaint.location}</span>
                <span><strong>By:</strong> {complaint.name} ({complaint.email})</span>
              </div>

              {/* AI Analysis Display */}
              {complaint.aiAnalysis && complaint.aiAnalysis.department && (
                <div style={{ background: 'rgba(79, 70, 229, 0.1)', borderLeft: '4px solid var(--primary)', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>AI Analysis</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <p><strong>Urgency:</strong> <span className={complaint.aiAnalysis.urgency === 'High' ? 'badge-high badge' : ''}>{complaint.aiAnalysis.urgency}</span></p>
                    <p><strong>Department:</strong> {complaint.aiAnalysis.department}</p>
                    <p style={{ gridColumn: '1 / -1' }}><strong>Summary:</strong> {complaint.aiAnalysis.summary}</p>
                  </div>
                </div>
              )}

              {user.role === 'admin' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                  {complaint.status !== 'Resolved' && (
                    <button className="btn btn-secondary" onClick={() => handleStatusUpdate(complaint._id, 'Resolved')}>Mark Resolved</button>
                  )}
                  {complaint.status === 'Resolved' && (
                    <button className="btn btn-outline" onClick={() => handleStatusUpdate(complaint._id, 'Pending')}>Mark Pending</button>
                  )}
                  <button className="btn btn-danger" onClick={() => handleDelete(complaint._id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
