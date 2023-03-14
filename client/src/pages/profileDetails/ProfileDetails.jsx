import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import Profile from '../../components/profile/Profile'
import Sidebar from '../../components/sidebar/Sidebar'
import classes from './profileDetails.module.css'

const ProfileDetails = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <Navbar />
        <main className={classes.main}>
          <Sidebar />
          <Profile />
        </main>
      </div>
    </div>
  )
}

export default ProfileDetails