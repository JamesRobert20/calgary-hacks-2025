"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import { ConversationObject, MessageObject } from "@/types/chat";
import { and, collection, or, orderBy, query, where, onSnapshot, serverTimestamp, addDoc } from "firebase/firestore";
import { conversationConverter, firestore } from "@/lib/firestoreConfig";

export default function Home() {
    const [conversations, setConversations] = useState<ConversationObject[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<ConversationObject | null>(null);
    const [messages, setMessages] = useState<MessageObject[]>([]);

    const userId = "bot"

    // memoizing the reference to the conversations collection
    const conversationsRef = useMemo(() => collection(firestore, "conversations").withConverter(conversationConverter), []);

    // memoizing the query main query used to obtain a user's conversations
    const conversationsQuery = useMemo(() => query(
        conversationsRef,
        and(
            where("lastMessageId", "!=", ""),
            or(
                and(
                    where("firstParticipant.id", "==", userId),
                    where("firstParticipant.deletedAt", "==", null)
                ),
                and(
                    where("secondParticipant.id", "==", userId),
                    where("secondParticipant.deletedAt", "==", null)
                )
            )
        ),
        orderBy("updatedAt", "desc"),
    ), [userId]);

    // Subscribe to conversations
    useEffect(() => {
        const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
            const conversationsData = snapshot.docs.map(doc => doc.data());
            setConversations(conversationsData);
        });

        return () => unsubscribe();
    }, [conversationsQuery]);

    const messagesRef = collection(firestore, "messages");

    // Subscribe to messages when a conversation is selected
    useEffect(() => {
        if (!selectedConversation) return;

        const messagesQuery = query(
            messagesRef,
            where("conversationId", "==", selectedConversation),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as MessageObject[];
            setMessages(messagesData);
        });

        return () => unsubscribe();
    }, [selectedConversation]);

    const createNewEmptyMessage = useCallback(async (conversationId: string, text: string, receiver: string) => {
        const timeStamp = serverTimestamp();

        return (await addDoc(messagesRef, {
            id: "",
            conversationId,
            message: {
                type: "text",
                content: text,
            },
            senderId: userId,
            receiverId: receiver,
            createdAt: timeStamp,
            timeRead: null,
        })).id;
    }, [messagesRef]);

    const [messageInput, setMessageInput] = useState("");

    return (
        <div className={styles.container}>
            {/* Conversations Sidebar */}
            <div className={styles.sidebar}>
                <h2>Conversations</h2>
                <div className={styles.conversationList}>
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`${styles.conversationItem} ${selectedConversation?.id === conversation.id ? styles.selected : ""
                                }`}
                            onClick={() => setSelectedConversation(conversation)}
                        >
                            <div className={styles.conversationHeader}>
                                <span className={styles.lastMessage}>{conversation.lastMessage}</span>
                                <span className={styles.timestamp}>
                                    {conversation.updatedAt.toDate().toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={styles.chatArea}>
                {selectedConversation ? (
                    <>
                        <div className={styles.messageList}>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`${styles.message} ${message.senderId === userId
                                        ? styles.sent
                                        : styles.received
                                        }`}
                                >
                                    <div className={styles.messageContent}>
                                        {message.message.content}
                                    </div>
                                    <div className={styles.messageTime}>
                                        {message.createdAt.toDate().toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.inputArea}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className={styles.messageInput}
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                            />
                            <button
                                onClick={() => createNewEmptyMessage(selectedConversation.id, messageInput, selectedConversation.firstParticipant.id)}
                                className={styles.sendButton}>Send</button>
                        </div>
                    </>
                ) : (
                    <div className={styles.noSelection}>
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}
