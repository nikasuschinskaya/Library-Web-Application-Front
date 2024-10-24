import React from 'react';
import { Link } from 'react-router-dom';

import styles from './header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Book Library</h1>
      {/* <nav className='nav'>
        <Link to='/'>Главная страница</Link>
        <Link to='todo'>Список дел</Link>
      </nav> */}
    </header>
  );
}