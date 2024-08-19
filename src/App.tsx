import React, { ReactComponentElement } from 'react';
import logo from './logo.svg';
import './App.css';
import Post from './components/Post/Post';

function App(){
  return (
    <div className="main">
      <Post title='МОСТ' img="https://wallpapers.com/images/featured/a5u9zq0a0ymy2dug.jpg" comments={[{name:"Anton", comment:"Im son of Svorog"},{name:"Egor", comment:"Im son of Svorog too"}]}/>
    </div>
  );
}

export default App;
