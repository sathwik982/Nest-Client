// components/models/PgProperty.js

export class PgRoomType {
    constructor(json) {
        this.id = json._id?.$oid || "";
        this.type = json.type || ""; // single / double / triple
        this.pricePerMonth = json.pricePerMonth || 0;
        this.capacity = json.capacity || 0;
        this.availableRooms = json.availableRooms || 0;
    }
}

export class PgProperty {
    constructor(json) {
        this.id = json._id?.$oid || "";
        this.name = json.name || "";
        this.description = json.description || "";
        this.gender = json.gender || ""; // boys / girls / unisex
        this.propertyType = json.propertyType || "";
        this.status = json.status || "";

        const loc = json.location || {};
        this.city = loc.city || "";
        this.area = loc.area || "";
        this.address = loc.address || "";
        this.latitude = loc.latitude || 0;
        this.longitude = loc.longitude || 0;

        this.roomTypes = (json.roomTypes || []).map((r) => new PgRoomType(r));

        this.amenities = (json.amenities || []).map((a) => a.$oid || a);
        this.services = (json.services || []).map((s) => s.$oid || s);

        this.images = json.images || [];
        this.videos = json.videos || [];

        this.createdAt = this.parseDate(json.createdAt);
        this.updatedAt = this.parseDate(json.updatedAt);

        this.startingPrice = this.computeStartingPrice();
        this.primaryImage = this.images[0] || "";
    }

    parseDate(dateObj) {
        if (!dateObj) return null;
        const iso = dateObj.$date || dateObj;
        const d = new Date(iso);
        return isNaN(d.getTime()) ? null : d;
    }

    computeStartingPrice() {
        if (!this.roomTypes.length) return 0;
        return Math.min(...this.roomTypes.map((r) => r.pricePerMonth || 0));
    }

    get roomTypeLabel() {
        if (!this.roomTypes.length) return "";
        const uniqueTypes = Array.from(
            new Set(this.roomTypes.map((r) => r.type.toLowerCase()))
        );
        return uniqueTypes
            .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
            .join(" • ");
    }

    get genderLabel() {
        if (!this.gender) return "";
        if (this.gender === "boys") return "Boys";
        if (this.gender === "girls") return "Girls";
        return "Unisex";
    }

    get locationLabel() {
        if (this.area && this.city) return `${this.area}, ${this.city}`;
        return this.area || this.city || "";
    }
}
