import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { db, storage } from "./firebase";
import firebase from "firebase";
import './Imageupload.css';

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState("");
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = (e) => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress bar...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (err) => {
        //error fn
        console.log(err);
        alert(err.message);
      },
      () => {
        //complete functions....
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //post  img inside db
            db.collection("users").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imgUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div className="imageUpload">
      <progress className="progressbar" value={progress} max="100"/>
      <input
        type="text"
        placeholder="Enter a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
