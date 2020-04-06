export interface Message {
    id: number;
    senderId: number;
    receiverId: number;

    senderKnownAs: string;
    ReceiverKnownAs: string;

    senderPhotoUrl: string;
    receiverPhotoUrl: number;

    content: string;
    sendAt: any;
    isRead: boolean;
    ReadAt: any;
}
