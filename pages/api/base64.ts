import type { NextApiRequest, NextApiResponse } from 'next';
export default function Base64(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        
    } else {
        res.status(200).send("Error: Don't use GET, please use POST method.");
    }
};