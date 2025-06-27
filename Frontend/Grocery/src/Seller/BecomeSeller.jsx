import React from 'react'
import { useRef } from "react";
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
