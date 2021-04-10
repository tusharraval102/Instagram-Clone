import React from "react";
import { useState, useEffect } from "react";
import firebase from "firebase";
import { database } from "../firebase/firebase";
import Button from "@material-ui/core/Button";
import "../index.css";
import { useRef } from "react";
import UnFollow from "./Unfollow";
import "../index.css";



const Follow = () => {
  const [users, setUsers] = useState([]);
  // const [followed, setFollowed] = useState(false);
  let btnRef = useRef();

  useEffect(() => {
    database.collection("users").onSnapshot((snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          user: doc.data().username,
        }))
      );
    });
  }, []);

  const followUser = (user) => {
    if (btnRef.current) {
      btnRef.current.setAttribute("disabled", "disabled");
    }
    database
      .collection("users")
      .doc(user)
      .collection("follower")
      .doc(firebase.auth().currentUser.displayName)
      .set({
        username: firebase.auth().currentUser.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    database
      .collection("users")
      .doc(firebase.auth().currentUser.displayName)
      .collection("following")
      .doc(user)
      .set({
        username: user,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };



  return (

    <div className="test-container">
        <h4 className="follow-hoverButton">
          Explore
        </h4>

      <div className="follow-container">
        
        <div className="follow-userContainer">
          <h3 className="follow-groupTitle"> People you may know: </h3>
          {users.map(({ user }) => (
            <div>
              {user !== firebase.auth().currentUser.displayName && (
                <div className="follow-userLine">
                  <div className="follow-userName">
                    {user}
                  </div>
                  <Button  variant="contained" color="primary" ref={btnRef} onClick={() => followUser(user)}>
                    Follow
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      
        <div>
          <h3 className="follow-groupTitle"> Following: </h3>
          <UnFollow />
        </div>
      </div>
    </div>
  );
};

export default Follow;

//TO implement next sprint -> this is for removing users that are already being followed.
// useEffect(() =>
//         firebase.auth().onAuthStateChanged(function (user) {
//             if (user) {
//                 users.map(({ user }) => (
//                     database.collection('users').doc(firebase.auth().currentUser.displayName).collection('following').doc(user).get().then((doc) => {
//                         if (doc.exists) {
//                             setFollowed(true)
//                         }
//                         else {
//                             setFollowed(false)
//                         }
//                     }),
//                     console.log(user + " " + followed)
//                 ))
//             } else {
//                 // No user is signed in.
//             }
//         }
//         )
// )
