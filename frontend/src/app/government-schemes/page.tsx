import ResourceListPage from "@/components/common/ResourceListPage";

export default function GovernmentSchemesPage() {
  return (
    <ResourceListPage
      title="Government Schemes"
      titleHi="सरकारी योजनाएं"
      endpoint="/schemes"
    />
  );
}
