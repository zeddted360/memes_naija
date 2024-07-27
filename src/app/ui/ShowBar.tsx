'use client';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from './sidebar';
import { useTheme } from '@/hooks/useTheme';
import { useSession } from "next-auth/react";


const ShowBar = () => {
 
  const session = useSession();
    
  const { state, dispatch } = useTheme();
  const [showBar, setShowBar] = useState(false);
  return (
      <div>
        <button
          className="mb-2 md:hidden"
          onClick={() => {
            setShowBar((prevState: boolean) => !prevState);
          }}
        >
          {showBar ? (
            <span className="text-2xl  font-bold">&times;</span>
          ) : (
            <FontAwesomeIcon style={{ width: 30, height: 30 }} icon={faBars} />
          )}
        </button>
        {showBar && (
          <Sidebar session={session} state={state} dispatch={dispatch} setShowBar={setShowBar} />
        )}
      </div>
  );
};

export default ShowBar;
