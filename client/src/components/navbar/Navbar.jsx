import React from 'react'
import classes from './navbar.module.css'
import { Link, useNavigate } from 'react-router-dom'
import person from '../../assets/person1.jpg'
import { AiOutlineSearch } from 'react-icons/ai'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const Navbar = () => {
  const [showModal, setShowModal] = useState(false)
  const {user} = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const toggleModal = () => {
    setShowModal(prev => !prev)
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/auth')
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <Link to='/'>
            <h3>WebDevMania</h3>
          </Link>
        </div>
        <div className={classes.right}>
          <form className={classes.searchForm}>
            <input type="text" placeholder='Search profile...' />
            <AiOutlineSearch className={classes.searchIcon} />
          </form>
          <img src={person} className={classes.personImg} onClick={toggleModal} />
          {showModal && (
            <div className={classes.modal}>
              <span onClick={handleLogout} className={classes.logout}>logout</span>
              <Link to={`/updateProfile/${user._id}`} className={classes.updateProfile}>Update Profile</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar