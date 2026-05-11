import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadResult = await cloudinary.uploader
    .upload(
        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
        { public_id: 'shoes', }
    )
    .catch((error) => {
        console.log(error);
    });

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        //file has been uploaded successfully
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);//remove the locally svaed temp. file  as upload operation had failed
        return null;
    }
}

const deleteFromCloudinary = async (url) => {
    try {
        if (!url) return null;
        
        // Extract publicId from URL
        // Example: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.jpg
        const parts = url.split('/');
        const fileNameWithExtension = parts.pop();
        const publicIdWithFolders = fileNameWithExtension.split('.')[0];
        
        // If there are folders, we need to include them. 
        // Cloudinary URLs store publicId after '/upload/v<version>/'
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex !== -1) {
            // Skip 'upload' and the version (usually starts with 'v')
            const startIndex = parts[uploadIndex + 1].startsWith('v') ? uploadIndex + 2 : uploadIndex + 1;
            const publicId = [...parts.slice(startIndex), publicIdWithFolders].join('/');
            const response = await cloudinary.uploader.destroy(publicId);
            return response;
        }
        
        // Fallback for simple URLs
        const response = await cloudinary.uploader.destroy(publicIdWithFolders);
        return response;
    } catch (error) {
        console.log("Error deleting from Cloudinary:", error);
        return null;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }