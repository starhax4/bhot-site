import React from "react";

const TermsText = () => {
  // Data structure for the privacy policy content, based on Image 4
  const sections = [
    {
      id: 1,
      title: "Acceptance of Terms",
      content: [
        {
          type: "paragraph",
          text: "By accessing or using this Website, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions, together with our Privacy Policy. If you do not accept these terms, you must not use this Website.",
        },
      ],
    },
    {
      id: 2,
      title: "Intellectual Property",
      content: [
        {
          type: "paragraph",
          text: "All content available on the Website — including text, graphics, logos, designs, data compilations, and software — is the intellectual property of Best House on the Street Limited or its licensors, except where explicitly stated, and is protected under applicable copyright, trademark, and intellectual property laws. No content may be reproduced, distributed, or republished without prior written consent.",
        },
      ],
    },
    {
      id: 3,
      title: "Acceptable Use",
      content: [
        {
          type: "paragraph",
          text: "You agree not to use the Website:",
        },
        {
          type: "list",
          items: [
            "For any unlawful, fraudulent, or harmful purpose;",
            "To interfere with the Website’s operation or disrupt access to other users;",
            "To distribute or install malware or unauthorized data harvesting tools.",
          ],
        },
        {
          type: "paragraph",
          text: "Unauthorized use may give rise to a claim for damages and/or be a criminal offence.",
        },
      ],
    },
    {
      id: 4,
      title: "Data and Research Content – Disclaimer",
      content: [
        {
          type: "paragraph",
          text: 'The Website may provide access to data-driven reports, research content, analytical tools, and property market insights ("Materials"). These Materials are based on proprietary databases, independent research, and historical data sourced from publicly available external datasets, including, but not limited to, UK Land Registry data, Energy Performance Certificates (EPC) records, the House Price Index (HPI), and other governmental, commercial, and academic sources.',
        },
        {
          type: "paragraph",
          text: "The Materials are intended for general informational purposes only. They:",
        },
        {
          type: "list",
          items: [
            "Are based on historical data, proprietary modeling, and statistical inference;",
            "Do not constitute legal, financial, investment, real estate, or other professional advice;",
            "Should not be relied upon for decision-making without independent verification and consultation with qualified professionals.",
          ],
        },
        {
          type: "paragraph",
          text: 'Best House on the Street Limited makes no representations or warranties, express or implied, regarding the accuracy, completeness, or reliability of the Materials. All Materials are provided "as is" and "as available." Use of such Materials is at your own risk. We accept no liability for any loss, damage, or consequences arising from reliance on the Materials.',
        },
      ],
    },
    {
      id: 5,
      title: "Third-Party Links",
      content: [
        {
          type: "paragraph",
          text: "This Website may contain links to external websites that are not operated by us. We are not responsible for the content or availability of these sites, nor do we endorse them. Use of third-party sites is at your own risk.",
        },
      ],
    },
    {
      id: 6,
      title: "Limitation of Liability",
      content: [
        {
          type: "paragraph",
          text: "To the maximum extent permitted by law, Best House on the Street Limited disclaims all liability for any direct, indirect, incidental, consequential, or punitive damages arising out of or relating to your use of (or inability to use) the Website or any of its content, including the Materials.",
        },
      ],
    },
    {
      id: 7,
      title: "Governing Law",
      content: [
        {
          type: "paragraph",
          text: "These Terms shall be governed by and interpreted in accordance with the laws of England & Wales, and any disputes shall be subject to the exclusive jurisdiction of the courts of that jurisdiction.",
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
        <h1 className="text-primary font-bold  mb-6">Terms & Conditions</h1>
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

export default TermsText;
