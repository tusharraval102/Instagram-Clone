import React, { useState, useEffect } from "react";
import "../index.css";
import Avatar from "@material-ui/core/Avatar";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import { database } from "../firebase/firebase";
import Comment from "./Comment";



const Post = ({ postId, commentId, user, username }) => {
  const [likeCounter, setLikeCounter] = useState(0);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  const handleLikeClick = () => {
    setLikeCounter((likeCounter) => {
      return likeCounter + 1;
    });
  };

  useEffect(() => {
    database
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []); 

  
  useEffect(() => {
    if (postId) {
      database
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({
              text: doc.data(),
              commentId : doc.id,
            }))
          );
        });
    }
  }, [postId]);

  return posts.map(({ id, post }) => (
    <div className="post" key={id}>
      <div className="post-header">
        <Avatar
          className="post-avatar"
          alt={post.username}
          src="/static/images/avatar/1.jpg"
          style={{ width: 35, height: 35 }}
        ></Avatar>
        <div className="post-meta">
          <h3 className="post-username">{post.username}</h3>
          <p className="post-location">{post.location}</p>
        </div>
      </div>

      <img className="post-image" src={post.image} alt="" />

      <div className="post-body">
        <div className="post-icons">
          <FavoriteBorder
            onClick={handleLikeClick}
            style={{ marginRight: 8, width: 20 }}
          />
          <ChatBubbleOutlineOutlinedIcon
            style={{ marginRight: 8, width: 20 }}
          />
        </div>

        <p className="post-like-number"> Liked by {likeCounter} people</p>

        <h4 className="post-description">
          <strong>{post.username}</strong> {post.description}
        </h4>

        <h3 className="post-comment">View all comments.</h3>

        <div className="post_comments">
          {comments.map((comment) => (
            <p>
              <h3> {username}</h3> {comments.comment}
            </p>
          ))}
        </div>
        <Comment postId={id} />
      </div>
    </div>
  ));
};

export default Post;