import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { refreshUserProfile } from "../Redux/authThunk";
import BecomeSellerHero from './BecomeSellerHero'
import SellerBenefits from './SellerBenefits'
import HowItWorks from './HowItWorks'
import SellerRequirements from './SellerRequirements'
import SellerTestimonials from './SellerTestimonials'
import SellerRegistration from './SellerRegistration'
import SellerFAQ from './SellerFAQ'
import { SellerFinalCTA } from './SellerFinalCTA'

function BecomeSeller() {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // 1. Redirect if already approved
    if (user?.role === 'seller') {
      navigate('/seller-dashboard');
      return;
    }

    // 2. Poll for status change if PENDING
    let interval;
    if (user?.sellerStatus === 'PENDING') {
      interval = setInterval(() => {
        dispatch(refreshUserProfile(user.email));
      }, 30000); // Check every 30s
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user?._id, user?.sellerStatus, user?.role, navigate, dispatch, user?.email]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
    <BecomeSellerHero onRegisterClick={scrollToForm}/>
    <SellerBenefits/>
    <HowItWorks/>
    <SellerRequirements/>
    <SellerTestimonials/>
    <div ref={formRef}>
        <SellerRegistration />
    </div>
    <SellerFAQ/>
    <SellerFinalCTA/>
    </>
  )
}

export default BecomeSeller
