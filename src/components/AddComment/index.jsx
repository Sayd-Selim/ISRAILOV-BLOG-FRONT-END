import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";

export const Index = () => {
  const {data} = useSelector(state => state.auth)
  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={data?.avatarUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNJqxCzhVRrUBUNpyz-e74mtn28OI9fwhLKUUApAeLyxSfN8B61bAE8G11NZanJZC2eAo&usqp=CAU'}
        />
        <div className={styles.form}>
          <TextField
            label="Охь яз е комментари натуре"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
          />
          <Button variant="contained">Отправить</Button>
        </div>
      </div>
    </>
  );
};
