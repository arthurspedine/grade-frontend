'use  client'

import React, { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoading } = useUser()
  const toggle = () => setIsOpen(!isOpen)

  return (
    <div className='nav-container' data-testid='navbar'>
      <nav className='w-full bg-slate-100'>
        <div>
          {/* LOGO */}
          <div>
            <nav className='mr-auto'>
              <li>
                <Link href='/' className='nav-link'>
                  Home
                </Link>
              </li>
              {user && (
                <>
                  <li>
                    <Link href='/csr' className='nav-link'>
                      Client-side rendered page
                    </Link>
                  </li>
                  <li>
                    <Link href='/ssr' className='nav-link'>
                      Server-side rendered page
                    </Link>
                  </li>
                  <li>
                    <Link href='/external' className='nav-link'>
                      External API
                    </Link>
                  </li>
                </>
              )}
            </nav>
            <nav className='d-none d-md-block'>
              {!isLoading && !user && (
                <li id='qsLoginBtn'>
                  <Link
                    href='/api/auth/login'
                    className='btn btn-primary btn-margin'
                    tabIndex={0}
                  >
                    Log in
                  </Link>
                </li>
              )}
              {user && (
                <div>
                  <div>
                    <img
                      src={user.picture ? user.picture : ''}
                      alt='Profile'
                      className='nav-user-profile rounded-circle'
                      width='50'
                      height='50'
                      data-testid='navbar-picture-desktop'
                    />
                  </div>
                  <div>
                    <div data-testid='navbar-user-desktop'>{user.name}</div>
                    <div className='dropdown-profile'>
                      <Link href='/profile'>Profile</Link>
                    </div>
                    <div id='qsLogoutBtn'>
                      <Link href='/api/auth/logout'>Log out</Link>
                    </div>
                  </div>
                </div>
              )}
            </nav>
            {!isLoading && !user && (
              <nav className='d-md-none'>
                <Link
                  href='/api/auth/login'
                  className='btn btn-primary btn-block'
                  tabIndex={0}
                >
                  Log in
                </Link>
              </nav>
            )}
            {/* {user && (
              <Nav
                id='nav-mobile'
                className='d-md-none justify-content-between'
                navbar
                data-testid='navbar-menu-mobile'
              >
                <li>
                  <span className='user-info'>
                    <img
                      src={user.picture}
                      alt='Profile'
                      className='nav-user-profile d-inline-block rounded-circle mr-3'
                      width='50'
                      height='50'
                      decode='async'
                      data-testid='navbar-picture-mobile'
                    />
                    <h6
                      className='d-inline-block'
                      data-testid='navbar-user-mobile'
                    >
                      {user.name}
                    </h6>
                  </span>
                </li>
                <li>
                  <Link
                    href='/profile'
                    icon='user'
                    testId='navbar-profile-mobile'
                  >
                    Profile
                  </Link>
                </li>
                <li id='qsLogoutBtn'>
                  <Link
                    href='/api/auth/logout'
                    className='btn btn-link p-0'
                    icon='power-off'
                    testId='navbar-logout-mobile'
                  >
                    Log out
                  </Link>
                </li>
              </Nav>
            )}*/}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavBar
