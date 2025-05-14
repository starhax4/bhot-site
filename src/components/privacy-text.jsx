import React from "react";

const PrivacyText = () => {
  // Data structure for the privacy policy content, based on Image 4
  const sections = [
    {
      id: 1,
      title: "Purpose of This Policy",
      content: [
        {
          type: "paragraph",
          text: "This Privacy Policy explains how we collect, use, and protect personal data provided through our Website. We are committed to safeguarding your privacy and complying with applicable data protection laws, including the UK GDPR.",
        },
      ],
    },
    {
      id: 2,
      title: "What Information We Collect",
      content: [
        {
          type: "paragraph",
          text: "We may collect and process the following types of data:",
        },
        {
          type: "list",
          items: [
            "Personal data you voluntarily provide (e.g. name, email address) through contact forms, subscriptions, or account registrations;",
            "Technical data automatically collected via cookies and analytics tools (e.g. IP address, browser type, device data, pages visited);",
            "Usage data to monitor performance and improve user experience.",
          ],
        },
      ],
    },
    {
      id: 3,
      title: "How We Use Your Data",
      content: [
        { type: "paragraph", text: "We use your information for:" },
        {
          type: "list",
          items: [
            "Responding to enquiries and providing services;",
            "Managing subscriptions and communications;",
            "Analysing Website traffic and trends;",
            "Maintaining Website security and compliance.",
          ],
        },
        {
          type: "paragraph",
          text: "We do not sell, rent, or trade your personal information.",
        },
      ],
    },
    {
      id: 4,
      title: "Legal Basis for Processing",
      content: [
        {
          type: "paragraph",
          text: "We process your personal data under the following lawful bases:",
        },
        {
          type: "list",
          items: [
            "Your consent (where applicable);",
            "Fulfilment of a contract or request;",
            "Compliance with legal obligations;",
            "Our legitimate interests (e.g. to improve services or safeguard security).",
          ],
        },
      ],
    },
    {
      id: 5,
      title: "Cookies",
      content: [
        {
          type: "paragraph",
          text: "We may use cookies to enhance Website performance and user experience. You can manage cookie preferences in your browser settings.",
        },
      ],
    },
    {
      id: 6,
      title: "Data Sharing and Transfers",
      content: [
        {
          type: "paragraph",
          text: "We may share your personal data with trusted service providers who process it on our behalf under strict data protection agreements. We do not transfer your personal data outside the UK or EEA unless appropriate safeguards are in place.",
        },
      ],
    },
    {
      id: 7,
      title: "Data Retention",
      content: [
        {
          type: "paragraph",
          text: "We retain your personal data only as long as necessary to fulfil the purposes it was collected for, including to comply with legal or regulatory obligations.",
        },
      ],
    },
    {
      id: 8,
      title: "Your Rights",
      content: [
        {
          type: "paragraph",
          text: "You have rights under applicable law to:",
        },
        {
          type: "list",
          items: [
            "Access your personal data;",
            "Request correction or deletion of your data;",
            "Withdraw consent at any time;",
            "Object to or restrict processing;",
            "Lodge a complaint with a supervisory authority.",
          ],
        },
        {
          type: "paragraph",
          text: "To exercise your rights, please contact us using the details below.",
        },
      ],
    },
  ];

  return (
    // Using the same main wrapper as your TermsText.jsx
    <main className="px-4 md:px-14 py-4 md:py-10 text-gray-700">
      {" "}
      {/* Added default text color */}
      <div className=" mx-auto">
        {" "}
        {/* Optional: to constrain width like typical policy pages */}
        {/* 
          Using h1 for semantic main title, styled like your strong tags.
          Adjust font size utilities (text-2xl, text-3xl etc.) as needed to match visual hierarchy.
        */}
        <h1 className="text-primary font-bold  mb-6">
          Privacy Policy
        </h1>
        <div className="mb-6 space-y-1 text-sm">
          <p>
            <strong className="text-primary font-bold">Effective Date:</strong>{" "}
            27th April 2025
          </p>
          <p>
            <strong className="text-primary font-bold">Owner:</strong> Best
            House on the Street Limited (the "Company", "we", "our", or "us")
          </p>
          <p>
            <strong className="text-primary font-bold">Website:</strong>{" "}
            www.bhots.co.uk
          </p>
        </div>
        <div className="space-y-6 text-sm md:text-base">
          {" "}
          {/* Base text size for content */}
          {sections.map((section) => (
            <section
              key={section.id}
              aria-labelledby={`section-title-${section.id}`}
            >
              {/* 
                Using h2 for semantic section titles, styled like your strong tags.
                Adjust font size utilities as needed.
              */}
              <h2
                id={`section-title-${section.id}`}
                className="text-primary font-bold mb-3"
              >
                {section.id}. {section.title}
              </h2>
              <div className="space-y-3">
                {section.content.map((item, index) => {
                  if (item.type === "paragraph") {
                    return <p key={index}>{item.text}</p>;
                  }
                  if (item.type === "list") {
                    return (
                      <ul
                        key={index}
                        className="list-disc list-outside pl-5 space-y-1"
                      >
                        {item.items.map((listItem, listItemIndex) => (
                          <li key={listItemIndex}>{listItem}</li>
                        ))}
                      </ul>
                    );
                  }
                  return null;
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default PrivacyText;