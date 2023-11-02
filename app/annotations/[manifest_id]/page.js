"use client";

import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import OpenSeadragon from "openseadragon";
import 'openseadragonselection-uptodate/dist/openseadragonselection';
import { Box } from "@mui/material";
import TextField from '@mui/material/TextField';
import { Stack } from "@mui/material";
import AnnotationList from "@/components/annotationList";
import ButtonAppBar from "@/components/header";
import { auth } from "@/libs/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import SigninComponent from "@/components/singin";

export default function Home({ params: { manifest_id } }) {
  const [user] = useAuthState(auth);
  const [annotations , setAnnotations] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const charRef = useRef(null); 
  const API_URI = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:8080'

  const ManifestHandler = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const imageJsons = [];
        const canvaseUris = [];     

        const api_res = await fetch(`${API_URI}/anedit/${manifest_id}?userid=${auth.currentUser.uid}`);
        const api_res_json = await api_res.json();
        //アノテーションをセット
        setAnnotations(api_res_json.annotation);

        //マニフェストのURIでビュアーを起動
        const result = await fetch(api_res_json.manifest.manifest_uri);
        const res_json = await result.json();
        for (let i=0; i<res_json["sequences"].length; i++) {
          for (let j=0; j<res_json["sequences"][i]["canvases"].length; j++) {
            let canvase = res_json["sequences"][i]["canvases"][j];
            let uri = canvase["images"][0]["resource"]["service"]["@id"]+'/info.json';
            let id = canvase['@id'];
            imageJsons.push(uri);
            canvaseUris.push(id);
          }
        }

        const viewer = OpenSeadragon({
          sequenceMode: true,
          visibilityRatio: 1,
          minZoomLevel: 0.3,
          defaultZoomLevel: 0.7,
          id: 'openseadragon',
          prefixUrl: "/images/",
          initialPage: 0,
          tileSources: [],
        });

        viewer.open(imageJsons);

        viewer.addHandler('page', (result) => {
          setPageNum(result.page + 1);
        });
    
        const selection = viewer.selection({
          onSelection: function(rect){
            const x = rect.x;
            const y = rect.y;
            const w = rect.width;
            const h = rect.height;
            const currentPage = viewer.currentPage();
            const chars = charRef.current.value;
            const annotation_id = uuidv4();
            const on = `${canvaseUris[currentPage]}#xywh=${x},${y},${w},${h}`
            const imageURI = `${imageJsons[currentPage].replace(/\/info.json$/,'')}/${x},${y},${w},${h}/200,/0/default.jpg`
    
            const data = {
              manifest_id: manifest_id,
              annotation_id: annotation_id,
              chars:chars,
              on: on,
              canvas: currentPage,
              imageURI: imageURI,
              userID: auth.currentUser.uid,
            };
            axios.post(`${API_URI}/anedit/${manifest_id}?userid=${auth.currentUser.uid}`, data)
              .then(async () => {
                alert('アノテーションが登録されました');
                setAnnotations([...annotations, data]);
              })
              .catch((err) => alert(err.toString())); 
          }
        });
      }
    });
  };

  useEffect(() => {
    ManifestHandler();
  }, []);

  return (
    <>
    { user ? (
      <div>
        <ButtonAppBar />
        <Stack direction="row" spacing={4}>
        <div>
          <Box className="w-[800px] h-[600px] bg-black" id="openseadragon" sx={{ border: 1 }}/>
          <p>現在のページ:{ pageNum }</p>
        </div>
        <TextField 
          id="standard-multiline-static"
          label="Annotation"
          multiline
          rows={4}
          variant="standard"
          inputRef={charRef}
        />
        <AnnotationList annotations={annotations} setAnnotations={setAnnotations}/>
        </Stack>
      </div>
    ) : (
      <SigninComponent />
    )}
    </>
  );
}