import React from "react";
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";
import dialogActions from "../store/actions/dialogActions";

const { setGenerated } = dialogActions;

// for cleaning up provider handling
export const ComposeComponents = ({ components = [], children = <></> }) => {
  return components.reverse().reduce((child, Component) => {
    return <Component>{child}</Component>;
  }, children);
};

// get secret from session storage
export const getSecret = () => {
  return window.sessionStorage.getItem("secret");
};

// set secret to session storage
export const storeSecret = (secret) => {
  window.sessionStorage.setItem("secret", secret);
};

// for encrypting a value before sending to knox
export const aesEncrypt = (string, secret) => {
  if (!string || !secret) return;
  const encrypted = AES.encrypt(string, secret);
  return encrypted.toString();
};

// for decrypting a value received from knox
export const aesDecrypt = (string, secret) => {
  if (!string || !secret) return;
  const decrypted = AES.decrypt(string, secret).toString(CryptoJS.enc.Utf8);
  return decrypted;
};

// TODO: this works alright but shuffle still relies on .random, how good is this really?
String.prototype.pick = function (enty, min, max) {
  let n,
    chars = "";

  if (typeof max === "undefined") {
    n = min;
  } else {
    n = min + Math.floor(Math.random() * (max - min + 1));
  }

  for (let i = 0; i < n; i++) {
    chars += this.charAt(
      Math.floor(parseFloat(`0.${enty.shuffle()}`) * this.length)
    );
  }

  return chars;
};

String.prototype.shuffle = function () {
  let array = this.split("");
  let tmp,
    current,
    top = array.length;

  if (top)
    while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }

  return array.join("");
};

// for creating a password
export const generatePassword = (dialogDispatch, urbitApi) => {
  const makeItAndSetIt = (enty) => {
    let specials = "!@#$%^&*()_+{}:\"<>?|[];',./`~";
    let lowercase = "abcdefghijklmnopqrstuvwxyz";
    let uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numbers = "0123456789";

    let all = specials + lowercase + uppercase + numbers;

    let password = "";
    password += specials.pick(enty.toString(), 1);
    password += lowercase.pick(enty.toString(), 1);
    password += uppercase.pick(enty.toString(), 1);
    password += numbers.pick(enty.toString(), 1);
    password += all.pick(enty.toString(), 8, 10);
    password = password.shuffle();
    dialogDispatch(setGenerated(password));
  };

  const handleScry = () => {
    urbitApi
      .scry({
        app: "knox",
        path: "/enty",
      })
      .then((res) => makeItAndSetIt(res.enty))
      // TODO: handle error
      .catch((err) => console.log("error", err));
  };

  urbitApi
    .poke({
      app: "knox",
      mark: "knox-action",
      json: {
        gen: { enty: parseInt(1) },
      },
    })
    .then(handleScry())
    // TODO: handle this error
    .catch((err) => console.log("err", err));
};

export const prepareExport = (vault) => {
  return aesEncrypt(JSON.stringify(vault), getSecret());
};

// for preparing an import .knox file
export const prepareImport = (imports) => {
  const secret = getSecret();
  let importArray;
  if (imports) {
    importArray = JSON.parse(imports);
  }
  if (!secret || !imports || !importArray.length) return;
  const newArr = [];
  importArray.forEach((entry) => {
    newArr.push({
      id: entry.id,
      website: aesEncrypt(entry["website"], secret),
      username: aesEncrypt(entry["username"], secret),
      password: aesEncrypt(entry["password"], secret),
      updated: new Date(entry.updated).getTime(),
    });
  });
  return newArr;
};
