import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import FluidBackground from './components/FluidBackground';

const TermsOfService = () => {
  const [joinVisible, setJoinVisible] = useState(false);
  const joinRef = useRef(null);

  useEffect(() => {
    document.title = 'Terms of Service';
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === joinRef.current) {
              setJoinVisible(true);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (joinRef.current) {
      observer.observe(joinRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const contentStyle = {
    fontSize: 'clamp(14px, 1.3vw, 16px)',
    lineHeight: '1.7',
    fontWeight: '400',
    fontFamily: '"Inter", sans-serif',
  };

  const sectionStyle = {
    marginBottom: '40px',
  };

  const headingStyle = {
    fontSize: 'clamp(18px, 1.8vw, 22px)',
    fontWeight: '600',
    marginBottom: '16px',
    fontFamily: '"Inter", sans-serif',
  };

  const paragraphStyle = {
    ...contentStyle,
    margin: '0 0 16px 0',
  };

  const bulletStyle = {
    marginBottom: '10px',
  };

  const capsStyle = {
    ...contentStyle,
    textTransform: 'uppercase',
    fontWeight: '500',
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: 'white',
      fontFamily: '"Inter", sans-serif',
    }}>
      {/* Fluid Background Animation */}
      <FluidBackground />

      {/* Header/Navigation */}
      <Header activePage="" />

      {/* Hero Section */}
      <section
        className="terms-hero-section"
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '230px',
          paddingBottom: '40px',
          paddingLeft: 'clamp(16px, 3vw, 40px)',
          paddingRight: 'clamp(16px, 3vw, 40px)',
          backgroundColor: '#000',
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: '300',
            lineHeight: '1.1',
            margin: '0 0 40px 0',
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '-1px',
          }}>
            Terms of Service
          </h1>

          <div style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            fontSize: 'clamp(14px, 1.2vw, 16px)',
            fontWeight: '400',
          }}>
            Effective Date: Jul 18, 2025
          </div>
        </div>
      </section>

      {/* Terms of Service Content */}
      <section
        className="terms-content-section"
        style={{
          position: 'relative',
          zIndex: 3,
          padding: '40px clamp(16px, 3vw, 40px) 100px',
          backgroundColor: '#000',
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {/* Preamble */}
          <p style={paragraphStyle}>
            These Terms of Service ("Terms") are entered into by and between you and Formless, Inc., a Delaware corporation with its principal place of business at 12 Norumbega Street, Cambridge, MA 02138.
          </p>

          {/* 1. Introduction */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>1. Introduction</h2>
            <p style={paragraphStyle}>
              Welcome to Share, owned and operated by Formless, Inc. ("Formless," "we," "us", or "our"). These Terms of Service ("Terms") govern your access to and use of the Share website(s), our APIs, mobile app (the "App"), and any other software, tools, features, or functionalities provided on or in connection with our services; including without limitation using our services to create, view, and explore smart contracts and use our tools, at your own discretion, to connect directly with others to purchase, and sell access to content distributed using smart contracts on public blockchains (collectively, the "Service"). "Smart contract" in these Terms means a pay-for-access (PFA) smart contract. PFA smart contracts enable the price per access (e.g. view or listen) to be set to a nonzero value.
            </p>
            <p style={paragraphStyle}>
              For purposes of these Terms, "user", "you", and "your" means you as the user of the Service. If you use the Service on behalf of a company or other entity then "you" includes you and that entity, and you represent and warrant that (a) you are an authorized representative of the entity with the authority to bind the entity to these Terms, and (b) you agree to these Terms on the entity's behalf.
            </p>
            <p style={{
              ...paragraphStyle,
              fontWeight: '600',
              textTransform: 'uppercase',
            }}>
              PLEASE READ THESE TERMS OF SERVICE CAREFULLY AS THEY CONTAIN IMPORTANT INFORMATION AND AFFECT YOUR LEGAL RIGHTS. AS OUTLINED IN SECTION 16 BELOW, THEY INCLUDE A MANDATORY ARBITRATION AGREEMENT AND CLASS ACTION WAIVER WHICH (WITH LIMITED EXCEPTIONS) REQUIRE ANY DISPUTES BETWEEN US TO BE RESOLVED THROUGH INDIVIDUAL ARBITRATION RATHER THAN BY A JUDGE OR JURY IN COURT.
            </p>
            <p style={{
              ...paragraphStyle,
              fontWeight: '600',
              textTransform: 'uppercase',
            }}>
              BY CLICKING TO ACCEPT AND/OR USING OUR SERVICE, YOU AGREE TO BE BOUND BY THESE TERMS AND ALL OF THE TERMS INCORPORATED HEREIN BY REFERENCE. IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT ACCESS OR USE THE SERVICE.
            </p>
            <p style={paragraphStyle}>
              Formless is not a wallet provider, exchange, broker, financial institution, or creditor. Formless provides a peer-to-peer blockchain technology-based service that helps users discover and directly interact with each other and smart contracts available on public blockchains. We do not have custody or control over the smart contracts or blockchains you are interacting with. No smart contract transactions using the Service transfer ownership of the digital content of the smart contract between the seller and the purchaser, therefore no purchase grants ownership rights to the digital content.
            </p>
            <p style={paragraphStyle}>
              Formless is not a party to any agreement between any users. You bear full responsibility for verifying the identity, legitimacy, and authenticity of smart contracts that you purchase access to from third-party content creators using the Service and we make no claims about the identity, legitimacy, functionality, or authenticity of users or smart contracts (and any content associated with the smart contracts) visible on the Service.
            </p>
            <p style={paragraphStyle}>
              Because we have a growing number of services, we sometimes need to provide additional terms for specific services (and such services are deemed part of the "Service" hereunder and shall also be subject to these Terms). Those additional terms and conditions, which are available with the relevant service, then become part of your agreement with us if you use those services. In the event of a conflict between these Terms and any additional applicable terms we may provide for a specific service, such additional terms shall control for that specific service.
            </p>
            <p style={paragraphStyle}>
              Formless reserves the right to change or modify these Terms at any time and at our sole discretion. If we make material changes to these Terms, we will use reasonable efforts to provide notice of such changes, such as by providing notice through the Service or updating the "Last Updated" date at the beginning of these Terms. By continuing to access or use the Service, you confirm your acceptance of the revised Terms and all of the terms incorporated therein by reference effective as of the date these Terms are updated. It is your sole responsibility to review the Terms from time to time to view such changes and to ensure that you understand the terms and conditions that apply when you access or use the Service.
            </p>
          </div>

          {/* 2. Accessing the Service */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>2. Accessing the Service</h2>
            <p style={paragraphStyle}>
              Your blockchain address functions as your identity on Share. Accordingly, you will need a blockchain address and a third-party wallet to distribute content using the Service. By using your wallet in connection with the Service, you agree that you are using that wallet under the terms and conditions of the applicable provider of the wallet. Wallets are not operated by, maintained by, or affiliated with Formless, and Formless does not have custody or control over the contents of your wallet and has no ability to retrieve or transfer its contents. Formless accepts no responsibility for, or liability to you, in connection with your use of a wallet and makes no representations or warranties regarding how the Service will operate with any specific wallet. You are solely responsible for keeping your wallet secure and you should never share your wallet credentials or seed phrase with anyone. If you discover an issue related to your wallet, please contact your wallet provider.
            </p>
            <p style={paragraphStyle}>
              You also represent and warrant that you will comply with all applicable laws (e.g., local, state, federal, and other laws) when using the Service. Without limiting the foregoing, by using the Service, you represent and warrant that: (a) you are not located in a country that is subject to a U.S. Government embargo; and (b) you have not been identified as a Specially Designated National or placed on any U.S. Government list of prohibited, sanctioned, or restricted parties. If you access or use the Service outside the United States, you are solely responsible for ensuring that your access and use of the Service in such country, territory, or jurisdiction does not violate any applicable laws.
            </p>
            <p style={paragraphStyle}>
              Formless may require you to provide additional information and documents in certain circumstances, such as at the request of any government authority, as any applicable law or regulation dictates, or to investigate a potential violation of these Terms. In such cases, Formless, in its sole discretion, may block your ability to access the Service until such additional information and documents are processed by Formless. If you do not provide complete and accurate information in response to such a request, Formless may refuse to restore your access to the Service.
            </p>
            <p style={paragraphStyle}>
              Your access and use of the Service may be interrupted from time to time for any of several reasons, including, without limitation, the malfunction of equipment, periodic updating, maintenance, or repair of the Service, or other actions that Formless, in its sole discretion, may elect to take.
            </p>
            <p style={paragraphStyle}>
              We require all users to be at least 18 years old. If you are at least 13 years old but under 18 years old, you may only use Formless through a parent or guardian and with their approval and oversight. That account holder is responsible for your actions using the Service. It is prohibited to use our Service if you are under 13 years old.
            </p>
          </div>

          {/* 3. Ownership */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>3. Ownership</h2>
            <p style={paragraphStyle}>
              The Service, including its "look and feel" (e.g., text, graphics, images, logos, page headers, button icons, and scripts), proprietary content, information and other materials, and all content and other materials contained therein, including, without limitation, the Share logo and all designs, text, graphics, pictures, data, software, sound files, other files, and the selection and arrangement thereof are the proprietary property of Formless or our affiliates, licensors, or users, as applicable, and you agree not to take any action(s) inconsistent with such ownership interests. We and our affiliates, licensors, and users, as applicable, reserve all rights in connection with the Service and its content, including, without limitation, the exclusive right to create derivative works.
            </p>
            <p style={paragraphStyle}>
              Formless's name, logo, trademarks, and any Formless product or service names, designs, logos, and slogans are the intellectual property of Formless or our affiliates or licensors and may not be copied, imitated, or used, in whole or in part, without our prior written permission in each instance. You may not use any metatags or other "hidden text" utilizing "Formless" or any other name, trademark or product or service name of Formless or our affiliates or licensors without our prior written permission. In addition, the "look and feel" of the Service constitutes the service mark, trademark or trade dress of Formless and may not be copied, imitated, or used, in whole or in part, without our prior written permission.
            </p>
            <p style={paragraphStyle}>
              All other third-party trademarks, registered trademarks, and product names mentioned on the Service or contained in the content linked to or associated with any smart contracts displayed on the Service are the property of their respective owners and may not be copied, imitated, or used, in whole or in part, without the permission of the applicable intellectual property rights holder. Reference to any products, services, processes, or other information by name, trademark, manufacturer, supplier, or otherwise does not constitute or imply endorsement, sponsorship, or recommendation by Formless.
            </p>
            <p style={paragraphStyle}>
              We welcome feedback, comments, and suggestions for improvements to the Service ("Feedback"). You acknowledge and expressly agree that any contribution of Feedback does not and will not give or grant you any right, title, or interest in the Service or in any such Feedback. You agree that Formless may use and disclose Feedback in any manner and for any purpose whatsoever without further notice or compensation to you and without retention by you of any proprietary or other right or claim. You hereby assign to Formless any and all right, title, and interest (including, but not limited to, any patent, copyright, trade secret, trademark, show-how, know-how, moral rights, and any and all other intellectual property right) that you may have in and to any and all Feedback.
            </p>
          </div>

          {/* 4. License to Access and Use Our Service and Content */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>4. License to Access and Use Our Service and Content</h2>
            <p style={paragraphStyle}>
              You are hereby granted a limited, nonexclusive, non-transferable, nonsublicensable, and personal license to access and use the Service provided, however, such license is subject to your compliance with these Terms. If any software, content, or other materials owned by, controlled by or licensed to us are distributed or made available to you as part of your use of the Service, we hereby grant you a non-commercial, personal, non-assignable, non-sublicensable, non-transferable, and non-exclusive right and license to access and display such software, content, and materials provided to you as part of the Service, in each case for the sole purpose of enabling you to use the Service as permitted by these Terms, provided that your license in any content linked to or associated with any smart contracts is solely as set forth by the applicable seller or creator of such smart contract.
            </p>
          </div>

          {/* 5. Third-Party Content and Services */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>5. Third-Party Content and Services</h2>
            <p style={paragraphStyle}>
              As a peer-to-peer service, Share helps you access, view, and listen to digital content created by third parties and interact with different blockchains. Formless does not make any representations or warranties about this third-party content visible through our Service, including any content displayed on the Service, and you bear responsibility for verifying the legitimacy, authenticity, and legality of content that you purchase access from third-party sellers. We also cannot guarantee that any smart contracts visible on Share will always remain visible and/or available to be bought, sold, or transferred.
            </p>
          </div>

          {/* 6. User Conduct */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>6. User Conduct</h2>
            <p style={paragraphStyle}>
              To protect our community and comply with our legal obligations, we reserve the right to take action, with or without advance notice, if we believe you have violated these Terms. This may include: removing the ability to view certain content on the Service or use our Service to interact with the content; disabling the ability to use the Service in conjunction with buying/selling/transferring content available on blockchains; disabling your ability to access our Service; and/or other actions.
            </p>
            <p style={paragraphStyle}>
              You agree that you will not violate any law, contract, intellectual property, or other third-party right, and that you are solely responsible for your conduct and content while accessing or using the Service. You also agree that you will not:
            </p>
            <ul style={{ ...contentStyle, paddingLeft: '24px', margin: '0 0 16px 0' }}>
              <li style={bulletStyle}>Pose as another person or entity;</li>
              <li style={bulletStyle}>Access the Service from a different blockchain address if we've blocked any of your other blockchain addresses from accessing the Service, unless you have our written permission first;</li>
              <li style={bulletStyle}>Distribute spam, including sending unwanted links to other users;</li>
              <li style={bulletStyle}>Use the Service – including through disseminating any software or interacting with any API – that could damage, disable, overburden, or impair the functioning of the Service in any manner;</li>
              <li style={bulletStyle}>Bypass or ignore instructions that control access to the Service, including attempting to circumvent any rate-limiting systems by using multiple API keys, directing traffic through multiple IP addresses, or otherwise obfuscating the source of traffic you send to Share;</li>
              <li style={bulletStyle}>Use any data mining, robot, spider, crawler, scraper, script, browser extension, offline reader, or other automated means or interface not authorized by us to access the Service, extract data, or otherwise interfere with or modify the rendering of Service pages or functionality;</li>
              <li style={bulletStyle}>Reverse engineer, duplicate, decompile, disassemble, or decode any aspect of the Service, or do anything that might discover source code or bypass or circumvent measures employed to prevent or limit access to any service, area, or code of the Service;</li>
              <li style={bulletStyle}>Sell or resell the Service or attempt to circumvent any Formless fee systems;</li>
              <li style={bulletStyle}>Use the Service or data collected from our Service for any advertising or direct marketing activity (including without limitation, email marketing, SMS marketing, and telemarketing);</li>
              <li style={bulletStyle}>Use the Service for money laundering, terrorist financing, or other illicit finance;</li>
              <li style={bulletStyle}>Use the Service from a country sanctioned by the government of the United States or to facilitate transactions involving individuals sanctioned by the government of the United States or located in sanctioned countries;</li>
              <li style={bulletStyle}>Use the Service to carry out any financial activities subject to registration or licensing, including but not limited to creating, selling, or buying securities, commodities, options, or debt instruments;</li>
              <li style={bulletStyle}>Use the Service to create, sell, or buy NFTs or other items that give owners rights to participate in an ICO or any securities offering, or that are redeemable for securities, commodities, or other financial instruments;</li>
              <li style={bulletStyle}>Use the Service to engage in price manipulation, fraud, or other deceptive, misleading, or manipulative activity;</li>
              <li style={bulletStyle}>Use the Service to buy, sell, or transfer stolen items, fraudulently obtained items, items taken without authorization, and/or any other illegally obtained items;</li>
              <li style={bulletStyle}>Infringe or violate the intellectual property rights or any other rights of others;</li>
              <li style={bulletStyle}>Create or display illegal content, such as content that may involve child sexual exploitation;</li>
              <li style={bulletStyle}>Create or display smart contracts, or other items that promote suicide or self-harm, incite hate or violence against others, or doxes another individual;</li>
              <li style={bulletStyle}>Use the Service for any illegal or unauthorized purpose, including creating or displaying illegal content, such as content that may involve child sexual exploitation, or encouraging or promoting any activity that violates the Terms of Service;</li>
              <li style={bulletStyle}>Use the Service in any manner that could interfere with, disrupt, negatively affect or inhibit other users from fully enjoying the Service.</li>
            </ul>
            <p style={paragraphStyle}>
              We do not allow explicit or sensitive content on the platform. While users may share content that is mature or suggestive, anything deemed NSFW is subject to review and must comply with our community guidelines.
            </p>
            <p style={paragraphStyle}>
              The following are strictly prohibited:
            </p>
            <ul style={{ ...contentStyle, paddingLeft: '24px', margin: '0 0 16px 0' }}>
              <li style={bulletStyle}>Explicit sexual content, including pornography, masturbation, and sex acts</li>
              <li style={bulletStyle}>Sexually suggestive content involving minors, including anime or stylized depictions</li>
              <li style={bulletStyle}>Violent, gory, or graphic content intended to shock or disturb</li>
              <li style={bulletStyle}>Non-consensual imagery, such as voyeuristic material</li>
              <li style={bulletStyle}>Hate speech, harassment, or targeted abuse</li>
              <li style={bulletStyle}>Illegal activities, including the promotion or depiction of drug use or criminal behavior</li>
            </ul>
            <p style={paragraphStyle}>
              If you believe that content violates our moderation policy, notify us directly via email at:{' '}
              <a href="mailto:moderation@formless.xyz" style={{ color: 'white', textDecoration: 'underline' }}>moderation@formless.xyz</a>
            </p>
            <p style={paragraphStyle}>
              Finally, by using the Service, you understand the importance of DYOR – doing your own research. You bear full responsibility for verifying the authenticity, legitimacy, identity, and other details about any smart contract, collection, or account that you view or otherwise interact with in conjunction with our Service. We make no guarantees or promises about the identity, legitimacy, or authenticity of smart contracts, collection, or account on the Service.
            </p>
          </div>

          {/* 7. Intellectual Property Rights */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>7. Intellectual Property Rights</h2>
            <p style={paragraphStyle}>
              You are solely responsible for your use of the Service and for any information you provide, including compliance with applicable laws, rules, and regulations, as well as these Terms, including the User Conduct requirements outlined above.
            </p>
            <p style={paragraphStyle}>
              By using the Service in conjunction with creating, submitting, posting, promoting, or displaying content, or by complying with Formless's metadata standards in your metadata API responses, you grant us a worldwide, non-exclusive, sublicensable, royalty-free license to use, copy, modify, and display any content, including but not limited to text, materials, images, files, communications, comments, feedback, suggestions, ideas, concepts, questions, data, or otherwise, that you submit or post on or through the Service for our current and future business purposes, including to provide, promote, and improve the Service. This includes any digital file, art, or other material linked to or associated with any smart contracts that are displayed on the Service.
            </p>
            <p style={paragraphStyle}>
              Formless does not claim that submitting, posting, or displaying this content on or through the Service gives Formless any ownership of the content. We're not saying we own it. We're just saying we may use it.
            </p>
            <p style={{ ...paragraphStyle, fontWeight: '600' }}>Copyrighted Works</p>
            <p style={paragraphStyle}>
              You represent and warrant that you have, or have obtained, all rights, licenses, consents, permissions, power, and/or authority necessary to grant the rights granted herein for any content that you create, submit, post, promote, or display on or through the Service. You represent and warrant that such content does not contain material subject to copyright, trademark, publicity rights, or other intellectual property rights unless you have necessary permission or are otherwise legally entitled to post the material and to grant Formless the license described above, and that the content does not violate any laws.
            </p>
            <p style={paragraphStyle}>
              Formless will take down works in response to Digital Millennium Copyright Act ("DMCA") takedown notices and/or other intellectual property infringement claims and will terminate a user's access to the Service if the user is determined to be a repeat infringer. If you believe that your content has been copied in a way that constitutes copyright or trademark infringement, or violates your publicity or other intellectual property rights, notify us directly via email at:{' '}
              <a href="mailto:copyright@formless.xyz" style={{ color: 'white', textDecoration: 'underline' }}>copyright@formless.xyz</a>
            </p>
            <p style={paragraphStyle}>
              For us to process your infringement claim regarding content on the Service, you must be the rightsholder or someone authorized to act on behalf of the rightsholder. Your notice must include:
            </p>
            <ul style={{ ...contentStyle, paddingLeft: '24px', margin: '0 0 16px 0' }}>
              <li style={bulletStyle}>Identification of the copyrighted work(s), trademark, publicity rights, or other intellectual property rights that you claim are being infringed;</li>
              <li style={bulletStyle}>Identification of the allegedly infringing material that is requested to be removed, including a description of the specific location (i.e., urls) on the Service of the material claimed to be infringing, so that we may locate the material;</li>
              <li style={bulletStyle}>Your contact information – at a minimum, your full legal name (not a pseudonym) and email address;</li>
              <li style={bulletStyle}>
                A declaration that contains all of the following:
                <ul style={{ paddingLeft: '24px', margin: '8px 0 0 0' }}>
                  <li style={bulletStyle}>A statement that you have a good faith belief that the use of the material in the manner complained of is not authorized by the intellectual property rights owner, its agent, or the law;</li>
                  <li style={bulletStyle}>A statement that the information in the notice is accurate; and</li>
                  <li style={bulletStyle}>A statement under penalty of perjury that you are authorized to act on behalf of the intellectual property owner of the intellectual property that is allegedly being infringed.</li>
                </ul>
              </li>
              <li style={bulletStyle}>Your physical or electronic signature (of your full legal name).</li>
            </ul>
            <p style={paragraphStyle}>
              Please note that we will forward your notice of intellectual property infringement, including your contact information, to the party who will have their content removed so they understand why it is no longer available on the Service and can also contact you to resolve any dispute.
            </p>
          </div>

          {/* 8. Indemnification */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>8. Indemnification</h2>
            <p style={paragraphStyle}>
              By agreeing to these Terms and accessing the Service, you agree, to the fullest extent permitted by applicable law, to indemnify, defend, and hold harmless Formless, and our respective past, present, and future employees, officers, directors, contractors, consultants, equity holders, suppliers, vendors, service providers, parent companies, subsidiaries, affiliates, agents, representatives, predecessors, successors, and assigns (individually and collectively, the "Formless Parties"), from and against all actual or alleged claims, damages, awards, judgments, losses, liabilities, obligations, penalties, interest, fees, expenses (including, without limitation, attorneys' fees and expenses), and costs (including, without limitation, court costs, costs of settlement, and costs of pursuing indemnification and insurance), of every kind and nature whatsoever, whether known or unknown, foreseen or unforeseen, matured or unmatured, or suspected or unsuspected, in law or equity, whether in tort, contract, or otherwise (collectively, "Claims"), including, but not limited to, damages to property or personal injury, that are caused by, arise out of or are related to (a) your use or misuse of the Service, content, smart contracts, or content linked to or associated with any smart contracts (b) any Feedback you provide, (c) your violation or breach of any term of these Terms or applicable law, and (d) your violation of the rights of or obligations to a third party, including another user or third-party, and (e) your negligence or wilful misconduct. You agree to promptly notify Formless of any Claims and cooperate with the Formless Parties in defending such Claims. You further agree that the Formless Parties shall have control of the defense or settlement of any Claims. THIS INDEMNITY IS IN ADDITION TO, AND NOT IN LIEU OF, ANY OTHER INDEMNITIES SET FORTH IN A WRITTEN AGREEMENT BETWEEN YOU AND FORMLESS.
            </p>
          </div>

          {/* 9. Disclaimers */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>9. Disclaimers</h2>
            <p style={{
              ...paragraphStyle,
              fontWeight: '500',
            }}>
              YOUR ACCESS TO AND USE OF THE SERVICE IS AT YOUR OWN RISK. YOU UNDERSTAND AND AGREE THAT THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS AND FORMLESS EXPRESSLY DISCLAIMS WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED. FORMLESS (AND ITS SUPPLIERS) MAKE NO WARRANTY OR REPRESENTATION AND DISCLAIM ALL RESPONSIBILITY FOR WHETHER THE SERVICE: (A) WILL MEET YOUR REQUIREMENTS; (B) WILL BE AVAILABLE ON AN UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE BASIS; OR (C) WILL BE ACCURATE, RELIABLE, COMPLETE, LEGAL, OR SAFE. FORMLESS DISCLAIMS ALL OTHER WARRANTIES OR CONDITIONS, EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. FORMLESS WILL NOT BE LIABLE FOR ANY LOSS OF ANY KIND FROM ANY ACTION TAKEN OR TAKEN IN RELIANCE ON MATERIAL OR INFORMATION, CONTAINED ON THE SERVICE. WHILE FORMLESS ATTEMPTS TO MAKE YOUR ACCESS TO AND USE OF THE SERVICE SAFE, FORMLESS CANNOT AND DOES NOT REPRESENT OR WARRANT THAT THE SERVICE, CONTENT, CONTENT LINKED TO OR ASSOCIATED WITH ANY SMART CONTRACTS, OR ANY SMART CONTRACTS YOU INTERACT WITH USING OUR SERVICE OR OUR SERVICE PROVIDERS' SERVERS ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. WE CANNOT GUARANTEE THE SECURITY OF ANY DATA THAT YOU DISCLOSE ONLINE. NO ADVICE OR INFORMATION, WHETHER ORAL OR OBTAINED FROM THE FORMLESS PARTIES OR THROUGH THE SERVICE, WILL CREATE ANY WARRANTY OR REPRESENTATION NOT EXPRESSLY MADE HEREIN. YOU ACCEPT THE INHERENT SECURITY RISKS OF PROVIDING INFORMATION AND DEALING ONLINE OVER THE INTERNET AND WILL NOT HOLD FORMLESS RESPONSIBLE FOR ANY BREACH OF SECURITY.
            </p>
            <p style={{
              ...paragraphStyle,
              fontWeight: '500',
            }}>
              WE WILL NOT BE RESPONSIBLE OR LIABLE TO YOU FOR ANY LOSS AND TAKE NO RESPONSIBILITY FOR, AND WILL NOT BE LIABLE TO YOU FOR, ANY USE OF SMART CONTRACTS, CONTENT, AND/OR CONTENT LINKED TO OR ASSOCIATED WITH SMART CONTRACTS, INCLUDING BUT NOT LIMITED TO ANY LOSSES, DAMAGES, OR CLAIMS ARISING FROM: (A) USER ERROR, INCORRECTLY CONSTRUCTED TRANSACTIONS, OR MISTYPED ADDRESSES; (B) SERVER FAILURE OR DATA LOSS; (C) UNAUTHORIZED ACCESS OR USE; (D) ANY UNAUTHORIZED THIRD-PARTY ACTIVITIES, INCLUDING WITHOUT LIMITATION THE USE OF VIRUSES, PHISHING, BRUTE-FORCING OR OTHER MEANS OF ATTACK AGAINST THE SERVICE OR SMART CONTRACTS.
            </p>
            <p style={{
              ...paragraphStyle,
              fontWeight: '500',
            }}>
              SMART CONTRACT TOKENS EXIST ONLY BY VIRTUE OF THE OWNERSHIP RECORD MAINTAINED IN THE ASSOCIATED BLOCKCHAIN (E.G., ETHEREUM NETWORK). ANY TRANSFERS OR SALES OCCUR ON THE ASSOCIATED BLOCKCHAIN (E.G., ETHEREUM). FORMLESS AND/OR ANY OTHER FORMLESS PARTY CANNOT EFFECT OR OTHERWISE CONTROL THE TRANSFER OF TITLE OR RIGHT IN ANY SMART CONTRACT TOKENS OR UNDERLYING OR ASSOCIATED CONTENT OR ITEMS.
            </p>
            <p style={{
              ...paragraphStyle,
              fontWeight: '500',
            }}>
              NO FORMLESS PARTY IS RESPONSIBLE OR LIABLE FOR ANY SUSTAINED LOSSES OR INJURY DUE TO VULNERABILITY OR ANY KIND OF FAILURE, ABNORMAL BEHAVIOR OF SOFTWARE (E.G., WALLET, SMART CONTRACT), BLOCKCHAINS OR ANY OTHER FEATURES OF THE SMART CONTRACT TOKENS. NO FORMLESS PARTY IS RESPONSIBLE FOR LOSSES OR INJURY DUE TO LATE REPORTS BY DEVELOPERS OR REPRESENTATIVES (OR NO REPORT AT ALL) OF ANY ISSUES WITH THE BLOCKCHAIN SUPPORTING THE SMART CONTRACT TOKENS, INCLUDING FORKS, TECHNICAL NODE ISSUES OR ANY OTHER ISSUES HAVING LOSSES OR INJURY AS A RESULT.
            </p>
            <p style={paragraphStyle}>
              Some jurisdictions do not allow the exclusion of implied warranties in contracts with consumers, so the above exclusion may not apply to you.
            </p>
          </div>

          {/* 10. Assumption of Risk */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>10. Assumption of Risk</h2>
            <p style={paragraphStyle}>You accept and acknowledge:</p>
            <ul style={{ ...contentStyle, paddingLeft: '24px', margin: '0 0 16px 0' }}>
              <li style={bulletStyle}>The value of digital content is subjective. Prices for accessing content are subject to volatility and fluctuations in the price of cryptocurrency and materially affect the prices. You acknowledge that you fully understand this subjectivity and volatility.</li>
              <li style={bulletStyle}>We do not control the price of smart contract digital content or the time it is available. Pricing and access grant times are independently determined by content creators and can vary widely. You acknowledge that you fully understand this.</li>
              <li style={bulletStyle}>The regulatory regime governing blockchain technologies, smart contracts, cryptocurrency, and other crypto-based items is uncertain, and new regulations or policies may materially adversely affect the development of the Service.</li>
              <li style={bulletStyle}>You are solely responsible for determining what, if any, taxes apply to your transactions. Formless is not responsible for determining the taxes that apply to your sales.</li>
              <li style={bulletStyle}>There are risks associated with purchasing items associated with content created by third parties through peer-to-peer transactions, including but not limited to, the risk of purchasing counterfeit items, mislabeled items, items that are vulnerable to metadata decay, items on smart contracts with bugs, and items that may become untransferable. You represent and warrant that you have done sufficient research before making any decisions to sell, pay for, or otherwise interact with any smart contracts, or collections.</li>
              <li style={bulletStyle}>We do not control the public blockchains that you are interacting with and we do not control certain smart contracts and protocols that may be integral to your ability to complete transactions on these public blockchains. Additionally, blockchain transactions are irreversible, and Formless has no ability to reverse any transactions on the blockchain.</li>
              <li style={bulletStyle}>There are risks associated with using Internet and blockchain-based products, including, but not limited to, the risk associated with hardware, software, and Internet connections, the risk of malicious software introduction, and the risk that third parties may obtain unauthorized access to your third-party wallet or Account. You accept and acknowledge that Formless will not be responsible for any communication failures, disruptions, errors, distortions, or delays you may experience when using the Service or any Blockchain network, however caused.</li>
              <li style={bulletStyle}>The Service relies on third-party platforms and/or vendors. If we are unable to maintain a good relationship with such platform providers and/or vendors; if the terms and conditions or pricing of such platform providers and/or vendors change; if we violate or cannot comply with the terms and conditions of such platforms and/or vendors; or if any of such platforms and/or vendors lose market share or falls out of favor or is unavailable for a prolonged period of time, access to and use of the Service will suffer.</li>
              <li style={bulletStyle}>Formless reserves the right to hide collections, contracts, and items affected by any of these issues or by other issues. Items you purchase may become inaccessible on Share. Under no circumstances shall the inability to view items on Share or an inability to use the Service in conjunction with the purchase, sale, or transfer of items available on any blockchains serve as grounds for a claim against Formless.</li>
              <li style={bulletStyle}>If you have a dispute with one or more users, YOU RELEASE US FROM CLAIMS, DEMANDS, AND DAMAGES OF EVERY KIND AND NATURE, KNOWN AND UNKNOWN, ARISING OUT OF OR IN ANY WAY CONNECTED WITH SUCH DISPUTES. IN ENTERING INTO THIS RELEASE YOU EXPRESSLY WAIVE ANY PROTECTIONS (WHETHER STATUTORY OR OTHERWISE) THAT WOULD OTHERWISE LIMIT THE COVERAGE OF THIS RELEASE TO INCLUDE THOSE CLAIMS WHICH YOU MAY KNOW OR SUSPECT TO EXIST IN YOUR FAVOR AT THE TIME OF AGREEING TO THIS RELEASE.</li>
            </ul>
          </div>

          {/* 11. Limitation of Liability */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>11. Limitation of Liability</h2>
            <p style={{
              ...paragraphStyle,
              fontWeight: '500',
            }}>
              TO THE FULLEST EXTENT PERMITTED BY LAW, YOU AGREE THAT IN NO EVENT WILL FORMLESS OR ITS SERVICE PROVIDERS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY LOST PROFIT OR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES ARISING FROM THESE TERMS OR THE SERVICE, PRODUCTS OR THIRD-PARTY SITES AND PRODUCTS, OR FOR ANY DAMAGES RELATED TO LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, OR LOSS OF DATA, AND WHETHER CAUSED BY STRICT LIABILITY OR TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE AND EVEN IF FORMLESS OR ITS SERVICE PROVIDERS HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES; OR (B) FOR ANY OTHER CLAIM, DEMAND, OR DAMAGES WHATSOEVER RESULTING FROM OR ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OF THE DELIVERY, USE, OR PERFORMANCE OF THE SERVICE. ACCESS TO, AND USE OF, THE SERVICE, PRODUCTS, OR THIRD-PARTY SITES, AND PRODUCTS ARE AT YOUR OWN DISCRETION AND RISK, AND YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM OR MOBILE DEVICE OR LOSS OF DATA RESULTING THEREFROM.
            </p>
            <p style={{
              ...paragraphStyle,
              fontWeight: '500',
            }}>
              NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, IN NO EVENT SHALL THE MAXIMUM AGGREGATE LIABILITY OF FORMLESS ARISING OUT OF OR IN ANY WAY RELATED TO THESE TERMS, THE ACCESS TO AND USE OF THE SERVICE, CONTENT, SMART CONTRACTS, OR ANY FORMLESS PRODUCTS OR SERVICES EXCEED THE GREATER OF (A) $100 OR (B) THE AMOUNT RECEIVED BY FORMLESS FOR ITS SERVICE DIRECTLY RELATING TO THE ITEMS THAT ARE THE SUBJECT OF THE CLAIM. THE FOREGOING LIMITATIONS WILL APPLY EVEN IF THE ABOVE-STATED REMEDY FAILS IN ITS ESSENTIAL PURPOSE.
            </p>
            <p style={paragraphStyle}>
              Some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, so the above limitation or exclusion may not apply to you. Some jurisdictions also limit disclaimers or limitations of liability for personal injury from consumer products, so this limitation may not apply to personal injury claims.
            </p>
          </div>

          {/* 12. Privacy Policy */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>12. Privacy Policy</h2>
            <p style={paragraphStyle}>
              Please refer to our Privacy Policy for information about how we collect, use, and share data about you. By submitting data through our Service, you agree to the terms of our Privacy Policy and you expressly consent to the collection, use, and disclosure of your data in accordance with the Privacy Policy.
            </p>
          </div>

          {/* 13. Modifications to the Service */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>13. Modifications to the Service</h2>
            <p style={paragraphStyle}>
              We reserve the right in our sole discretion to modify, suspend, or discontinue, temporarily or permanently, the Service (or any features or parts thereof) at any time and without liability as a result. Product releases defined and marked Alpha or Beta are a best effort Service, and content deployed to storage using these versions of the product may be removed from the Service at any time for reasons including but not limited to underlying technology enhancements, application maintenance, and preparation for non-Beta releases. While contracts deployed to the blockchain are persistent, users should not expect that the content associated with these contracts, when deployed using Alpha or Beta software, will be maintained in perpetuity by the Service.
            </p>
          </div>

          {/* 14. Dispute Resolution; Arbitration */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>14. Dispute Resolution; Arbitration</h2>

            <p style={{ ...paragraphStyle, fontWeight: '600' }}>Dispute Resolution.</p>
            <p style={paragraphStyle}>
              Please read the following arbitration agreement in this Section ("Arbitration Agreement") carefully. It requires you to arbitrate disputes with Formless and limits the manner in which you can seek relief from us. This section does not govern disputes between users or between users and third parties. Formless does not provide dispute resolution services for such disagreements and the parties must resolve those disputes directly.
            </p>

            <p style={{ ...paragraphStyle, fontWeight: '600' }}>Applicability of Arbitration Agreement.</p>
            <p style={paragraphStyle}>
              You agree that any dispute, controversy, or claim relating in any way to your access or use of the Service, to any products sold or distributed through the Service, or to any aspect of your relationship with Formless, will be resolved by binding arbitration, rather than in court, including threshold questions of the arbitrability of such dispute, controversy, or claim except that (1) you or Formless may assert claims in small claims court, but only if the claims qualify, the claims remain only in such court, and the claims remain on an individual, non-representative, and non-class basis; and (2) you or Formless may seek injunctive or equitable relief in a court of proper jurisdiction if the claim relates to intellectual property infringement or other misuses of intellectual property rights.
            </p>

            <p style={{ ...paragraphStyle, fontWeight: '600' }}>Dispute resolution process.</p>
            <p style={paragraphStyle}>
              You and Formless both agree to engage in good-faith efforts to resolve disputes prior to either party initiating an arbitration, small claims court proceeding, or equitable relief for intellectual property infringement. You must initiate this dispute resolution process by sending a letter describing the nature of your claim and desired resolution to{' '}
              <a href="mailto:info@formless.xyz" style={{ color: 'white', textDecoration: 'underline' }}>info@formless.xyz</a>.
              Both parties agree to meet and confer personally, by telephone, or by videoconference (hereinafter "Conference") to discuss the dispute and attempt in good faith to reach a mutually beneficial outcome that avoids the expenses of arbitration or, where applicable, litigation. If you are represented by counsel, your counsel may participate in the Conference as well, but you agree to fully participate in the Conference. Likewise, if Formless is represented by counsel, its counsel may participate in the Conference as well, but Formless agrees to have a company representative fully participate in the Conference. The statute of limitations and any filing fee deadlines shall be tolled while the parties engage in the informal dispute resolution process and Conference required by this paragraph. If the parties do not reach an agreement to resolve the dispute within thirty (30) days after initiation of this dispute resolution process, either party may commence arbitration, file an action in small claims court, or file a claim for injunctive or equitable relief in a court of proper jurisdiction for matters relating to intellectual property infringement, if the claims qualify.
            </p>

            <p style={{ ...paragraphStyle, fontWeight: '600' }}>Arbitration Rules and Forum.</p>
            <p style={paragraphStyle}>
              The Federal Arbitration Act governs the interpretation and enforcement of this Arbitration Agreement. To begin an arbitration proceeding after participating in the dispute resolution process, you must send a letter requesting arbitration and describing your claim to{' '}
              <a href="mailto:info@formless.xyz" style={{ color: 'white', textDecoration: 'underline' }}>info@formless.xyz</a>.
              The arbitration will be conducted by JAMS, an established alternative dispute resolution provider. Disputes involving claims and counterclaims under $250,000, not inclusive of attorneys' fees and interest, shall be subject to JAMS's most current version of the Streamlined Arbitration Rules and the JAMS Consumer Minimum Standards then in effect; all other claims shall be subject to JAMS's most current version of the Comprehensive Arbitration Rules and Procedures and the JAMS Consumer Minimum Standards then in effect. JAMS's rules are available at jamsadr.com or by calling JAMS at 800-352-5267. If JAMS is not available to arbitrate, the parties will select an alternative arbitral forum. If the arbitrator finds that you cannot afford to pay JAMS filing, administrative, hearing, and/or other fees and cannot obtain a waiver from JAMS, Formless will pay them for you if you complied with the dispute resolution process set forth above. In addition, Formless will reimburse all such JAMS filing, administrative, hearing, and/or other fees for claims totaling less than $10,000 unless the arbitrator determines the claims are frivolous or you did not comply with the dispute resolution process set forth above, except that if you have initiated the arbitration claim, you will still be required to pay the lesser of $250 or the maximum amount permitted under the JAMS Rules for arbitration claims initiated by you. You are still responsible for all additional costs that you incur in the arbitration, including without limitation, fees for attorneys or expert witnesses. You may choose to have the arbitration conducted by telephone or videoconference, based on written submissions, in person in your hometown area (if you live in the United States), or at another mutually agreed upon location that is reasonably convenient to you. Any judgment on the award rendered by the arbitrator may be entered in any court of competent jurisdiction.
            </p>

            <p style={{ ...paragraphStyle, fontWeight: '600' }}>Authority of Arbitrator.</p>
            <p style={paragraphStyle}>
              The arbitrator shall have exclusive authority to (a) determine the scope and enforceability of this Arbitration Agreement and (b) resolve any dispute related to the interpretation, applicability, enforceability, or formation of this Arbitration Agreement including, but not limited to, any claim that all or any part of this Arbitration Agreement is void or voidable. The arbitration will decide the rights and liabilities, if any, of you and Formless. The arbitration proceeding will not be consolidated with any other matters or joined with any other cases or parties. The arbitrator shall have the authority to grant motions dispositive of all or part of any claim. The arbitrator shall have the authority to award monetary damages and to grant any non-monetary remedy or relief available to an individual under applicable law, the arbitral forum's rules, and these Terms. The arbitrator shall issue a written award and statement of decision describing the essential findings and conclusions on which the award is based, including the calculation of any damages awarded. The arbitrator has the same authority to award relief on an individual basis that a judge in a court of law would have. The award of the arbitrator is final and binding upon you and us.
            </p>

            <p style={{ ...paragraphStyle, fontWeight: '600' }}>Waiver of Jury Trial.</p>
            <p style={{
              ...paragraphStyle,
              fontWeight: '500',
            }}>
              YOU AND FORMLESS HEREBY WAIVE ANY CONSTITUTIONAL AND STATUTORY RIGHTS TO SUE IN COURT AND HAVE A TRIAL IN FRONT OF A JUDGE OR A JURY. You and FORMLESS are instead electing that all claims and disputes shall be resolved by arbitration under this Arbitration Agreement, except as specified in the second bullet of this Section 14, above ("Applicability of Arbitration Agreement"). An arbitrator can award on an individual basis the same damages and relief as a court and must follow these Terms as a court would. However, there is no judge or jury in arbitration, and court review of an arbitration award is subject to very limited review.
            </p>

            <p style={{ ...paragraphStyle, fontWeight: '600' }}>Waiver of Class Actions and Class Arbitrations.</p>
            <p style={{
              ...paragraphStyle,
              fontWeight: '500',
            }}>
              ALL CLAIMS AND DISPUTES WITHIN THE SCOPE OF THIS ARBITRATION AGREEMENT MUST BE ARBITRATED ON AN INDIVIDUAL BASIS AND NOT ON A REPRESENTATIVE OR COLLECTIVE CLASS BASIS. ONLY INDIVIDUAL RELIEF IS AVAILABLE, AND CLAIMS OF MORE THAN ONE USER, PERSON, OR ENTITY CANNOT BE ARBITRATED OR CONSOLIDATED WITH THOSE OF ANY OTHER USER, PERSON, OR ENTITY. Accordingly, under the arbitration procedures outlined in this section, an arbitrator shall not combine or consolidate more than one party's claims without the written consent of all affected parties to an arbitration proceeding. Without limiting the generality of the foregoing, you and Formless agree that no dispute shall proceed by way of class arbitration without the written consent of all affected parties. If a decision is issued stating that applicable law precludes enforcement of any part of this subsection's limitations as to a given claim for relief, then that claim must be severed from the arbitration and brought in the state or federal courts located in New York County in the State of New York. All other claims shall be arbitrated.
            </p>

            <p style={{ ...paragraphStyle, fontWeight: '600' }}>Severability.</p>
            <p style={paragraphStyle}>
              Except as provided in this Section, if any part or parts of this Arbitration Agreement are found under the law to be invalid or unenforceable, then such specific part or parts shall be of no force and effect and shall be severed and the remainder of the Arbitration Agreement shall continue in full force and effect.
            </p>

            <p style={{ ...paragraphStyle, fontWeight: '600' }}>Survival of Agreement.</p>
            <p style={paragraphStyle}>
              This Arbitration Agreement will survive the termination of your relationship with Formless.
            </p>

            <p style={{ ...paragraphStyle, fontWeight: '600' }}>Modification.</p>
            <p style={paragraphStyle}>
              Notwithstanding any provision in these Terms to the contrary, we agree that if Formless makes any future material change to this Arbitration Agreement, you may reject that change within thirty (30) days of such change becoming effective by writing to Formless at{' '}
              <a href="mailto:info@formless.xyz" style={{ color: 'white', textDecoration: 'underline' }}>info@formless.xyz</a>.
            </p>
          </div>

          {/* 15. Governing Law and Venue */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>15. Governing Law and Venue</h2>
            <p style={paragraphStyle}>
              These Terms and your access to and use of the Service shall be governed by and construed and enforced in accordance with the laws of the State of New York (without regard to conflict of law rules or principles of the State of New York, or any other jurisdiction that would cause the application of the laws of any other jurisdiction). Any dispute between the parties that is not subject to arbitration as set forth in Section 14 or cannot be heard in small claims court, shall be resolved in the state or federal courts in the State of Delaware, and the United States, respectively, sitting in the State of Delaware.
            </p>
          </div>

          {/* 16. Termination */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>16. Termination</h2>
            <p style={paragraphStyle}>
              If you breach any of the provisions of these Terms, all licenses granted by Formless will terminate automatically. Additionally, notwithstanding anything contained in these Terms, we reserve the right, with or without notice and in our sole discretion, to suspend, disable, terminate, or delete your Account and/or your ability to access or use the Service (or any part of the foregoing) at any time and for any or no reason, and you acknowledge and agree that we shall have no liability or obligation to you in such event and that you will not be entitled to a refund of any amounts that you have already paid to us.
            </p>
          </div>

          {/* 17. Severability */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>17. Severability</h2>
            <p style={paragraphStyle}>
              If any term, clause, or provision of these Terms is held invalid or unenforceable, then that term, clause, or provision will be severable from these Terms and will not affect the validity or enforceability of any remaining part of that term, clause, or provision, or any other term, clause, or provision of these Terms.
            </p>
          </div>

          {/* 18. Injunctive Relief */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>18. Injunctive Relief</h2>
            <p style={paragraphStyle}>
              You agree that a breach of these Terms will cause irreparable injury to Formless for which monetary damages would not be an adequate remedy and Formless shall be entitled to equitable relief in addition to any remedies it may have hereunder or at law without a bond, other security, or proof of damages.
            </p>
          </div>

          {/* 19. California Residents */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>19. California Residents</h2>
            <p style={paragraphStyle}>
              If you are a California resident, in accordance with Cal. Civ. Code § 1789.3, you may report complaints to the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs by contacting them in writing at 1625 North Market Blvd., Suite N 112 Sacramento, CA 95834, or by telephone at (800) 952-5210.
            </p>
          </div>

          {/* 20. Export Laws */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>20. Export Laws</h2>
            <p style={paragraphStyle}>
              You agree that you will not export or re-export, directly or indirectly, the Service, and/or other information or materials provided by Formless hereunder, to any country for which the United States or any other relevant jurisdiction requires any export license or other governmental approval at the time of export without first obtaining such license or approval. In particular, but without limitation, the Service may not be exported or re-exported (a) into any U.S. embargoed countries or any country that has been designated by the U.S. Government as a "terrorist supporting" country, or (b) to anyone listed on any U.S. Government list of prohibited or restricted parties, including the U.S. Treasury Department's list of Specially Designated Nationals or the U.S. Department of Commerce Denied Person's List or Entity List. By using the Service, you represent and warrant that you are not located in any such country or on any such list. You are responsible for and hereby agree to comply at your sole expense with all applicable United States export laws and regulations.
            </p>
          </div>

          {/* 21. Survival */}
          <div style={sectionStyle}>
            <h2 style={headingStyle}>21. Survival</h2>
            <p style={paragraphStyle}>
              All sections which by their nature should survive the termination of these Terms shall continue in full force and effect subsequent to and notwithstanding any termination of these Terms by Formless or you. Termination will not limit any of Formless's other rights or remedies at law or in equity.
            </p>
          </div>

          {/* 22. Miscellaneous */}
          <div style={{ marginBottom: '0' }}>
            <h2 style={headingStyle}>22. Miscellaneous</h2>
            <p style={paragraphStyle}>
              These Terms constitute the entire agreement between you and Formless relating to your access to and use of the Service. These Terms, and any rights and licenses granted hereunder, may not be transferred or assigned by you without the prior written consent of Formless, and Formless's failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision. No waiver by either party of any breach or default hereunder shall be deemed to be a waiver of any preceding or subsequent breach or default. The section headings used herein are for reference only and shall not be read to have any legal effect.
            </p>
            <p style={paragraphStyle}>
              The Service is operated by us in the United States. Those who choose to access the Service from locations outside the United States do so at their own initiative and are responsible for compliance with applicable local laws. You and Formless agree that the United Nations Convention on Contracts for the International Sale of Goods will not apply to the interpretation or construction of these Terms.
            </p>
            <p style={{ ...paragraphStyle, margin: '0' }}>
              Except as otherwise provided herein, these Terms are intended solely for the benefit of the parties and are not intended to confer third-party beneficiary rights upon any other person or entity.
            </p>
          </div>
        </div>
      </section>

      {/* Gradient Fade from Black (before Join section) */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '300px',
          background: 'linear-gradient(to bottom, #000 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Join the Network Section */}
      <section
        ref={joinRef}
        className="join-section"
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 60px',
          overflow: 'hidden',
          background: 'transparent',
          marginTop: '-150px',
        }}
      >
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          opacity: joinVisible ? 1 : 0,
          transform: joinVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s',
        }}>
          <h2 style={{
            fontSize: 'clamp(48px, 8vw, 100px)',
            fontWeight: '300',
            lineHeight: '1.1',
            fontFamily: '"Inter", sans-serif',
            margin: '0 0 60px 0',
            letterSpacing: '-2px',
          }}>
            Join the network today.
          </h2>

          <a
            href="/schedule-meeting/27886cd3ac3481bdb0f0c5a0d46242b5"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '400',
              fontFamily: '"Inter", sans-serif',
              paddingBottom: '8px',
              borderBottom: '1px solid transparent',
              transition: 'border-color 0.4s ease-in',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            Schedule a Meeting
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 17L17 7M17 7H10M17 7V14"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="footer"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '60px 60px 40px 60px',
          background: 'transparent',
        }}
      >
        {/* Social Media Icons */}
        <div className="social-icons" style={{
          display: 'flex',
          gap: '80px',
          marginBottom: '60px',
        }}>
          {/* X (Twitter) */}
          <a href="https://x.com/formless_xyz" style={{ color: 'white', transition: 'opacity 0.3s ease' }} 
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          
          {/* LinkedIn */}
          <a href="https://www.linkedin.com/company/formlessxyz/" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          
          {/* Instagram */}
          <a href="https://www.instagram.com/formlessxyz/" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          
          {/* Discord */}
          <a href="https://discord.com/invite/8hmQ28HvnT" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
            </svg>
          </a>
        </div>

        {/* Large FORMLESS Logo */}
        <div className="footer-logo" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '60px',
        }}>
          <img
            src="/logomain.png"
            alt="Formless Logo"
            style={{
              height: 'clamp(120px, 18vw, 200px)',
              width: 'auto',
            }}
          />
          <h2 style={{
            fontSize: 'clamp(80px, 15vw, 200px)',
            fontWeight: '500',
            letterSpacing: '-4px',
            margin: 0,
            color: 'white',
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}>
            FORMLESS<sup style={{
              fontSize: '14%',
              verticalAlign: 'super',
              fontWeight: '400',
              marginLeft: '8px',
              position: 'relative',
              top: '-0.2em',
            }}>TM</sup>
          </h2>
        </div>

        {/* Footer Links */}
        <div className="footer-links" style={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: '0',
          fontSize: '14px',
          fontFamily: '"Inter", sans-serif',
          paddingBottom: '20px',
          color: 'rgba(255,255,255,0.7)',
        }}>
          <span style={{ marginRight: '200px' }}>&copy; FORMLESS</span>
          <a href="/privacy-policy" style={{
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
            marginRight: '200px',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
            Privacy Policy
          </a>
          <a href="/terms-of-service" style={{
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
            Terms of Service
          </a>
        </div>
      </footer>

      {/* Responsive Styles */}
      <style>
        {`
          /* Tablet breakpoint */
          @media (max-width: 1024px) {
            .join-section {
              padding: 80px 40px !important;
            }
          }

          /* Mobile breakpoint */
          @media (max-width: 768px) {
            .terms-hero-section {
              padding-top: 100px !important;
              padding-bottom: 40px !important;
              min-height: auto !important;
            }
            .terms-content-section {
              padding: 40px 16px 60px !important;
            }
            .join-section {
              padding: 60px 20px !important;
              min-height: 60vh !important;
              margin-top: -80px !important;
            }
            .join-section h2 {
              font-size: 32px !important;
              margin-bottom: 40px !important;
              letter-spacing: -1px !important;
            }
            .footer {
              padding: 40px 16px 20px !important;
            }
            .social-icons {
              gap: 30px !important;
              flex-wrap: wrap !important;
            }
            .footer-logo {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 16px !important;
            }
            .footer-logo img {
              height: 60px !important;
            }
            .footer-logo h2 {
              font-size: 48px !important;
            }
            .footer-links {
              gap: 20px !important;
              flex-wrap: wrap !important;
            }
            .footer-links span,
            .footer-links a {
              margin-right: 0 !important;
            }
          }

          /* Small mobile */
          @media (max-width: 480px) {
            .terms-hero-section {
              padding-left: 12px !important;
              padding-right: 12px !important;
            }
            .terms-hero-section h1 {
              font-size: 36px !important;
              letter-spacing: -1px !important;
            }
            .join-section h2 {
              font-size: 28px !important;
            }
            .footer-logo h2 {
              font-size: 36px !important;
            }
            .footer-links {
              flex-direction: column !important;
              gap: 12px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default TermsOfService;