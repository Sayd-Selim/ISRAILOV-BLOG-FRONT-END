import React, { useState } from "react";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "../../axios";

export const Index = ({ stateIdFroComment , onCommentAdded }) => {
  const { data } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [stateComment, setStateComment] = useState('');
  const [stateResponseFromServer, setResponseFromServer] = useState('');

  const addComment = async () => {
    try {
      if (stateComment) {
        const newComment = {
          postId: id,
          comment: stateComment,
          commentId: stateIdFroComment,
          authorСomment: data,
        };
          const responseFromServer = await axios.post(`/posts/${id}/addComment`, {...newComment})
          setResponseFromServer(responseFromServer.data || responseFromServer.data)

          if(!responseFromServer.data.Error) {
            setStateComment('');
            onCommentAdded(newComment); 
          }

      }
    } catch (error) {
      console.warn('Ошибка при отправке комментария:', error);
    }
  };
  

  return (
    <div className={styles.root}>
      <Avatar classes={{ root: styles.avatar }} src={`${process.env.REACT_APP_API_URL}${data?.avatarUrl}` || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNJqxCzhVRrUBUNpyz-e74mtn28OI9fwhLKUUApAeLyxSfN8B61bAE8G11NZanJZC2eAo&usqp=CAU'} />
      <div className={styles.form}>
      <TextField
        label={"Написать комментарий"}
        variant="outlined"
        maxRows={10}
        multiline
        fullWidth
        error={stateResponseFromServer?.Error}
        helperText={stateResponseFromServer?.Error && stateResponseFromServer.Error || stateResponseFromServer.message}
        value={stateComment}
        onChange={(e) => setStateComment(e.target.value)}
        FormHelperTextProps={{
          sx: {
            color: stateResponseFromServer?.Error ? 'red' : 'green',
            fontSize: '15px',
          },
        }}
      />
        <Button variant="contained" onClick={addComment}>
          Отправить
        </Button>
      </div>
    </div>
  );
};

