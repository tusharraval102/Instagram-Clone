import React from "react";
import "./index.css";
import { useState, useParams } from "react";
import "./data/database.json";
import firebase from "firebase";
import { database, storage } from './firebase';
import { Button, TextField } from "@material-ui/core";



const CreatePost = () => {

    const [username, setUsername] = useState("");
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");

    const handleChange = e => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleSubmit = () => {
        const uploadImage = storage.ref(`images/${image.name}`).put(image);

        uploadImage.on(
            "state_changed",
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        database.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            description: description,
                            location: location,
                            image: url,
                            username: "someone",
                            likes: 0
                        });
                        setImage = null;
                        setDescription = "";
                        setLocation = "";
                    });
            }
        );
    };



    return (
        // <div className="create">
        // <h5 class="title"> Create a new Post ! </h5>
        // <form>
        // <table>
        //     <td>
        //         <tr><label> Write your description: </label></tr>
        //         <tr><textarea type="text" name="description" onfocus="this.value=''" value = { description } required onChange = { (e) => setDescription(e.target.value) }/></tr>
        //     </td>
        //     <td>
        //         <tr><label>Where are you ?</label></tr>
        //         <tr><input type="text" value={ location } required onChange = { (e) => setLocation(e.target.value)}/></tr>
        //     </td>
        // </table>
        // <br/>&nbsp;
        // <label for = "file"> Select the image you want to share: </label><br/>&nbsp;
        // <input type="file" id = "image" name="create-image" accept="image/png, image/jpeg, image/jpg" value={ image } required onChnage = { handleChange }/>
        // <br /> <br />&nbsp;
        // <button type="submit" onClick={ handleSubmit }> <h4>Post</h4> </button> 
        // </form> <br/>
        // <p><b> &nbsp; &nbsp; {Nickname}</b></p>
        // <p class="location"> &nbsp; &nbsp; {location} </p> <br/>
        // <p>{picture}</p><br/>
        // <p> <b> &nbsp; &nbsp; {Nickname}</b> &nbsp; { description } </p>
        // </div>

        <center className="postUploadContainer">
            <form className="postUploadForm" noValidate autoComplete="off">
                <h1 className="postFormTitle">New Post</h1>
                <TextField
                    type="text"
                    label="Username"
                    placeholder="Your Username"
                    variant="outlined"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    type="text"
                    label="Location"
                    placeholder="Montreal, QC"
                    variant="outlined"
                    onChange={(e) => setLocation(e.target.value)}
                />
                <TextField
                    type="text"
                    label="Image"
                    placeholder="Image URL"
                    variant="outlined"
                    onChange={(e) => setImage(e.target.value)}
                />
                <TextField
                    label="What's on your mind?"
                    placeholder="Post Description"
                    multiline
                    rows={4}
                    variant="outlined"
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button color="secondary" onClick={handleSubmit}>Post</Button>
            </form>
        </center>


    );
};

export default CreatePost;