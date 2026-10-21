import LegalPage from "@/components/common/LegalPage";

export default function SubscriptionTermsPage() {
  return (
    <LegalPage title="Subscription Terms & Conditions">
      <p>
        These terms govern the Pradhan Digital Services Premium Membership plans (&quot;Monthly Plan&quot; and &quot;Annual Citizen Pro Plan&quot;).
      </p>
      <h3 className="text-base font-bold text-navy-900 dark:text-white mt-4 mb-2">1. Plan Benefits &amp; Validity</h3>
      <p>
        Monthly Membership (₹99) is valid for 30 consecutive calendar days from activation and includes zero PDS service charge on up
        to 3 applications and 1 free laminated Speed Post delivery. Annual Citizen Pro (₹499) is valid for 365 days and includes
        unlimited zero PDS service charge on eligible digital applications and 6 free Speed Post dispatches.
      </p>
      <h3 className="text-base font-bold text-navy-900 dark:text-white mt-4 mb-2">2. Official Government Fees</h3>
      <p>
        PDS Premium covers PDS operator assistance and facilitation charges. Statutory government examination fees, portal charges,
        or department stamp duties (if applicable for a specific recruitment or certificate) remain payable as mandated by official rules.
      </p>
      <h3 className="text-base font-bold text-navy-900 dark:text-white mt-4 mb-2">3. Cancellation &amp; Non-Transferability</h3>
      <p>
        Memberships are personal to the registered user or their immediate family household and cannot be transferred to commercial third-party
        operators. You may cancel your subscription renewal at any time via your Customer Dashboard or by contacting customer support.
      </p>
    </LegalPage>
  );
}
