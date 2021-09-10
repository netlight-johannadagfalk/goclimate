import React, { useContext } from 'react';

const TextsContext = React.createContext(undefined);
export const useTexts = () => {
  const context = useContext(TextsContext);
  if (!context) throw new Error('TextsContext does not exist.');
  return context;
};

export const TextsProvider = ({
  children,
  commonText,
  lifestyleFootprintsText,
  modelText,
  registrationsText,
  slug,
}) => {
  const texts = {
    commonText: JSON.parse(commonText),
    lifestyleFootprintsText: JSON.parse(lifestyleFootprintsText),
    modelText: JSON.parse(modelText),
    registrationsText: JSON.parse(registrationsText),
  };

  if (texts.registrationsText.accept_policies === undefined)
    texts.registrationsText.accept_policies =
      'By signing up you accept the <a>terms of use and policies</a>';

  texts.registrationsText.accept_policies =
    texts.registrationsText.accept_policies.replace(
      '<a>',
      "<a href='" +
        (slug ? '/' + slug : '') +
        "/privacy-policy' target='_blank' rel='noreferrer'>"
    );

  return (
    <TextsContext.Provider value={texts}>{children}</TextsContext.Provider>
  );
};
