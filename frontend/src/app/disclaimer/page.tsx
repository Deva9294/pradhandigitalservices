import LegalPage from "@/components/common/LegalPage";
import { siteConfig } from "@/config/site";

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer">
      <p>{siteConfig.disclaimer.en}</p>
      <p>{siteConfig.disclaimer.hi}</p>
    </LegalPage>
  );
}
