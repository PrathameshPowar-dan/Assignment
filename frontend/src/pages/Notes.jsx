import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/authContext.jsx";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [notesLoading, setNotesLoading] = useState(true);
  const { user, loading, logout } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
      return;
    }
    if (user) {
      fetchNotes();
    }
  }, [user, loading]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/note", {
        withCredentials: true,
      });
      setNotes(res.data.data);
      setNotesLoading(false);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/note", newNote, {
        withCredentials: true,
      });
      setNewNote({ title: "", content: "" });
      fetchNotes();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating note");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/note/${id}`, {
        withCredentials: true,
      });
      fetchNotes();
    } catch { }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading || notesLoading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border mb-3" />
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">{user.tenant?.name || "My Tenant"}</h2>
          <p className="text-muted mb-0">Logged in as {user.email}</p>
        </div>
        <div>
          <span className="badge bg-success me-2">
            Plan: {user.tenant?.plan}
          </span>
          <span className="badge bg-primary">Role: {user.role}</span>
        </div>
      </div>

      {user.tenant?.plan === "free" &&
        notes.length >= 3 &&
        user.role === "admin" && (
          <div className="alert alert-warning d-flex justify-content-between align-items-center">
            <span>You’ve reached the free plan limit of 3 notes.</span>
            <button className="btn btn-sm btn-warning">Upgrade to Pro</button>
          </div>
        )}

      {!(user.tenant?.plan === "free" && notes.length >= 3) && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Create a Note</h5>
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Note title"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  placeholder="Note content"
                  rows="3"
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Note
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="row g-3">
        {notes.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center">
              No notes yet. Create your first note above!
            </div>
          </div>
        ) : (
          notes.map((note) => (
            <div className="col-md-6" key={note._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{note.title}</h5>
                  <p className="card-text flex-grow-1 text-muted">
                    {note.content}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </small>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(note._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-center mt-5">
        <button className="btn btn-outline-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
