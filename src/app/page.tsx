import QuizComponent from "@/components/QuizComponent";

export default function Page() {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: "https://quizbells.com",
      },
    ],
  };

  return (
    <>
      <script
        id="structured-data-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <QuizComponent />
    </>
  );
}
