import React from "react";
import { Button } from "@mui/material";
import { auth, provider } from "@/libs/firebase";
import { signInWithPopup } from "firebase/auth";

const SigninComponent = () => {
    const signin = () => {
        signInWithPopup(auth, provider);
    };

    return (
        <>
          <Button variant="outlined" onClick={signin}>Googleアカウントでサインインする</Button>
        </>
    );
};

export default SigninComponent;