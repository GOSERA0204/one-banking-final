import HomeSummary from '../components/home/HomeSummary'
import QuickMenu from '../components/home/QuickMenu'
import AccountSection from '../components/home/AccountSection'

import '../styles/home01.css'

const HomePage = () => {
  return (
    <div className="home-page">
      <HomeSummary />
      <QuickMenu />
      <AccountSection />
    </div>
  )
}

export default HomePage