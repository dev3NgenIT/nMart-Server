import { server } from '@/config'

export const customTransform = (ret: Record<string, any>, images: string[]) => {
    // Transform _id to id and remove unnecessary fields
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;

    // Function to process image fields
    const processImageField = (imageObj: any) => {
			if (imageObj?.secure_url && !imageObj.secure_url.startsWith('http')) {

					imageObj.secure_url = `${server.origin}${imageObj.secure_url}`
			}
    }

    // Function to recursively process an object
    const processObject = (obj: any) => {
        if (!obj || typeof obj !== 'object') return;

        // Check all specified image fields in the current object
        images.forEach((field) => {
            if (obj[field]) {
                // Handle single image object (like coverPhoto, thumbnail)
                if (obj[field].secure_url) {
                    processImageField(obj[field]);
                }
                // Handle array of images (like images array)
                else if (Array.isArray(obj[field])) {
                    obj[field].forEach((item: any) => {
                        if (item?.secure_url) {
                            processImageField(item);
                        }
                    });
                }
            }
        });

        // Recursively process all properties
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                if (Array.isArray(obj[key])) {
                    obj[key].forEach((item: any) => processObject(item));
                } else {
                    processObject(obj[key]);
                }
            }
        }
    };

    // Start processing from the root object
    processObject(ret);
};