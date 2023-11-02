"use client"

import React, { useState } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { ListItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Delete } from '@mui/icons-material';
import { auth } from '@/libs/firebase';

const AnnotationList = ({ annotations, setAnnotations }) => {
  const API_URI = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:8080'
  const [src, setSrc] = useState(null);

  const deleteHandler = (annotation) => {
    if (window.confirm('注釈を削除しますか?')) {
      fetch(`${API_URI}/anedit/delete/${annotation.annotation_id}?userid=${auth.currentUser.uid}`)
        .then(() => {
          alert('注釈を一件削除しました');
          setSrc(null);
          const updatedAnnotations = annotations.filter(elem => elem.annotation_id !== annotation.annotation_id);
          setAnnotations(updatedAnnotations);
        })
        .catch((err) => alert(err.toString()));
    } 
  };

  return (
    <div>
      <List
        sx={{ width: '100%', maxWidth: 550, bgcolor: 'background.paper', maxHeight: 300}}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Annotations
          </ListSubheader>
        }
      >
          {annotations.map((annotation) => (
              <ListItem 
                key={annotation.annotation_id}
                secondaryAction={
                  <IconButton edge="end" aria-label="comments" onClick={() => deleteHandler(annotation)}>
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemButton onClick={() => setSrc(annotation.imageURI)}>
                  <ListItemText primary={annotation.chars} secondary={annotation.on}/>
                </ListItemButton>
              </ListItem>
          ))}
      </List>
      {src ? (
        <img src={src} alt="annotation image" width="10%" height="15%"/>
      ) : (
        <></>
      )}
    </div>
  );
}

export default AnnotationList;