import Login from './components/user/Login'
import NavBar from "./components/NavBar"
import Notification from "./components/Notification"
import Loading from './components/Loading'
import ButtonNav from './components/ButtomNav'

const App = () => {
  return (
    <>
      <Loading />
      <Notification />
      <Login />
      <NavBar />
      <ButtonNav />
    </>
  )
}

export default App