
import HomeSummary from '../components/home/HomeSummary'
import QuickMenu from '../components/home/QuickMenu'
import AccountSection from '../components/home/AccountSection'
import RecentTransactions from "../components/home/RecentTransactions";

//import '../styles/home01.css'
//import '../styles/home02.css'
import '../styles/home.css'

const HomePage = () => {
  return (
    <div className="home-page">
      <HomeSummary />
      <QuickMenu />
      <AccountSection />
      <RecentTransactions />
    </div>
  )
}

export default HomePage;