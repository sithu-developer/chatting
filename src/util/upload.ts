import { PutBlobResult } from "@vercel/blob";
import { envValues } from "./envValues";

export const uploadToBlob = async(file : File) => {
    const response = await fetch(`${envValues.apiUrl}/upload?filename=${file.name}` , {
        method : "POST",
        body: file,
    });
    const blob = (await response.json()) as PutBlobResult;
    return blob.url;
}

export const uploadAudioToBlob = async(audioBlob : Blob) => {
    const response = await fetch(`${envValues.apiUrl}/upload?filename=voice` , {
        method : "POST",
        body: audioBlob,
    });
    const blob = (await response.json()) as PutBlobResult;
    return blob.url;
}