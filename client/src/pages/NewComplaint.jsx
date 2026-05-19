import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FileText, Cpu, CheckCircle } from 'lucide-react';

const NewComplaint = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    title: '',
    description: '',
    category: 'Other',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/complaints/ai/analyze', 
        { title: formData.title, description: formData.description },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setAiResult(data);
      setStep(2);
    } catch (error) {
      console.error('AI Analysis failed', error);
      // Fallback to direct submit if AI fails
      handleSubmitWithoutAI();
    }
    setLoading(false);
  };

  const handleSubmitFinal = async () => {
    try {
      await axios.post('http://localhost:5000/api/complaints', 
        { ...formData, aiAnalysis: aiResult },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      navigate('/');
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  const handleSubmitWithoutAI = async () => {
    try {
      await axios.post('http://localhost:5000/api/complaints', 
        formData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      navigate('/');
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div className="card glass-panel">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <FileText /> Register New Complaint
        </h2>

        {step === 1 && (
          <form onSubmit={handleAnalyze}>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Complaint Title</label>
              <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-control" 
                name="description" 
                rows="4" 
                value={formData.description} 
                onChange={handleChange} 
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-control" name="category" value={formData.category} onChange={handleChange}>
                  <option value="Water">Water</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Road">Road</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location (Address/Landmark)</label>
                <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
              {loading ? <><Cpu className="animate-spin" /> Analyzing with AI...</> : <><Cpu /> Analyze & Continue</>}
            </button>
          </form>
        )}

        {step === 2 && aiResult && (
          <div className="animate-fade-in">
            <div style={{ background: 'rgba(79, 70, 229, 0.1)', border: '1px solid var(--primary)', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                <Cpu /> AI Analysis Results
              </h3>
              <p style={{ marginBottom: '1.5rem' }}>Our AI has analyzed your complaint and determined the following:</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Urgency Level:</strong>
                  <p className={`badge ${aiResult.urgency === 'High' ? 'badge-high' : 'badge-pending'}`} style={{ display: 'inline-block', marginTop: '0.25rem' }}>
                    {aiResult.urgency}
                  </p>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Suggested Department:</strong>
                  <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{aiResult.department}</p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>AI Summary:</strong>
                  <p>{aiResult.summary}</p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Auto-Response:</strong>
                  <p style={{ fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '4px', marginTop: '0.5rem' }}>
                    "{aiResult.suggestedResponse}"
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: 1 }}>
                Go Back & Edit
              </button>
              <button className="btn btn-primary" onClick={handleSubmitFinal} style={{ flex: 2 }}>
                <CheckCircle /> Confirm & Submit Complaint
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewComplaint;
