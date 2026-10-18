import { Metadata } from 'next';

export function generateMetadata(options: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pradhandigitalservices.in';
  const url = options.path ? `${baseUrl}${options.path}` : baseUrl;
  const imageUrl = options.image || `${baseUrl}/brand-icon.svg`;

  return {
    title: options.title,
    description: options.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url,
      siteName: 'Pradhan Digital Services',
      title: options.title,
      description: options.description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: options.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: options.description,
      images: [imageUrl],
    },
    robots: {
      index: !options.noIndex,
      follow: !options.noIndex,
      googleBot: {
        index: !options.noIndex,
        follow: !options.noIndex,
      },
    },
  };
}

export function generateSchema(options: {
  type: 'Organization' | 'Service' | 'Article' | 'FAQPage' | 'JobPosting';
  data: any;
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pradhandigitalservices.in';

  const schemas: Record<string, any> = {
    Organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Pradhan Digital Services',
      url: baseUrl,
      logo: `${baseUrl}/brand-icon.svg`,
      description: 'Private Digital Service Centre - Online Service Assistance Portal',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Madhya Pradesh',
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91 9294899787',
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi'],
      },
      sameAs: [
        'https://wa.me/919294899787',
      ],
    },
    Service: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: options.data.name,
      description: options.data.description,
      provider: {
        '@type': 'Organization',
        name: 'Pradhan Digital Services',
      },
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
      availableLanguage: ['English', 'Hindi'],
    },
    Article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: options.data.title,
      description: options.data.description,
      author: {
        '@type': 'Organization',
        name: 'Pradhan Digital Services',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Pradhan Digital Services',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/brand-icon.svg`,
        },
      },
      datePublished: options.data.publishedAt,
      dateModified: options.data.updatedAt,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': options.data.url,
      },
    },
    FAQPage: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: options.data.faqs.map((faq: any) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
    JobPosting: {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: options.data.title,
      description: options.data.fullDescription || options.data.description,
      datePosted: options.data.postedDate,
      validThrough: options.data.validThrough,
      hiringOrganization: {
        '@type': 'Organization',
        name: options.data.organization,
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: options.data.location,
          addressCountry: 'IN',
        },
      },
      employmentType: options.data.employmentType,
      identifier: {
        '@type': 'PropertyValue',
        name: options.data.advertisementNumber,
        value: options.data.advertisementNumber,
      },
    },
  };

  return JSON.stringify(schemas[options.type]);
}