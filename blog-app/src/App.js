import axios from "axios";
import { Router } from "./Router";




function App() {

  const token = localStorage.getItem('JWTtoken')

  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

  return (
    <Router/>
  );
}

export default App;
