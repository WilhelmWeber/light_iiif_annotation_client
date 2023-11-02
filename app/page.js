"use client";

import React, { useEffect, useState, useRef } from 'react';
import ManifestList from '@/components/manifestList';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ButtonAppBar from '@/components/header';
import { auth } from '@/libs/firebase';
import SigninComponent from '@/components/singin';
import { useAuthState } from 'react-firebase-hooks/auth';
import Pagenation  from '@mui/material/Pagination'

export default function Manifests() {
    const API_URI = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:8080';
    const [user] = useAuthState(auth);
    const uriRef = useRef();
    const [manifests, setManifests] = useState([]);

    //ページネーション用の設定
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState();
    const displayNum = 10;
    const [displayed, setDisplayed] = useState([]);

    const Manifests_Getter = async () => {
        if (!user) return;
        const res = await fetch(`${API_URI}/manifests/?userid=${auth.currentUser.uid}`);
        const res_json = await res.json();
        setManifests(res_json);
        setPageCount(Math.ceil(res_json.length/displayNum));
        setDisplayed(res_json.slice(((page - 1) * displayNum), page * displayNum));
    };

    useEffect(() => {
        Manifests_Getter();
    }, [user]);

    
    const submitHandler = async (e) => {
        e.preventDefault();
        if (window.confirm('登録しますか？')) {
            const data = {
                uri: uriRef.current.value,
            };
            axios.post(`${API_URI}/manifests/?userid=${auth.currentUser.uid}`, data)
              .then(() => {
                alert('登録が完了しました');
                Manifests_Getter();
               })
              .catch((err) => alert(err.toString()));
        }
    };

    //ページ変更
    const changeHandler = (event, index) => {
        setPage(index);
        setDisplayed(manifests.slice(((index - 1) * displayNum), index * displayNum));
    }

    return (
        <>
        { user ? (
            <div>
                <ButtonAppBar />
                <Box sx={{ width:500, maxWidth:'100%', display:'flex'}}>
                    <TextField label="ManifestURI" fullWidth inputRef={uriRef}/>
                    <Button variant='outlined' onClick={submitHandler}>登録</Button>
                </Box>
                <ManifestList manifests={manifests} setManifests={setManifests}/>
                <Pagenation count={pageCount} page={page} variant='outlined' color='primary' onChange={changeHandler}/>
            </div>
        ) : (
            <SigninComponent />
        )}
        </>
    );
}