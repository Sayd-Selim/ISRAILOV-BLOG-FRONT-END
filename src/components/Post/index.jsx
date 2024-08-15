import React from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeleteOnePost } from '../../redux/posts';

export const Post = ({
  _id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
 
/*
  ШАГИ ПО УДАЛЕНИЮ СТАТЬИ:
  1) НА ONCLICK `УДАЛИТЬ` ВЕЩАЕМ ФУНКЦИЮ И ПЕРЕДАЕМ ТУДА ID ИЗ ПОСТА +
  2) И В ЭТОЙ ФУНКЦИИ ОТПРАВЛЯЕМ ЗАПРОС НА СЕРВЕР ЧЕРЕЗ DISPATCH И ПЕРЕДАЕМ ТУДА НАШ ID +
  3) И В НАШ ЗАПРОС ПЕРЕДАЕМ ТОТ ID ИЗ ПОСТА, ПОТОМУ ЧТО, ЕЁ ТРЕБУЕТ НАШ APP.DELETE(ЗДЕСЬ !) +
  4) И ПОТОМ БАЗА ДАННЫХ УДАЛЯЕТ ИЗ СЕБЯ ТОТ ПОСТ У КОТОРОГО ЕСТЬ НАШ ПЕРЕДАННЫЙ ID, 
  КАК МЫ ЗНАЕМ У КАЖДОГО ПОСТА ЖЕ ЕСТЬ ID. +
  5) ПОТОМ СЕРВЕР ВОЗВРАЩАЕТ ИНФОРМАЦИЮ О ТОМ КАКОЙ ПОСТ МЫ УДАЛИЛИ + ТАМ ЕСТЬ ЕГО ID, ТО ЕСТЬ, ID ПОСТА +
  6) ПОТОМ ИДЕМ В FULFILLED И УДАЛЯЕМ ИЗ МАССИВА НАШ ПОСТ +
  
  РЕЗЮМИРУЯ: СНАЧАЛА УДАЛЯЕМ ПОСТ ИЗ БАЗЫ ДАННЫХ ПОТОМ БАЗА ДАННЫХ ГОВОРИТ ФРОНТУ:
  - ПОМНИШЬ Я ОТПРАВИЛ ТЕБЕ МАССИВ С n-количеством постов С ID? 
  - да !
  - КЛИЕНТ ХОТЕЛ УДАЛИТЬ ПОСТ У СЕБЯ И ОН ОТПРАВИЛ МНЕ ID, И Я УДАЛИЛ ЭТОТ ПОСТ
  ТЕПЕРЬ НУЖНО УДАЛИТЬ ЕЕ ИЗ ФРОНТА ТО ЕСТЬ ИЗ МАССИВА КОТОРЫЙ Я ПЕРЕДАЛ ТЕБЕ
  ЧТОБЫ НЕ ПРИХОДИЛОСЬ ОБНОВЛЯТЬ СТРАНИЦУ, ПОТОМУ ЧТО, КОГДА ТЫ ОБНОВИШЬ СТРАНИЦУ ТО Я ОТДАМ ТЕБЕ НОВЫЙ МАССИВ
  ГДЕ НЕТ ТОГО ПОСТА, ЧТОБЫ ЭТОГО НЕ СДЕЛАТЬ, ТЫ ТОЖЕ УДАЛИ У СЕБЯ !
  - ОКЕЙ СДЕЛАЮ, ПЕРЕДАЙ МНЕ ТОГДА ID ПОСТА
  - ОКЕЙ !
*/ 
  const {data} = useSelector(state => state.auth)
  const isAuth = Boolean(data)
  const dispatch = useDispatch()


  const onClickRemove = async (_id) => {
    if(isAuth && window.confirm('Вы хотите удалить статью ?')) {
      const reternedAction = await dispatch(fetchDeleteOnePost(_id))
      console.log('reternedAction',reternedAction);
    }
  };



  if (isLoading) {
    return <PostSkeleton />;
  }


  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${_id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={() => onClickRemove(_id)} color="secondary">
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
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/posts/${_id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags.join().split(',').map((name) => (
              <li key={name}>
                <Link to={`/tag/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
