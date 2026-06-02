import { useState, useEffect } from "react";
import "../styles/assets.css";
import api from "../services/api";

const ASSET_TYPES = ["Video", "Image", "PDF", "Document", "Audio", "Design", "Folder"];

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Video",
    description: ""
  });
  const [file, setFile] = useState(null);

  // Fetch assets from backend
  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await api.get("/assets");
      setAssets(response.data);
    } catch (error) {
      console.error("Error fetching assets:", error);
      // Fallback to mock data
      setAssets([
        { title: "Interstellar Trailer", type: "Video", description: "Main trailer for Interstellar" },
        { title: "Scene Storyboard", type: "Image", description: "Visual storyboard reference" },
        { title: "Production Script", type: "PDF", description: "Complete shooting script" },
        { title: "VFX References", type: "Folder", description: "VFX reference materials" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert("Please enter asset title");
      return;
    }

    try {
      setLoading(true);
      
      const newAsset = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        fileName: file ? file.name : "no-file",
        uploadedAt: new Date().toLocaleDateString()
      };

      // Add to local state immediately
      setAssets(prev => [...prev, newAsset]);
      
      // If there's a file, try to upload
      if (file) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('title', formData.title);
        uploadFormData.append('type', formData.type);
        
        await api.post("/upload-asset", uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).catch(err => console.log("Backend upload note:", err.message));
      }
      
      setFormData({ title: "", type: "Video", description: "" });
      setFile(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding asset:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAsset = (index) => {
    setAssets(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="assets-page">
      <div className="assets-header">
        <h1>Production Assets</h1>
        <button onClick={() => setShowModal(true)} className="add-btn">
          + Upload Asset
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Asset</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleAddAsset}>
              <div className="form-group">
                <label>Asset Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Interstellar Trailer"
                  required
                />
              </div>

              <div className="form-group">
                <label>Asset Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  {ASSET_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add asset description (optional)"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>File (Optional)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="*/*"
                />
                {file && <p className="file-name">✓ {file.name} selected</p>}
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Uploading..." : "Upload Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="assets-grid">
        {assets.length === 0 ? (
          <p className="empty-state">No assets uploaded yet. Click "Upload Asset" to add one!</p>
        ) : (
          assets.map((asset, index) => (
            <div className="asset-card" key={index}>
              <div className="asset-preview">
                <span className="asset-type">{asset.type}</span>
              </div>
              <h2>{asset.title}</h2>
              <p className="asset-description">{asset.description || "No description"}</p>
              <p className="asset-meta">{asset.type} File</p>
              {asset.uploadedAt && <p className="asset-date">📅 {asset.uploadedAt}</p>}
              <button className="delete-btn" onClick={() => handleRemoveAsset(index)}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}