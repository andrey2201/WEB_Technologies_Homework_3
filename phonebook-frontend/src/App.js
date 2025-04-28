import React, { useState, useEffect } from 'react';

function App() {
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({ name: '', phone: '', address: '', image: '', metaInfo: '' });
    const [isEditing, setIsEditing] = useState(false);

    // Извличане на всички контакти
    useEffect(() => {
        fetch('http://localhost:3000/contacts')
            .then(response => response.json())
            .then(data => setContacts(data));
    }, []);

    // Добавяне на нов контакт
    const handleAddContact = async () => {
        const response = await fetch('http://localhost:3000/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContact),
        });
        const data = await response.json();
        setContacts([...contacts, data]);
    };

    // Редактиране на контакт
    const handleEdit = (contact) => {
        setNewContact(contact);
        setIsEditing(true);
    };

    const handleUpdateContact = async () => {
        const response = await fetch(`http://localhost:3000/contacts/${newContact.name}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContact),
        });
        const data = await response.json();
        setContacts(contacts.map(contact => (contact.name === data.name ? data : contact)));
        setIsEditing(false);
    };

    // Сливане на контакти
    const handleMergeContacts = async () => {
        const response = await fetch('http://localhost:3000/contacts/merge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contactNames: ['John Doe', 'Jane Doe'] }),  // Пример с конкретни имена
        });
        const data = await response.json();
        setContacts([...contacts, data]);
    };

    return (
        <div>
            <h1>Phone Book</h1>
            <input
                type="text"
                placeholder="Name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            />
            <input
                type="text"
                placeholder="Phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
            <button onClick={isEditing ? handle