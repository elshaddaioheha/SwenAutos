import ProductDetailsClient from "./ProductDetailsClient";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    // In a real application, you would fetch data from your API/DB here
    // based on params.id

    // For now, we use the mock data mirroring the client component to demonstrate
    const PRODUCTS = [
        { id: "1", name: "Engine Oil Filter - Toyota Camry", description: "High-quality OEM engine oil filter." },
        { id: "2", name: "Brake Pads Set - Honda Accord", description: "Ceramic brake pads for Honda Accord." },
        { id: "3", name: "Car Battery 12V - Universal", description: "Maintenance-free 12V car battery." },
        { id: "4", name: "Headlight Assembly - Mercedes", description: "Full LED headlight assembly." },
    ];

    const product = PRODUCTS.find(p => p.id === params.id);

    if (!product) {
        return {
            title: "Product Not Found | SwenAutos",
        };
    }

    return {
        title: `${product.name} | SwenAutos`,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: ['/placeholder-part.png'],
        },
    };
}

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    return <ProductDetailsClient id={params.id} />;
}
