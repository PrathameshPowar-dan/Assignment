import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/authContext.jsx";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [notesLoading, setNotesLoading] = useState(true);
  const { user, loading, CheckAuth, logout } = useContext(Context);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuthAndLoadNotes = async () => {
      if (!user && !loading) {
        // If no user and auth check is complete, redirect to login
        navigate("/login");
        return;
      }

      if (user) {
        await fetchNotes();
        setNotesLoading(false);
      }
    };

    checkAuthAndLoadNotes();
  }, [user, loading]);

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/note", {
        withCredentials: true,
      });
      setNotes(res.data.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // Create note
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

  // Delete note
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/note/${id}`, {
        withCredentials: true,
      });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect if no user
  if (!user) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show loading state while fetching notes
  if (notesLoading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Notes for {user.tenant?.name || "My Tenant"}</h2>
        <div>
          <span className="badge bg-success me-2">
            Plan: {user.tenant?.plan || "free"}
          </span>
          <span className="badge bg-info">
            Role: {user?.role || "member"}
          </span>
        </div>
      </div>

      <p>
        Logged in as <strong>{user?.email || "User"}</strong>
      </p>

      {/* Upgrade Button for Free Plan Admin */}
      {user.tenant?.plan === "free" &&
        notes.length >= 3 &&
        user.role === "admin" && (
          <div className="alert alert-warning">
            <p>You've reached the limit of 3 notes on the Free plan!</p>
            <button className="btn btn-warning" onClick={handleUpgrade}>
              Upgrade to Pro Plan
            </button>
          </div>
        )}

      {/* Note limit message */}
      {user.tenant?.plan === "free" && notes.length >= 3 ? (
        <div className="alert alert-info">
          <p>Free plan limit reached ({notes.length}/3 notes). Upgrade to Pro for unlimited notes.</p>
        </div>
      ) : (
        /* Add Note Form */
        <form onSubmit={handleCreate} className="mb-4">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Note title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
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
      )}

      {/* Notes Counter */}
      <div className="mb-3">
        <p className="text-muted">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          {user.tenant?.plan === "free" && ` (${notes.length}/3 limit)`}
        </p>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="alert alert-info">
          <p>No notes yet. Create your first note above!</p>
        </div>
      ) : (
        <ul className="list-group">
          {notes.map((note) => (
            <li
              key={note._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="flex-grow-1">
                <h5 className="mb-1">{note.title}</h5>
                <p className="mb-1 text-muted">{note.content}</p>
                <small className="text-muted">
                  Created: {new Date(note.createdAt).toLocaleDateString()}
                </small>
              </div>
              <button
                className="btn btn-danger btn-sm ms-3"
                onClick={() => handleDelete(note._id)}
                title="Delete note"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Logout Button */}
      <div className="mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}