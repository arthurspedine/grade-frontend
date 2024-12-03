'use client'

import React from 'react'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client'

function Profile() {
  const { user, isLoading } = useUser()

  return (
    <>
      {isLoading && 'circle'}
      {user && (
        <>
          <div
            className='align-items-center profile-header mb-5 text-center text-md-left'
            data-testid='profile'
          >
            <li>
              <img
                src={user.picture ? user.picture : ''}
                alt='Profile'
                className='rounded-circle img-fluid profile-picture mb-3 mb-md-0'
                data-testid='profile-picture'
              />
            </li>
            <li>
              <h2 data-testid='profile-name'>{user.name}</h2>
              <p className='lead text-muted' data-testid='profile-email'>
                {user.email}
              </p>
            </li>
          </div>
          <div data-testid='profile-json'>{JSON.stringify(user, null, 2)}</div>
        </>
      )}
    </>
  )
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <div>circle</div>,
  onError: error => <div>{error.message}</div>,
})
