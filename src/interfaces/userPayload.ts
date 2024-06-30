interface UserPayload{
    // User Data

    id: bigint;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    createdAt: Date;

    // Extra Data
    sessionId: string;

    // Standard JWT fields
    iat?: number; // Issued At
    exp?: number; // Expiration Time
}

export default UserPayload;