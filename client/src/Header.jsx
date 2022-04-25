export default function Header(props){
  return (
    <header>
    <img className="gp-img" src="../public/gpa-icon.png"/>
      <h1>GPA Confession</h1>
      <a onClick={props.onClick} className="btn" >{props.name}  {props.name === "Login" ? <i className="fa fa-sign-in" aria-hidden="true"></i> : <i className="fa fa-sign-out" aria-hidden="true"></i>}</a>
    </header>
  );  
  }