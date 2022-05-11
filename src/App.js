import './App.css';
import Recorder from "./components/Recorder"
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
    <Recorder />
   <ToastContainer
  position="top-right"
  autoClose={1000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme =  "dark"
  transition = {Zoom}
  
  />
    </>
   
  );
}

export default App;
