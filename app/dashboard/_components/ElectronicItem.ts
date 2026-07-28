export type UploadCategory =
    | "Mobile"
    | "Laptop"
    | "Battery"
    | "Monitor"
    | "Appliance"
    | "Accessory"
    | "Other";

export interface ElectronicItem {
    id: string;
    imageUrl: string;
    category: UploadCategory;
    description?: string;
    uploadedAt: string;
    aiConfidence?: number;
    recommendation?: string;
}

export const ELECTRONIC_ITEM_CATEGORIES: UploadCategory[] = [
    "Mobile",
    "Laptop",
    "Battery",
    "Monitor",
    "Appliance",
    "Accessory",
    "Other",
];
