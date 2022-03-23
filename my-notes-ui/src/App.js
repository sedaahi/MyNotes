import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { Button, Container, Row, Col, ListGroup, Form } from 'react-bootstrap';


const API_URL = "https://localhost:5001/";

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState({ id: 0, title: "", content: "" });

  useEffect(() => {

    axios.get(API_URL + "api/Notes")
      .then(function (response) {
        setNotes(response.data);
        if (response.data.length > 0)
          setSelectedNote(response.data[0]);
      });

  }, [])

  const selectNote = function (note) {
    setSelectedNote({ ...note });
  };

  const handleSubmit = function (event) {
    event.preventDefault();

    axios.put(API_URL + "api/Notes/" + selectedNote.id, selectedNote)
      .then(function (response) {
        const newNotes = [...notes];
        const i = newNotes.findIndex(x => x.id == response.data.id);
        newNotes[i] = response.data;
        setNotes(newNotes);
      });
  };

  const handleNewClick = function (event) {
    axios.post(API_URL + "api/Notes", { title: "New Note", content: "" })
      .then(function (response) {
        const newNotes = [...notes];
        newNotes.push(response.data);
        setNotes(newNotes);
        selectNote(response.data);
      });
  };

  const handleDeleteClick = function(event) {
    axios.delete(API_URL + "api/Notes/" + selectedNote.id)
      .then(function (response) {
        setNotes(notes.filter(x => x.id != selectedNote.id));
        setSelectedNote({ id: 0, title: "", content: "" });
      });
  };

  return (
    <div className="App">
      <Container fluid="md" className="mt-4">
        <Row>
          <Col sm={4} lg={3}>
            <div className="d-flex">
              <h2 className="me-auto">My Notes</h2>
              <Button variant="success" onClick={handleNewClick}>New</Button>
            </div>
            <ListGroup className="my-3">
              {notes.map((note, index) =>
                <ListGroup.Item key={index} action active={note.id == selectedNote.id} onClick={() => selectNote(note)}>
                  {note.title}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Col>
          {selectedNote.id != 0 &&
            <Col sm={8} lg={9}>

              <form onSubmit={handleSubmit}>
                <Form.Control type="text" placeholder="Title" value={selectedNote.title} onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })} required />

                <Form.Control as="textarea" rows={9} placeholder="Content" className="mt-3" value={selectedNote.content} onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })} />

                <div className="mt-3 d-flex justify-content-end">
                  <Button type="button" variant="danger" className="me-2" onClick={handleDeleteClick}>Delete</Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>

            </Col>
          }
        </Row>
      </Container>
    </div>
  );
}

export default App;