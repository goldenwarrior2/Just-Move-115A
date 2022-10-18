import { Login } from './Login';
import { Register } from './Register';

export function LoginAndRegisterPage() {

  return (
    <div className="m-5">
      <h1 className="display-1 text-center" style={{color: '#38ACEC'}}>Just Move</h1> {/*color is called butterfly blue*/}
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
  )
}