import React, {useState, useEffect, useRef} from 'react';
import {BrowserRouter, Route, Link, Redirect, Switch} from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import { setServers } from 'dns';
import { array, number } from 'prop-types';

import {Header} from './component/sections';
import {Comments} from './controller/comments';
import {News} from './controller/news';






const App: React.FC = () =>{

  return <BrowserRouter>
  <Route path="/" component={Header}></Route>
  <Switch>
  <Route exact path="/news" component={News}></Route>
  <Route path="/item/:id" component={Comments}></Route>
  <Redirect exact path="/" to="/news"></Redirect>
  </Switch>
  </BrowserRouter>

}

export default App;
