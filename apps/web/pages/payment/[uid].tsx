import PaymentPage from "@calcom/features/ee/payments/components/PaymentPage";
import TokenPaymentPage from "@calcom/features/ee/payments/components/TokenPaymentPage";
import { getServerSideProps } from "@calcom/features/ee/payments/pages/payment";
import type { inferSSRProps } from "@calcom/types/inferSSRProps";

import PageWrapper from "@components/PageWrapper";

export default function Payment(props: inferSSRProps<typeof getServerSideProps>) {
  console.log("I'm here ---paragon")
  return <PaymentPage {...props} />;
  // return <TokenPaymentPage {...props} />;
}
Payment.PageWrapper = PageWrapper;
export { getServerSideProps };
