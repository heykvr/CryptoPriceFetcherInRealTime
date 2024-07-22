/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites(){
        return [{
            source:"/api/prices/:crypto",
            destination:"http://localhost:5000/api/prices/:crypto"
        }]

    }
};

export default nextConfig;
