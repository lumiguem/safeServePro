interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    resource_type: string;
    format?: string;
}

import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../../config/cloudinary";

const CLOUD_NAME = CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = CLOUDINARY_UPLOAD_PRESET;

export async function uploadImageToCloudinary(file: File): Promise<CloudinaryUploadResult> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Cloudinary upload failed: ${res.status} ${errorText}`);
    }

    return res.json();
}
