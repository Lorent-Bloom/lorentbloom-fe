export const roTranslations = {
  title: "CONTRACT DE LOCAȚIUNE A BUNURILOR MOBILE",
  contractNumber: "Nr.",
  date: "din",

  sections: {
    parties: {
      title: "1. PĂRȚILE CONTRACTANTE",
      owner: "LOCATOR (Proprietar)",
      renter: "LOCATAR (Chiriaș)",
      name: "Nume",
      idnp: "IDNP",
      address: "Adresa",
      phone: "Telefon",
      email: "Email",
    },
    subject: {
      title: "2. OBIECTUL CONTRACTULUI",
      productName: "Denumirea produsului",
      productSku: "Cod identificare",
      description: "Descriere",
    },
    duration: {
      title: "3. TERMENUL CONTRACTULUI",
      from: "De la",
      to: "Până la",
      totalDays: "Număr total de zile",
    },
    price: {
      title: "4. PREȚUL ȘI MODALITATEA DE PLATĂ",
      totalPrice: "Chiria totală",
      paymentMethod: "Modalitatea de plată",
    },
    ownerObligations: {
      title: "5. OBLIGAȚIILE LOCATORULUI",
      items: [
        "Să transmită Locatarului bunul în stare corespunzătoare folosinței conform destinației.",
        "Să predea toate documentele și accesoriile necesare utilizării bunului.",
        "Să asigure funcționarea normală a bunului pe durata contractului.",
        "Să nu împiedice folosința liniștită a bunului de către Locatar.",
      ],
    },
    renterObligations: {
      title: "6. OBLIGAȚIILE LOCATARULUI",
      items: [
        "Să folosească bunul conform destinației stabilite în contract.",
        "Să achite chiria în termenele și condițiile stabilite.",
        "Să păstreze integritatea bunului și să-l returneze în aceeași stare.",
        "Să nu transmită bunul în sublocațiune fără acordul scris al Locatorului.",
        "Să suporte cheltuielile de întreținere curentă a bunului.",
        "Să informeze imediat Locatorul despre orice deteriorare sau defecțiune a bunului.",
      ],
    },
    liability: {
      title: "7. RĂSPUNDEREA PĂRȚILOR",
      content:
        "Părțile poartă răspundere pentru neexecutarea sau executarea necorespunzătoare a obligațiilor ce le revin în conformitate cu prezentul contract și cu legislația în vigoare a Republicii Moldova. În caz de deteriorare sau pierdere a bunului din vina Locatarului, acesta este obligat să despăgubească Locatorul în mărime egală cu valoarea bunului.",
    },
    forceMajeure: {
      title: "8. FORȚA MAJORĂ",
      content:
        "Părțile sunt exonerate de răspundere pentru neexecutarea totală sau parțială a obligațiilor contractuale, dacă o astfel de neexecutare a survenit în urma unui eveniment de forță majoră (incendiu, inundație, cutremur, războaie, acte ale organelor de conducere și administrare a Republicii Moldova).",
    },
    disputes: {
      title: "9. SOLUȚIONAREA LITIGIILOR",
      content:
        "Orice litigiu decurgând din sau în legătură cu prezentul contract va fi soluționat pe cale amiabilă. În cazul în care părțile nu ajung la un acord, litigiul va fi supus spre soluționare instanțelor judecătorești competente din Republica Moldova.",
    },
    electronicSignature: {
      title: "10. CLAUZA DE SEMNĂTURĂ ELECTRONICĂ",
      content:
        "Părțile convin că semnăturile electronice aplicate prezentului contract (inclusiv semnăturile desenate, tastate sau încărcate digital) au aceeași valoare juridică ca semnăturile olografe, în conformitate cu art. 1252 Cod Civil și Legea nr. 124/2022 privind identificarea electronică și serviciile de încredere.",
    },
    finalProvisions: {
      title: "11. DISPOZIȚII FINALE",
      items: [
        "Orice modificare sau completare la prezentul Contract este valabilă doar dacă a fost efectuată în formă scrisă și semnată de către ambele părți.",
        "Prezentul Contract este întocmit în format electronic, câte un exemplar pentru fiecare Parte, cu aceeași valoare juridică.",
        "Contractul intră în vigoare la data semnării de către ambele părți.",
      ],
    },
    signatures: {
      title: "12. SEMNĂTURI",
      owner: "LOCATOR",
      renter: "LOCATAR",
      signatureLabel: "Semnătura",
      dateLabel: "Data",
    },
  },
};

export type ContractTranslations = typeof roTranslations;
