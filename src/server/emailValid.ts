import MailChecker from "mailchecker";
import validate from "deep-email-validator";

const BANNED_DOMAINS = [
  "10minutemail.com",
  "temp-mail.org",
  "guerrillamail.com",
  "mailinator.com",
  "dispostable.com",
  "getnada.com",
  "maildrop.cc",
  "yopmail.com",
  "sharklasers.com",
  "guerrillamailblock.com",
  "pokemail.net",
  "spam4.me",
  "tempmail.com",
  "dropmail.me",
  "tmail.ws",
  "fakemail.net",
  "crazymailing.com",
  "protonmail.ch",
  "uiemail.com",
  "virgilian.com",
  "kagebox.com",
  "binkmail.com",
  "bobmail.info",
  "chammy.info",
  "devnullmail.com",
  "letthemeatspam.com",
  "mailin8r.com",
  "pookmail.com",
  "speedymail.org",
];

export const emailValid = async (email: string) => {
  try {
    const domain = email.split("@")[1]?.toLowerCase();

    if (BANNED_DOMAINS.includes(domain)) {
      return false;
    }

    if (!MailChecker.isValid(email)) {
      return false;
    }

    const res = await validate({
      email: email,
      validateSMTP: false,
      validateMx: false,
      validateTypo: true,
      validateDisposable: true,
    });

    return res.valid;
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
};
