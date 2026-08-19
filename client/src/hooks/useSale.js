import { useState } from "react";

const useSale = (loadMedicines) => {
    const [loading, setLoading] = useState(false);

    const sellMedicine = async (medicine) => {
        const quantity = prompt(
            `Enter quantity to sell for ${medicine.fullName}:`
        );

        if (!quantity) {
            return;
        }

        const quantitySold = Number(quantity);

        if (!Number.isInteger(quantitySold) || quantitySold <= 0) {
            alert("Enter a valid quantity.");
            return;
        }

        if (quantitySold > medicine.quantity) {
            alert("Not enough stock available.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `/api/sale?medicineId=${medicine.id}&quantitySold=${quantitySold}`,
                {
                    method: "POST"
                }
            );

            if (!response.ok) {
                const message = await response.text();
                alert(message);
                return;
            }

            alert("Sale recorded successfully.");

            await loadMedicines();
        } catch (error) {
            console.error("Error recording sale:", error);
            alert("Unable to record sale.");
        } finally {
            setLoading(false);
        }
    };

    return {
        sellMedicine,
        loading
    };
};

export default useSale;