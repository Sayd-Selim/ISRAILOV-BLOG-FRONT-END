import React, { useState } from 'react'
import clsx from 'clsx'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import styles from './Post.module.scss'
import { UserInfo } from '../UserInfo'
import { PostSkeleton } from './Skeleton'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDeleteOnePost } from '../../redux/posts'
import { Checkbox } from '@mui/material'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Favorite from '@mui/icons-material/Favorite'
import axios from '../../axios'

export const Post = ({
  _id,
  title,
  createdAt,
  imageUrl,
  like,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable
}) => {

  const { data } = useSelector(state => state.auth);
  const isAuth = Boolean(data);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(data?.likedPosts.find(elem => elem.postId === _id) || false);
  const [stateLike, setStateLike] = useState(like);



  const onClickRemove = async _id => {
    if (isAuth && window.confirm('Вы хотите удалить статью ?')) {
        dispatch(fetchDeleteOnePost(_id))
    }
  }


  if (isLoading) {
    return <PostSkeleton />
  }


  // Обработчик изменений для чекбокса
  const handleChange = async (event) => {
    setChecked(event.target.checked);
    await axios.post(`/posts/${_id}/like`, {checked})
    
    setStateLike(!checked && stateLike + 1 || stateLike - 1)
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${_id}/edit`}>
            <IconButton color='primary'>
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={() => onClickRemove(_id)} color='secondary'>
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
        className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
        src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
        alt='Изображение не загружено !'
      />
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          <h2
            className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
          >
            {isFullPost ? title : <Link to={`/posts/${_id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags
              .join()
              .split(',')
              .map(name => (
                <li key={name}>
                  <Link to={`/tag/${name}`}>#{name}</Link>
                </li>
              ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon style={{ fontSize: 22, color: 'gray' }}/>
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon style={{ fontSize: 22, color: 'gray' }}/>
              <span>{commentsCount}</span>
            </li>
            <li>
              <Checkbox
                disabled={!isAuth}
                checked={checked}  // Связываем состояние с компонентом
                onChange={handleChange}  // Добавляем обработчик изменений
                icon={<FavoriteBorder style={{ fontSize: 22, color: 'gray' }} />}
                checkedIcon={<Favorite style={{ fontSize: 22, color: 'red' }} />}
                sx={{ padding: 0 }}
              />
              <span>{stateLike}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
