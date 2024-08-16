import React, { useEffect, useState } from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from 'react-markdown'

export const FullPost = () => {

  const [data, setData] = useState()
  const [isLoading, setIsloading] = useState(true)

  const {id} = useParams()

  useEffect(() => {
    try {
      async function Thunk() {
        const {data} = await axios.get(`/posts/${id}`)
        setData(data)
        setIsloading(false)
       }
   
       Thunk()
    } catch (error) {
      console.warn(error)
      alert('Ошибка при получении статьи !')
    }
    
  },[])

  if(isLoading) {
    return <Post isLoading={isLoading}/>
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl}
        // imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
      <ReactMarkdown children={data.text}/>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: 'Асхьаб Unicode',
              avatarUrl: 'https://ndelo.ru/media/posts/2017/7/4/pochemu-lyudi-boya/%D1%80%D0%B5%D0%BB%D0%B8%D0%B3%D0%B8%D1%8F.thumb.jpg'
            },
            text: 'Ма шаа АЛЛАХ1'
          },
          {
            user: {
              fullName: 'Юсуп Unicode',
              avatarUrl: 'https://mui.com/static/images/avatar/2.jpg'
            },
            text: 'Крутое прилижение ! Я доволен !'
          }
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
