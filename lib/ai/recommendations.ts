import type { UploadCategory } from "@/app/dashboard/_components/ElectronicItem";

export function generateRecommendation(category: UploadCategory | "Other") {
    switch (category) {
        case "Mobile":
        case "Laptop":
            return "Remove personal data before recycling. Remove the battery if possible. Take it to a certified e-waste recycling center. Do not dispose of it in household waste.";
        case "Battery":
            return "Tape exposed terminals and bring it to a battery collection point. Do not put it in household waste.";
        case "Accessory":
        case "Appliance":
            return "Check if the accessory can be reused or donated. Otherwise dispose at a certified recycler.";
        case "Monitor":
            return "Large items may require special drop-off. Remove any batteries and take them to a certified facility.";
        default:
            return "Take this item to a certified e-waste recycling center. Do not dispose of it in household waste.";
    }
}
