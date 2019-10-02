import React, {useState, useEffect, useRef} from 'react';

import loading from '../static/svg/loading.svg'

export function Loading(){
    return <div className="center vh-100"><img className="center w-15-ns w-25 pa5" src={loading} alt="loading"/></div>
  }