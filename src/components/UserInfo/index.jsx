import React from 'react';
import styles from './UserInfo.module.scss';

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  return (
    <div className={styles.root}>
      <img className={styles.avatar} src={`${process.env.REACT_APP_API_URL}${avatarUrl}` || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNJqxCzhVRrUBUNpyz-e74mtn28OI9fwhLKUUApAeLyxSfN8B61bAE8G11NZanJZC2eAo&usqp=CAU'} alt={fullName} />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{additionalText.slice(0,10).split('-').reverse().join('-') + 'г'}</span>
      </div>
    </div>
  );
};
