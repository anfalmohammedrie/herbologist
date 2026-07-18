"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'ml';

const translations = {
  en: {
    // Brand & Nav
    brandTitle: "THE AI HERBOLOGIST",
    brandSubtitle: "Botanical Integrity & Yield Portal",
    navAudit: "Audit Portal",
    navPrices: "Spices Board Live Prices",
    navMarketplace: "Marketplace & Sellers",
    navAddVarietal: "Add Varietal",
    liveBadge: "Live",

    // Banner & Ticker
    liveBannerTitle: "Synced with indianspices.com Daily Market Bulletin",
    liveBannerSubtitle: "Official domestic daily prices from Cochin, Bodinayakanur & Alleppey spice auctions.",
    liveBannerBtn: "View Live Daily Spices Board Feed →",

    // Audit Form
    auditTitle: "Botanical Integrity & Yield Trust Portal",
    auditSubtitle: "A full-stack mechanism for indigenous spice farmers to verify origin, cultivation conditions, and handling journeys—securing rightful premium value over adulterated substitutes.",
    labelVarietal: "Botanical Spice / Ayurvedic Herb Strain",
    optionSelectVarietal: "Select Indigenous Spice Strain From Database...",
    targetCompound: "Target Compound Assay",
    govtRateLabel: "Kerala Govt Benchmark Rate",
    giPrefixLabel: "Recognised GI Origin Prefix",
    activeCompoundLabel: "Active Chemical Compound %",
    giStringLabel: "GI Registration String (Recognised Geographical Tag)",
    cultivationLabel: "Cultivation Method & Ecological Parameters",
    handlingLabel: "Post-Harvest Handling & Processing Journey",
    visualLabel: "Field Physical Geometry & Structural Observations",
    selectVisualPlaceholder: "Select Physical Observation Pattern...",
    selectVarietalFirst: "Select a Varietal First",
    coaSectionTitle: "Laboratory COA (Certificate of Analysis) Attachment",
    coaAttachedRadio: "Attached / Verified Lab Certificate",
    coaMissingRadio: "Missing / Unverified (Drops Rating & Valuation)",
    uploadCoaLabel: "Upload COA Evidence File (.pdf, .png, .jpg)",
    uploadPhotoLabel: "📷 Upload Photo for AI Auto-Detection of Physical Geometry & Specifications",
    analyzingImage: "Scanning Sample Photo with AI Vision Engine...",
    detectedSuccess: "AI Computer Vision Specification Detected!",
    executeAuditBtn: "EXECUTE BOTANICAL AUDIT & ISSUANCE",
    executingAuditBtn: "Analyzing Compliance & Executing Ollama LLM Audit...",

    // Audit Results
    auditReportHeader: "Audit & Origin Certificate Issued",
    yqiIndexLabel: "YQI Index",
    govtStandardRate: "Official Govt Standard Rate",
    validatedValue: "Validated Product Premium Value",
    speculatedWarning: "SPECULATED VALUE: COA NOT ATTACHED",
    premiumEarned: "PREMIUM GRADE VALUE EARNED",
    trustStatusLabel: "Trust Status",
    aiAnalysisLabel: "AI Compliance Analysis",
    provenancePassportTitle: "End-Consumer Provenance Verification Passport",
    provenancePassportDesc: "Share or print this digital certificate for packaging so end consumers can scan & verify authenticity.",
    viewPassportBtn: "View Public Provenance Passport",
    matchingSellersTitle: "Registered Sellers Offering This Geographical Strain",
    viewFullMarketplace: "View Full Marketplace →",

    // Live Prices Page
    livePricesTitle: "Spices Board of India — Domestic Daily Prices",
    livePricesSubtitle: "Ministry of Commerce & Industry, Government of India • Official Real-Time Domestic Market Bulletin",
    officialPortalBtn: "Official Spices Board Portal",
    filterSpiceType: "Filter by Spice Type",
    filterMarketCentre: "Filter Market Centre",
    searchGradeState: "Search Grade or State",
    colDate: "Bulletin Date",
    colCategory: "Spice Category",
    colMarket: "Market Centre",
    colState: "State",
    colGrade: "Grade / Specification",
    colSource: "Reporting Source",
    colMin: "Min Rate (₹/kg)",
    colMax: "Max Rate (₹/kg)",
    colAvg: "Average Rate (₹/kg)",
    refreshBtn: "Refresh Prices",

    // Marketplace Page
    marketplaceTitle: "Verified Botanical Marketplace",
    listLotBtn: "List Your Lot For Sale",
    filterBotanical: "Filter by Botanical",
    qualityRatingGrade: "Quality Rating Grade",
    searchPlaceholder: "e.g. Wayanad, Kalpetta, Co-op...",
    connectSellerBtn: "Connect with Seller",
    directCall: "Direct Call",
    sendEmail: "Send Email Inquiry",
    whatsAppMsg: "WhatsApp Direct Message",
    closeBtn: "Close",

    // Add Varietal Page
    addVarietalTitle: "Register Botanical Strain",
    addVarietalSubtitle: "Inject new agricultural strains into the botanical database with Kerala Government pricing parameters.",
    strainNameLabel: "Botanical Strain Name",
    compoundNameLabel: "Active Compound Name",
    compoundBaselineLabel: "Minimum Compound Baseline %",
    giPrefixInputLabel: "Required GI Tag Prefix",
    marketRateInputLabel: "Kerala Govt Market Benchmark Rate (₹ / kg)",
    descriptionInputLabel: "Botanical Overview & Agro Profile",
    allowedVisualsLabel: "Structural Visual Profiles (one option per line)",
    submitVarietalBtn: "Register Botanical Varietal",

    // Provenance Passport Page
    passportHeader: "DIGITAL BOTANICAL PROVENANCE PASSPORT",
    cultivationConditionsTitle: "Cultivation Conditions",
    handlingJourneyTitle: "Post-Harvest Handling Journey",
    chemicalActiveTitle: "Chemical Active Assay",
    harvestBatchTitle: "Harvest Date & Batch Registration",
    aiVisionTitle: "AI Vision Compliance Findings",
    fairValuationTitle: "Fair Ethical Market Valuation",
    printCertificateBtn: "Print Consumer Certificate",
  },
  hi: {
    // Brand & Nav
    brandTitle: "द एआई हर्बोलॉजिस्ट",
    brandSubtitle: "वनस्पति सत्यनिष्ठा एवं उपज विश्वास पोर्टल",
    navAudit: "ऑडिट पोर्टल",
    navPrices: "मसाला बोर्ड लाइव मूल्य",
    navMarketplace: "बाज़ार एवं विक्रेता",
    navAddVarietal: "नई किस्म जोड़ें",
    liveBadge: "लाइव",

    // Banner & Ticker
    liveBannerTitle: "indianspices.com दैनिक बाज़ार बुलेटिन से सिंक किया गया",
    liveBannerSubtitle: "कोचीन, बोडीनायकनूर और अलप्पुझा मसाला नीलामी से आधिकारिक घरेलू दैनिक दरें।",
    liveBannerBtn: "लाइव दैनिक मसाला बोर्ड फ़ीड देखें →",

    // Audit Form
    auditTitle: "वनस्पति सत्यनिष्ठा एवं उपज विश्वास पोर्टल",
    auditSubtitle: "स्वदेशी मसाला किसानों के लिए उत्पत्ति, खेती की स्थिति और प्रसंस्करण यात्रा को सत्यापित करने तथा मिलावटी विकल्पों से सुरक्षा पाने का संपूर्ण मंच।",
    labelVarietal: "वानस्पतिक मसाला / आयुर्वेदिक जड़ी-बूटी की किस्म",
    optionSelectVarietal: "डेटाबेस से स्वदेशी मसाले की किस्म चुनें...",
    targetCompound: "लक्ष्य यौगिक परख",
    govtRateLabel: "केरल सरकार न्यूनतम मानक दर",
    giPrefixLabel: "मान्यता प्राप्त जीआई उत्पत्ति उपसर्ग",
    activeCompoundLabel: "सक्रिय रासायनिक यौगिक %",
    giStringLabel: "जीआई पंजीकरण कोड (मान्यता प्राप्त भौगोलिक टैग)",
    cultivationLabel: "खेती की विधि एवं पारिस्थितिक मापदंड",
    handlingLabel: "कटाई के बाद की देखभाल और प्रसंस्करण यात्रा",
    visualLabel: "मैदानी शारीरिक संरचना एवं दृश्य निरीक्षण",
    selectVisualPlaceholder: "शारीरिक अवलोकन पैटर्न चुनें...",
    selectVarietalFirst: "पहले एक किस्म चुनें",
    coaSectionTitle: "प्रयोगशाला सीओए (विश्लेषण प्रमाणपत्र) संलग्नक",
    coaAttachedRadio: "संलग्न / सत्यापित लैब प्रमाणपत्र",
    coaMissingRadio: "अनुपलब्ध / असत्यापित (रेटिंग और मूल्य में कमी)",
    uploadCoaLabel: "सीओए प्रमाणपत्र फ़ाइल अपलोड करें (.pdf, .png, .jpg)",
    uploadPhotoLabel: "📷 एआई ऑटो-डिटेक्शन के लिए सैंपल फोटो अपलोड करें",
    analyzingImage: "एआई विज़न इंजन के साथ फोटो का विश्लेषण हो रहा है...",
    detectedSuccess: "एआई कंप्यूटर विज़न विशिष्टता पाई गई!",
    executeAuditBtn: "वानस्पतिक ऑडिट और जारीकरण निष्पादित करें",
    executingAuditBtn: "अनुपालन का विश्लेषण और ओलामो एलएलएम ऑडिट निष्पादित हो रहा है...",

    // Audit Results
    auditReportHeader: "ऑडिट एवं उत्पत्ति प्रमाणपत्र जारी",
    yqiIndexLabel: "वाईक्यूआई सूचकांक",
    govtStandardRate: "आधिकारिक सरकारी मानक दर",
    validatedValue: "सत्यापित उत्पाद प्रीमियम मूल्य",
    speculatedWarning: "अनुमानित मूल्य: सीओए संलग्न नहीं है",
    premiumEarned: "प्रीमियम ग्रेड मूल्य प्राप्त हुआ",
    trustStatusLabel: "विश्वास स्थिति",
    aiAnalysisLabel: "एआई अनुपालन विश्लेषण",
    provenancePassportTitle: "अंतिम-उपभोक्ता उत्पत्ति सत्यापन पासपोर्ट",
    provenancePassportDesc: "पैकेजिंग के लिए इस डिजिटल प्रमाणपत्र को साझा या प्रिंट करें ताकि ग्राहक प्रामाणिकता की जांच कर सकें।",
    viewPassportBtn: "सार्वजनिक उत्पत्ति पासपोर्ट देखें",
    matchingSellersTitle: "इस भौगोलिक किस्म की पेशकश करने वाले पंजीकृत विक्रेता",
    viewFullMarketplace: "पूरा बाज़ार देखें →",

    // Live Prices Page
    livePricesTitle: "भारतीय मसाला बोर्ड — घरेलू दैनिक मूल्य",
    livePricesSubtitle: "वाणिज्य एवं उद्योग मंत्रालय, भारत सरकार • आधिकारिक रीयल-टाइम घरेलू बाज़ार बुलेटिन",
    officialPortalBtn: "आधिकारिक मसाला बोर्ड पोर्टल",
    filterSpiceType: "मसाले के प्रकार से फ़िल्टर करें",
    filterMarketCentre: "बाज़ार केंद्र फ़िल्टर करें",
    searchGradeState: "ग्रेड या राज्य खोजें",
    colDate: "बुलेटिन तिथि",
    colCategory: "मसाला श्रेणी",
    colMarket: "बाज़ार केंद्र",
    colState: "राज्य",
    colGrade: "ग्रेड / विशिष्टता",
    colSource: "रिपोर्टिंग स्रोत",
    colMin: "न्यूनतम दर (₹/किग्रा)",
    colMax: "अधिकतम दर (₹/किग्रा)",
    colAvg: "औसत दर (₹/किग्रा)",
    refreshBtn: "मूल्य ताज़ा करें",

    // Marketplace Page
    marketplaceTitle: "सत्यापित वानस्पतिक बाज़ार",
    listLotBtn: "बिक्री के लिए अपना लॉट सूचीबद्ध करें",
    filterBotanical: "मसाला किस्म द्वारा फ़िल्टर करें",
    qualityRatingGrade: "गुणवत्ता रेटिंग ग्रेड",
    searchPlaceholder: "उदा. वायनाड, कल्पेट्टा, सहकारी...",
    connectSellerBtn: "विक्रेता से जुड़ें",
    directCall: "सीधी कॉल",
    sendEmail: "ईमेल द्वारा पूछताछ भेजें",
    whatsAppMsg: "व्हाट्सएप सीधा संदेश",
    closeBtn: "बंद करें",

    // Add Varietal Page
    addVarietalTitle: "वानस्पतिक किस्म पंजीकृत करें",
    addVarietalSubtitle: "केरल सरकार के मूल्य मापदंडों के साथ डेटाबेस में नई कृषि किस्म दर्ज करें।",
    strainNameLabel: "वानस्पतिक किस्म का नाम",
    compoundNameLabel: "सक्रिय यौगिक का नाम",
    compoundBaselineLabel: "न्यूनतम यौगिक आधार %",
    giPrefixInputLabel: "आवश्यक जीआई टैग उपसर्ग",
    marketRateInputLabel: "केरल सरकार बाज़ार मानक दर (₹ / किग्रा)",
    descriptionInputLabel: "वानस्पतिक अवलोकन एवं कृषि प्रोफ़ाइल",
    allowedVisualsLabel: "संरचनात्मक दृश्य प्रोफ़ाइल (प्रति पंक्ति एक विकल्प)",
    submitVarietalBtn: "वानस्पतिक किस्म पंजीकृत करें",

    // Provenance Passport Page
    passportHeader: "डिजिटल वानस्पतिक उत्पत्ति पासपोर्ट",
    cultivationConditionsTitle: "खेती की स्थितियां",
    handlingJourneyTitle: "कटाई के बाद की प्रसंस्करण यात्रा",
    chemicalActiveTitle: "रासायनिक सक्रिय जांच",
    harvestBatchTitle: "कटाई की तिथि एवं बैच पंजीकरण",
    aiVisionTitle: "एआई विज़न अनुपालन निष्कर्ष",
    fairValuationTitle: "उचित नैतिक बाज़ार मूल्यांकन",
    printCertificateBtn: "उपभोक्ता प्रमाणपत्र प्रिंट करें",
  },
  ml: {
    // Brand & Nav
    brandTitle: "ദി എഐ ഹെർബോളജിസ്റ്റ്",
    brandSubtitle: "സസ്യ വിശുദ്ധി & വിളവ് വിശ്വസനീയ പോർട്ടൽ",
    navAudit: "ഓഡിറ്റ് പോർട്ടൽ",
    navPrices: "സ്പൈസസ് ബോർഡ് ലൈവ് വിലകൾ",
    navMarketplace: "മാർക്കറ്റ്പ്ലേസ് & വിൽപനക്കാർ",
    navAddVarietal: "ഇനം ചേർക്കുക",
    liveBadge: "ലൈവ്",

    // Banner & Ticker
    liveBannerTitle: "indianspices.com ദൈനംദിന മാർക്കറ്റ് ബുള്ളറ്റിനുമായി സിങ്ക് ചെയ്തു",
    liveBannerSubtitle: "കൊച്ചി, ബോഡിനായ്ക്കന്നൂർ, ആലപ്പുഴ ലേലങ്ങളിൽ നിന്നുള്ള ഔദ്യോഗിക പ്രതിദിന വിലകൾ.",
    liveBannerBtn: "ലൈവ് സ്പൈസസ് ബോർഡ് ഫീഡ് കാണുക →",

    // Audit Form
    auditTitle: "സസ്യ വിശുദ്ധി & വിളവ് വിശ്വസനീയ പോർട്ടൽ",
    auditSubtitle: "നാടൻ സുഗന്ധവ്യഞ്ജന കർഷകർക്ക് ഉത്ഭവം, കൃഷി രീതികൾ, സംസ്കരണ ഘട്ടങ്ങൾ എന്നിവ സാക്ഷ്യപ്പെടുത്താനും ഉചിതമായ പ്രീമിയം വില ഉറപ്പാക്കാനുമുള്ള പൂർണ്ണ ഡിജിറ്റൽ സംവിധാനം.",
    labelVarietal: "സസ്യ സുഗന്ധവ്യഞ്ജനം / ആയുർവേദ സസ്യ ഇനം",
    optionSelectVarietal: "ഡാറ്റാബേസിൽ നിന്ന് സുഗന്ധവ്യഞ്ജന ഇനം തിരഞ്ഞെടുക്കുക...",
    targetCompound: "ലക്ഷ്യ സംയുക്ത പരിശോധന",
    govtRateLabel: "കേരള സർക്കാർ മാനദണ്ഡ നിരക്ക്",
    giPrefixLabel: "ഭൂശാസ്ത്ര സൂചിക (GI) പ്രിഫിക്സ്",
    activeCompoundLabel: "സജീവ രാസ സംയുക്തം %",
    giStringLabel: "ജിഐ രജിസ്ട്രേഷൻ കോഡ് (അംഗീകൃത ഭൗമ സൂചിക)",
    cultivationLabel: "കൃഷി രീതികളും പരിസ്ഥിതി പാരാമീറ്ററുകളും",
    handlingLabel: "വിളവെടുപ്പിനു ശേഷമുള്ള സംസ്കരണ യാത്ര",
    visualLabel: "ഭൗതിക രൂപവും കാഴ്ച പരിശോധനയും",
    selectVisualPlaceholder: "രൂപഘടന തിരഞ്ഞെടുക്കുക...",
    selectVarietalFirst: "ആദ്യം ഒരു ഇനം തിരഞ്ഞെടുക്കുക",
    coaSectionTitle: "ലാബ് പരിശോധനാ സാക്ഷ്യപത്രം (COA) അറ്റാച്ച്മെന്റ്",
    coaAttachedRadio: "ഉൾപ്പെടുത്തിയ സാക്ഷ്യപത്രം ലഭ്യം",
    coaMissingRadio: "ലഭ്യമല്ല / സ്ഥിരീകരിച്ചിട്ടില്ല (മൂല്യം കുറയും)",
    uploadCoaLabel: "COA ഫയൽ അപ്‌ലോഡ് ചെയ്യുക (.pdf, .png, .jpg)",
    uploadPhotoLabel: "📷 ഭൗതിക രൂപഘടന എഐ പരിശോധനയ്ക്കായി ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
    analyzingImage: "ഫോട്ടോ എഐ വിവിഷൻ എൻജിൻ വഴി പരിശോധിക്കുന്നു...",
    detectedSuccess: "എഐ പരിശോധനയിലൂടെ രൂപഘടന കണ്ടെത്തി!",
    executeAuditBtn: "ഓഡിറ്റ് എക്സിക്യൂട്ട് ചെയ്യുക",
    executingAuditBtn: "എഐ പരിശോധനയും എൽഎൽഎം ഓഡിറ്റും പുരോഗമിക്കുന്നു...",

    // Audit Results
    auditReportHeader: "ഓഡിറ്റ് & ഉത്ഭവ സർട്ടിഫിക്കറ്റ് നൽകി",
    yqiIndexLabel: "YQI സൂചിക",
    govtStandardRate: "ഔദ്യോഗിക സർക്കാർ മാനദണ്ഡ നിരക്ക്",
    validatedValue: "സ്ഥിരീകരിച്ച ഉൽപ്പന്ന പ്രീമിയം മൂല്യം",
    speculatedWarning: "ഊഹാപോഹ മൂല്യം: COA ലഭ്യമല്ല",
    premiumEarned: "പ്രീമിയം ഗ്രേഡ് മൂല്യം ലഭിച്ചു",
    trustStatusLabel: "വിശ്വാസ്യത പദവി",
    aiAnalysisLabel: "എഐ കംപ്ലയൻസ് വിശകലനം",
    provenancePassportTitle: "ഉപഭോക്തൃ ഉത്ഭവ പരിശോധനാ പാസ്‌പോർട്ട്",
    provenancePassportDesc: "പാക്കേജിംഗിൽ അച്ചടിക്കുന്നതിനും ഉപഭോക്താക്കൾക്ക് സ്കാൻ ചെയ്തു വിശുദ്ധി ഉറപ്പാക്കുന്നതിനുമുള്ള ഡിജിറ്റൽ സർട്ടിഫിക്കറ്റ്.",
    viewPassportBtn: "ഉത്ഭവ പാസ്‌പോർട്ട് കാണുക",
    matchingSellersTitle: "ഈ പ്രദേശിക ഇനം വിൽക്കുന്ന രജിസ്റ്റർ ചെയ്ത കർഷകർ",
    viewFullMarketplace: "പൂർണ്ണ മാർക്കറ്റ് കാണുക →",

    // Live Prices Page
    livePricesTitle: "സ്പൈസസ് ബോർഡ് ഓഫ് ഇന്ത്യ — പ്രതിദിന ലൈവ് വിലകൾ",
    livePricesSubtitle: "കേന്ദ്ര വാണിജ്യ വ്യവസായ മന്ത്രാലയം, ഭാരത സർക്കാർ • ഔദ്യോഗിക വിപണി വില വിവരങ്ങൾ",
    officialPortalBtn: "ഔദ്യോഗിക സ്പൈസസ് ബോർഡ് പോർട്ടൽ",
    filterSpiceType: "സുഗന്ധവ്യഞ്ജന ഇനം അനുസരിച്ച് തിരഞ്ഞെടുക്കുക",
    filterMarketCentre: "വിപണി കേന്ദ്രം തിരഞ്ഞെടുക്കുക",
    searchGradeState: "ഗ്രേഡ് അല്ലെങ്കിൽ സംസ്ഥാനം തിരയുക",
    colDate: "തീയതി",
    colCategory: "ഇനം",
    colMarket: "വിപണി കേന്ദ്രം",
    colState: "സംസ്ഥാനം",
    colGrade: "ഗ്രേഡ് / തരം",
    colSource: "വിവര ഉറവിടം",
    colMin: "കുറഞ്ഞ നിരക്ക് (₹/kg)",
    colMax: "കൂടിയ നിരക്ക് (₹/kg)",
    colAvg: "ശരാശരി നിരക്ക് (₹/kg)",
    refreshBtn: "വില പുതുക്കുക",

    // Marketplace Page
    marketplaceTitle: "സാക്ഷ്യപ്പെടുത്തിയ കാർഷിക വിപണി",
    listLotBtn: "നിങ്ങളുടെ ഉൽപ്പന്നം വിൽപനയ്ക്ക് ചേർക്കുക",
    filterBotanical: "സസ്യ ഇനം അനുസരിച്ച് ഫിൽട്ടർ ചെയ്യുക",
    qualityRatingGrade: "ഗുണനിലവാര ഗ്രേഡ്",
    searchPlaceholder: "ഉദാ. വയനാട്, കൽപറ്റ, സഹകരണ സംഘം...",
    connectSellerBtn: "കർഷകനുമായി ബന്ധപ്പെടുക",
    directCall: "ഡയറക്ട് കോൾ",
    sendEmail: "ഇമെയിൽ അന്വേഷണം അയക്കുക",
    whatsAppMsg: "വാട്ട്‌സ്ആപ്പ് സന്ദേശം അയക്കുക",
    closeBtn: "അടയ്ക്കുക",

    // Add Varietal Page
    addVarietalTitle: "പുതിയ സസ്യ ഇനം രജിസ്റ്റർ ചെയ്യുക",
    addVarietalSubtitle: "കേരള സർക്കാരിന്റെ വിപണി നിരക്കുകളോടെ പുതിയ കാർഷിക ഇനം സിസ്റ്റത്തിൽ ഉൾപ്പെടുത്തുക.",
    strainNameLabel: "സസ്യ ഇനത്തിന്റെ പേര്",
    compoundNameLabel: "സജീവ സംയുക്തത്തിന്റെ പേര്",
    compoundBaselineLabel: "കുറഞ്ഞ സംയുക്ത അളവ് %",
    giPrefixInputLabel: "ആവശ്യമായ GI ടാഗ് പ്രിഫിക്സ്",
    marketRateInputLabel: "കേരള സർക്കാർ മാർക്കറ്റ് മാനദണ്ഡ നിരക്ക് (₹ / kg)",
    descriptionInputLabel: "സസ്യ വിവരവും കാർഷിക പ്രൊഫൈലും",
    allowedVisualsLabel: "രൂപഘടന ഓപ്ഷനുകൾ (ഓരോ വരിയിലും ഓരോന്ന്)",
    submitVarietalBtn: "സസ്യ ഇനം രജിസ്റ്റർ ചെയ്യുക",

    // Provenance Passport Page
    passportHeader: "ഡിജിറ്റൽ സസ്യ ഉത്ഭവ പാസ്‌പോർട്ട്",
    cultivationConditionsTitle: "കൃഷി രീതികൾ",
    handlingJourneyTitle: "വിളവെടുപ്പിനു ശേഷമുള്ള സംസ്കരണ യാത്ര",
    chemicalActiveTitle: "രാസ സംയുക്ത അളവ്",
    harvestBatchTitle: "വിളവെടുത്ത തീയതിയും ബാച്ച് രജിസ്ട്രേഷനും",
    aiVisionTitle: "എഐ വിഷൻ പരിശോധനാ കണ്ടെത്തലുകൾ",
    fairValuationTitle: "ന്യായമായ വിപണി മൂല്യനിർണ്ണയം",
    printCertificateBtn: "സർട്ടിഫിക്കറ്റ് പ്രിന്റ് ചെയ്യുക",
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => translations['en'][key] || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('ai_herbologist_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'hi' || savedLang === 'ml')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ai_herbologist_lang', lang);
  };

  const t = (key: keyof typeof translations['en']): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
