import React, { useEffect, useState } from "react";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from 'react-markdown'

export const FullPost = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]); // Отдельное состояние для комментариев
  const stateIdFroComment = Math.random() * 10000000000000000
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/posts/${id}`);
        setData(data);
        setComments(data.comments || []); // Инициализируем комментарии
        setIsLoading(false);
      } catch (error) {
        console.warn(error);
        alert('Ошибка при получении статьи!');
      }
    };

    fetchData();
  }, [id]);

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  const DeleteComment = async (paramFromCommentDelete) => {
     await axios.post(`/posts/${paramFromCommentDelete.postId}/deleteComment`, paramFromCommentDelete)
    setComments((prevComments) => [...prevComments].filter(elem => elem.commentId !== paramFromCommentDelete.commentId));
  }

  if (isLoading) {
    return <Post isLoading={isLoading} />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={comments.length} // Используем длину comments
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock items={comments} isLoading={false} DeleteComment={DeleteComment} permission={true}>
        <Index
          stateIdFroComment={stateIdFroComment}
          onCommentAdded={handleCommentAdded} // Передаем функцию добавления комментария
        />
      </CommentsBlock>
    </>
  );
};

