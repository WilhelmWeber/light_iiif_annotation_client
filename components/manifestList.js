"use client"

import Link from 'next/link';
import React from 'react';
import Button from '@mui/material/Button'
import { IconButton } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Panorama, Delete } from '@mui/icons-material';
import { auth } from '@/libs/firebase';

const ManifestList = ({ manifests, setManifests }) => {
    const API_URI = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:8080'

    const manifestdeleteHandler = (manifest) => {
        if (window.confirm(`${manifest.label}を削除しますか？`)) {
            fetch(`${API_URI}/manifests/delete/${manifest.manifest_id}/?userid=${auth.currentUser.uid}`)
              .then(() => {
                alert('マニフェストと注釈を削除しました');
                const newManifests = manifests.filter(elem => elem.manifest_id !== manifest.manifest_id);
                setManifests(newManifests);
              })
              .catch((err) => {
                alert(err.toString());
              })
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align='left'>Title</TableCell>
                        <TableCell align='left'>Attribution</TableCell>
                        <TableCell align='left'>License</TableCell>
                        <TableCell align='left'>Contributor</TableCell>
                        <TableCell align='left'>Created_At</TableCell>
                        <TableCell align='left'>Edit Annotation</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {manifests.map((manifest) => (
                        <TableRow key={manifest.manifest_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                <Link href={`${API_URI}/presentation/${manifest.manifest_id}/manifest.json`}>{ manifest.label }</Link>
                                <IconButton href={`${API_URI}/viewer/${manifest.manifest_id}/`}>
                                    <Panorama />
                                </IconButton>
                                <IconButton onClick={() => manifestdeleteHandler(manifest)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                            <TableCell align='left'>{ manifest.attribution }</TableCell>
                            <TableCell align='left'>{ manifest.license }</TableCell>
                            <TableCell align='left'>{ manifest.contributor }</TableCell>
                            <TableCell align='left'>{ manifest.createdAt }</TableCell>
                            <TableCell>
                                <Button
                                  variant='contained'
                                  color='primary'
                                  href={`/annotations/${manifest.manifest_id}`}
                                >
                                    注釈の編集
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ManifestList;