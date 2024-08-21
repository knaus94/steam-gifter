import { useTranslation } from 'react-i18next';
import Banner from '../../components/Banner/Banner';
import Footer from '../../components/Footer/Footer';
import GlobalError from '../../components/GlobalError/GlobalError';
import Header from '../../components/Header/Header';
import OurInfo from '../../components/OurInfo/OurInfo';
import ProductInfo from '../../components/ProductInfo/ProductInfo';
import QrCode from '../../components/QrCode/QrCode';
import Status from '../../components/Status/Status';
import { useClientContext } from '../../context/ClientContext';
import './MainPage.scss';
const MainPage = () => {
	const { t } = useTranslation();
	const { isGlobalError } = useClientContext();

	return (
		<>
			<Header />
			<ProductInfo />
			<div className="main-wrap">
				<Status />
				<div className="banners-wrap">
					<QrCode />
					<Banner />
				</div>
			</div>
			<Footer />
			<OurInfo />
			{isGlobalError && <GlobalError />}
		</>
	);
};

export default MainPage;
