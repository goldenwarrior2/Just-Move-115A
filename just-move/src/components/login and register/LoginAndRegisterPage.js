import { Login } from './Login';
import { Register } from './Register';
import React from 'react';
import Animation from 'rsuite/Animation';

export function LoginAndRegisterPage() {

  return (
    <div style={{height: "100vh", width: "100vw",
    paddingTop: "75px"}}>
    <div className="m-5">
      <div>
      <Animation.Slide in={true} placement={React.useState('left')}>
        <h1 className="display-1 text-center" style={{color: "#000099"}}>Just Move</h1>
      </Animation.Slide>
        {/* <h1 className="display-1 text-center" style={{color: "#000099"}}>Just Move</h1> color is called butterfly blue */}
      </div>
      <div className="row row-cols-4 g-4 mt-5">
        <div className="col"></div>
        <div className="col">
            {<Login/>}
        </div>
        <div className="col">
            {<Register/>}
        </div>
      </div>
    </div>
    </div>
  )
}