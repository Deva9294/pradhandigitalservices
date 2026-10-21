import LegalPage from "@/components/common/LegalPage";

export default function DeliveryPolicyPage() {
  return (
    <LegalPage title="Shipping & Delivery Policy">
      <p>
        Pradhan Digital Services provides both electronic (digital vault PDF) and physical (doorstep speed post)
        document delivery services across Madhya Pradesh and India.
      </p>
      <h3 className="text-base font-bold text-navy-900 dark:text-white mt-4 mb-2">1. Digital Delivery</h3>
      <p>
        Digital receipts, application acknowledgements, and electronic certificates are delivered to your Customer Dashboard
        and via WhatsApp/Email immediately upon completion of official processing. Digital deliveries incur zero shipping charges.
      </p>
      <h3 className="text-base font-bold text-navy-900 dark:text-white mt-4 mb-2">2. Physical Speed Post Dispatch</h3>
      <p>
        Where physical PVC smart cards, laminated certificates, or offline printed applications are requested, items are
        dispatched within 24 to 48 hours of official approval through India Post Speed Post. Delivery typically takes 3 to 7
        business days depending on the recipient&apos;s pincode.
      </p>
      <h3 className="text-base font-bold text-navy-900 dark:text-white mt-4 mb-2">3. Tracking &amp; Consignments</h3>
      <p>
        Upon dispatch, an official 13-digit India Post tracking consignment number is updated in the customer dashboard and sent
        via SMS/WhatsApp for live parcel tracking.
      </p>
    </LegalPage>
  );
}
