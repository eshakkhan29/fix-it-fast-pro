import Banner from './components/Banner';
import CtaAction from './components/CtaAction';

function HomePage() {
  return (
    <div className="max-w-[1280px] mx-auto pb-20 md:pb-0">
      <Banner />
      <CtaAction />
    </div>
  );
}

export default HomePage;
