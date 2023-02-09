import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import * as bcrypt from "bcryptjs";
import { getSecret, storeSecret } from "../../utils";

import { UrbitContext } from "../../store/contexts/urbitContext";

export const Login = () => {
  const [urbitApi] = useContext(UrbitContext);
  const [open, setOpen] = useState(true);
  const [secret, setSecret] = useState("");
  const [wrongSecret, setWrongSecret] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (getSecret()) navigate("/apps/knox/");
  });

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setSecret(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    urbitApi
      .scry({
        app: "knox",
        path: "/secret",
      })
      .then((res) => {
        const secretHash = res.secret;
        if (bcrypt.compareSync(secret, secretHash)) {
          storeSecret(secret);
          navigate("/apps/knox/");
        } else {
          setWrongSecret(true);
          setTimeout(() => {
            setWrongSecret(false);
          }, 3000);
        }
      })
      // TODO: use this to set an error?
      .catch((err) => console.log("err", err));
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <div className="fixed inset-0 flex flex-col items-center justify-center h-screen">
        <div className="border-2 border-black border-t-4 bg-white rounded-md w-[95%] sm:w-[450px] h-[35%] flex justify-center items-center shadow-lg pb-10">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-col m-2">
              <button
                type="button"
                onClick={handleShowPassword}
                className="self-end focus:outline-none focus:ring focus:ring-gray-500"
              >
                {showPassword ? "hide" : "show"}
              </button>
              <input
                type={!showPassword ? "password" : null}
                name="secret"
                value={secret}
                placeholder="set your secret"
                onChange={handleChange}
                className="text-black border border-black p-1 focus:outline-none focus:ring focus:ring-gray-500"
              ></input>
            </div>
            {wrongSecret && (
              <button
                disabled
                className="border border-black rounded bg-red-400"
              >
                invalid secret
              </button>
            )}
            <button
              disabled={!secret}
              className="border-black border-solid border rounded m-2 focus:outline-none focus:ring focus:ring-gray-500"
              type="submit"
            >
              set secret
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  );
};
