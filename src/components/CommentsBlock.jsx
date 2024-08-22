import React from "react";
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Clear';
import { IconButton } from "@mui/material";

export const CommentsBlock = ({ items = [], children, isLoading = true, DeleteComment, permission }) => {
  const { data } = useSelector((state) => state.auth);

  return (
    <SideBlock title="Комментарии">
      <List>
        {(isLoading ? [...Array(5)] : items).map(({ comment, authorСomment, commentId, postId }, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={authorСomment?.fullName} src={authorСomment?.avatarUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNJqxCzhVRrUBUNpyz-e74mtn28OI9fwhLKUUApAeLyxSfN8B61bAE8G11NZanJZC2eAo&usqp=CAU'} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText primary={authorСomment?.fullName} secondary={comment} />
              )}
              { permission && data?.email === 'iftah_abwab@mail.ru' && (
                <IconButton color="secondary" onClick={() => DeleteComment({postId,commentId})}>
                    <DeleteIcon />
                </IconButton>
              ) || permission && authorСomment?.email === data?.email && (
                <IconButton color="secondary" onClick={() => DeleteComment({postId,commentId})}>
                    <DeleteIcon />
                </IconButton>
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};

