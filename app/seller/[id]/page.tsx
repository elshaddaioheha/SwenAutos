import React from "react"
import SellerProfile from "../../../components/vendor/SellerProfile"

export default async function SellerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // For now use mock seller data; replace with API/contract call
    const seller = {
        id: id,
        name: `Seller ${id}`,
        joined: "2024-01-01",
        earnings: 1234.5,
        listings: [
            { id: 1, title: "Brake Pad", price: 49.99, inventory: 12 },
            { id: 2, title: "Air Filter", price: 19.99, inventory: 5 },
        ],
    }

    return (
        <div className="p-6">
            <SellerProfile seller={seller} />
        </div>
    )
}
